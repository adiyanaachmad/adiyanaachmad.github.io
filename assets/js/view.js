import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

let isAntialiasingOn = false;
let isGridHelperOn = true;

let scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let renderer;
let controls;

let currentAnimation = "NONE";
let animationIndex = 0;

let animationSpeed = 0.5;

let isShadowOn = false;

function showLoader() {
    const loader = document.getElementById("wifi-loader");
    if (loader) loader.style.display = "flex";

    // Auto-hide after 10 seconds
    setTimeout(() => {
        hideLoader();
    }, 10000);
}

function hideLoader() {
    const loader = document.getElementById("wifi-loader");
    if (loader) loader.style.display = "none";
}

function createRenderer() {
    // Simpan posisi kamera dan target
    const camPosition = camera.position.clone();
    const controlTarget = controls?.target?.clone(); // jika ada

    if (renderer) {
        renderer.dispose();
        document.getElementById("container3D").removeChild(renderer.domElement);
    }

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: isAntialiasingOn });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("container3D").appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;

    // Kembalikan posisi kamera dan target jika sebelumnya sudah ada
    camera.position.copy(camPosition);
    if (controlTarget) {
        controls.target.copy(controlTarget);
        controls.update();
    }
}
createRenderer();

const gridHelper = new THREE.GridHelper(200, 50);

gridHelper.position.y = 0;
scene.add(gridHelper);
gridHelper.visible = isGridHelperOn;

const loader = new GLTFLoader();
let object;

let originalYPosition = 0;

function resetCameraView() {
    if (!object) return;

    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const offset = Math.max(size.x, size.y, size.z) * 1.5; // lebih besar agar objek terlihat jelas

    // Isometric kanan atas (x=+, y=+, z=-)
    const direction = new THREE.Vector3(1, 1, 1).normalize();
    const targetPosition = center.clone().add(direction.multiplyScalar(offset));

    const startPosition = camera.position.clone();
    const startTime = performance.now();
    const duration = 1000; // ms

    function animateCamera(time) {
        const elapsed = time - startTime;
        const t = Math.min(elapsed / duration, 1);

        camera.position.lerpVectors(startPosition, targetPosition, t);
        controls.target.copy(center);
        controls.update();

        if (t < 1) {
            requestAnimationFrame(animateCamera);
        }
    }

    requestAnimationFrame(animateCamera);
}

const resetCheckbox = document.getElementById("toggle-reset");
const resetLabel = document.querySelector("label[for='toggle-reset']");

if (resetCheckbox && resetLabel) {
    resetCheckbox.addEventListener("change", () => {
        if (resetCheckbox.checked) {
            resetCameraView();

            // Delay sedikit agar user melihat animasi, lalu matikan toggle
            setTimeout(() => {
                resetCheckbox.checked = false;
            }, 1000); // 0.5 detik delay
        }
    });
}

function loadModel(objName) {
    if (!objName) return;

    showLoader();

    if (object) {
        scene.remove(object);
        object.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                else child.material.dispose();
            }
        });
        object = null;
    }

    loader.load(`assets/models/${objName}/scene.gltf`, function (gltf) {
        object = gltf.scene;
        // Deteksi dan ubah material kaca
        object.traverse(child => {
            if (child.isMesh && child.name.toLowerCase().includes("glass")) {
                child.material.transparent = true;
                child.material.opacity = 0.6; // sebelumnya 0.25 → naikkan
                child.material.color = new THREE.Color(0xaadfff); // lebih terang
                child.material.metalness = 0.1; // biar tetap reflektif, tapi tidak mati
                child.material.roughness = 0.05; // biar refleksi halus
                child.material.envMapIntensity = 2; // jika kamu punya envMap
                child.material.refractionRatio = 0.98;
                child.material.side = THREE.DoubleSide;

                child.material = new THREE.MeshPhysicalMaterial({
                    color: 0xaadfff,
                    transmission: 1.0, // kaca
                    transparent: true,
                    opacity: 0.6,
                    metalness: 0,
                    roughness: 0,
                    thickness: 0.5,
                    envMapIntensity: 1.5
                });
            }
        });
        object.scale.set(12, 12, 12); // Bisa disesuaikan

        // Reset posisi awal
        object.position.set(0, 0, 0);

        // Hitung bounding box
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Geser object agar bagian bawah tepat di atas grid (y = 0)
        object.position.x = -center.x;
        object.position.z = -center.z;
        object.position.y = Math.max(-box.min.y, 0);  // Pastikan objek berada di atas grid
        originalYPosition = object.position.y;

        setTimeout(() => {
            scene.add(object);

            // Matikan shadow setiap kali model baru dimuat
            isShadowOn = false;
            directionalLight.castShadow = false;


            if (object) {
                object.traverse(child => {
                    if (child.isMesh) {
                        child.castShadow = false;
                        child.receiveShadow = false;
                    }
                });
            }

            // Sinkronisasi UI toggle
            const shadowCheckbox = document.getElementById("toggle-shadow");
            const shadowStatus = document.querySelector(".init__3d.shadow .status h3");
            if (shadowCheckbox) shadowCheckbox.checked = false;
            if (shadowStatus) shadowStatus.innerText = "OFF";

            // Atur kamera agar pas dan tetap melihat ke tengah objek
            const maxDim = Math.max(size.x, size.y, size.z);
            const cameraZ = maxDim * 0.7;
            camera.position.set(center.x + cameraZ, center.y + cameraZ, center.z + cameraZ);
            camera.lookAt(center);

            controls.target.copy(center);
            controls.update();

            // Tampilkan statistik mesh
            const detailContainers = document.querySelectorAll(".view__detail_3d");
            if (detailContainers.length >= 2) {
                detailContainers[0].querySelector(".title h5").innerText = "Triangle";
                detailContainers[0].querySelector(".indicator .angka").innerText = Math.floor(totalTriangles).toLocaleString();

                detailContainers[1].querySelector(".title h5").innerText = "Vertices";
                detailContainers[1].querySelector(".indicator .angka").innerText = totalVertices.toLocaleString();
            }

            hideLoader();
        }, 7000); // 10 detik

        controls.target.copy(center);
        controls.update();

        // Hitung statistik mesh
        let totalVertices = 0;
        let totalTriangles = 0;

        object.traverse(child => {
            if (child.isMesh && child.geometry) {
                const geom = child.geometry;
                if (geom.attributes.position) {
                    totalVertices += geom.attributes.position.count;
                }
                if (geom.index) {
                    totalTriangles += geom.index.count / 3;
                } else if (geom.attributes.position) {
                    totalTriangles += geom.attributes.position.count / 3;
                }
                if (child.isMesh) {
                    child.castShadow = isShadowOn;
                    child.receiveShadow = isShadowOn;
                }
                if (child.isMesh && child.name.toLowerCase().includes("glass")) {
                    // pengaturan material kaca yang sudah kamu punya...
                }
            }
        });

        const detailContainers = document.querySelectorAll(".view__detail_3d");
        if (detailContainers.length >= 2) {
            detailContainers[0].querySelector(".title h5").innerText = "Triangle";
            detailContainers[0].querySelector(".indicator .angka").innerText = Math.floor(totalTriangles).toLocaleString();

            detailContainers[1].querySelector(".title h5").innerText = "Vertices";
            detailContainers[1].querySelector(".indicator .angka").innerText = totalVertices.toLocaleString();
        }

    }, undefined, function (err) {
        console.error("Gagal memuat model:", objName, err);
    });
}

// ✅ LIGHTING
let ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(100, 150, 100);
directionalLight.castShadow = true;
scene.add(directionalLight);

directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.bias = -0.005; 
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;

let backLight = new THREE.DirectionalLight(0xffffff, 0.4);
backLight.position.set(-100, 100, -100);
scene.add(backLight);

// ✅ THEME TOGGLE
let isDarkTheme = false;
function setLightingTheme(dark) {
    if (dark) {
        scene.background = new THREE.Color(0x111111);
        ambientLight.intensity = 0.3;
        directionalLight.intensity = 0.5;
        backLight.intensity = 0.2;
    } else {
        scene.background = null;
        ambientLight.intensity = 0.7;
        directionalLight.intensity = 1;
        backLight.intensity = 0.4;
    }
}

const themeToggleBtn = document.getElementById("themeToggle");
if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        isDarkTheme = !isDarkTheme;
        setLightingTheme(isDarkTheme);
        themeToggleBtn.innerText = isDarkTheme ? "Light Theme" : "Dark Theme";
    });
}

// ✅ ANTIALIAS & GRID TOGGLE HANDLER
function toggleAntialiasing() {
    isAntialiasingOn = !isAntialiasingOn;
    document.querySelector(".init__3d.antialias .status h3").innerText = isAntialiasingOn ? "ON" : "OFF";
    createRenderer();
}

function toggleGridHelper() {
    isGridHelperOn = !isGridHelperOn;
    gridHelper.visible = isGridHelperOn;
    document.querySelector(".init__3d.gride .status h3").innerText = isGridHelperOn ? "ON" : "OFF";
}

function toggleShadow() {
    const shadowStatus = document.querySelector(".init__3d.shadow .status h3");
    if (shadowStatus) shadowStatus.innerText = isShadowOn ? "ON" : "OFF";

    if (object) {
        object.traverse(child => {
            if (child.isMesh) {
                child.castShadow = isShadowOn;
                child.receiveShadow = isShadowOn;
            }
        });
    }

    directionalLight.castShadow = isShadowOn;
}


const antialiasCheckbox = document.getElementById("toggle-antialias");
const gridCheckbox = document.getElementById("toggle-grid");
const animationSelect = document.getElementById("animationSelect");

if (antialiasCheckbox) {
    antialiasCheckbox.addEventListener("change", () => {
        isAntialiasingOn = antialiasCheckbox.checked;
        createRenderer(); // recreate dengan antialias true/false
    });
    antialiasCheckbox.checked = isAntialiasingOn;
}

if (gridCheckbox) {
    gridCheckbox.addEventListener("change", () => {
        isGridHelperOn = gridCheckbox.checked;
        gridHelper.visible = isGridHelperOn;
    });
    gridCheckbox.checked = isGridHelperOn;
}

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ✅ ANIMATION TOGGLE HANDLER
const animationCheckbox = document.getElementById("cb3-8");
const animationLabel = document.querySelector("label[for='cb3-8']");

if (animationCheckbox && animationLabel) {
    const animationModes = ["NONE", "TURN", "HOVER"];
    let animationIndex = 0;

    // Fungsi untuk update animasi dan label
    function updateAnimationMode() {
        currentAnimation = animationModes[animationIndex];

        // Set teks label (on/off bisa diganti langsung)
        animationLabel.setAttribute("data-tg-on", animationModes[animationIndex]);
        animationLabel.setAttribute("data-tg-off", animationModes[animationIndex]);

        // Checkbox hanya ON saat TURN atau HOVER, OFF saat NONE
        animationCheckbox.checked = currentAnimation !== "NONE";

        // Reset posisi/rotasi object
        if (object) {
            object.rotation.set(0, 0, 0);
            object.position.y = originalYPosition;
        }
    }

    animationCheckbox.addEventListener("click", () => {
        animationIndex = (animationIndex + 1) % animationModes.length;
        updateAnimationMode();
    });

    updateAnimationMode(); // Set kondisi awal
}

const speedToggle = document.getElementById("toggle-speed");
const speedToggleLabel = document.querySelector("label[for='toggle-speed']");

if (speedToggle) {
    const speedOptions = [0.5, 1.0, 1.5, 2.0];
    let speedIndex = 0;

    function updateSpeed() {
        animationSpeed = speedOptions[speedIndex];
        if (speedToggleLabel) {
            speedToggleLabel.setAttribute("data-tg-on", animationSpeed.toFixed(1));
            speedToggleLabel.setAttribute("data-tg-off", animationSpeed.toFixed(1));
        }

        // Set checkbox selalu "checked" supaya tampak aktif
        speedToggle.checked = true;
    }

    speedToggle.addEventListener("click", () => {
        speedIndex = (speedIndex + 1) % speedOptions.length;
        updateSpeed();
    });

    updateSpeed(); // Inisialisasi awal
}


function animate() {
    requestAnimationFrame(animate);

    if (object) {
        if (currentAnimation === "TURN") {
            object.rotation.y += 0.01 * animationSpeed;
            object.position.y = originalYPosition; // Tetap di atas grid
        } else if (currentAnimation === "HOVER") {
            const time = Date.now() * 0.005 * animationSpeed;
            object.position.y = Math.sin(time) * 4 + originalYPosition + 2;
        } else if (currentAnimation === "NONE") {
            object.rotation.set(0, 0, 0);
            object.position.y = originalYPosition;
        }
    }

    // Grid helper visibility
    const gridStatus = document.querySelector(".init__3d.gride .status h3");
    const gridCheckbox = document.getElementById("toggle-grid");

    if (currentAnimation === "NONE") {
        gridHelper.visible = isGridHelperOn; // ikuti toggle manual
    } else {
        gridHelper.visible = false; // hilangkan saat animasi aktif
    }

    // Update status teks dan checkbox grid
    if (gridStatus) gridStatus.innerText = gridHelper.visible ? "ON" : "OFF";
    if (gridCheckbox) gridCheckbox.checked = gridHelper.visible;

    controls.update();
    renderer.render(scene, camera);
}

animate();

// DROPDOWN MODEL
const dropdowns = document.querySelectorAll('.dropdown__modal');
dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const menu = dropdown.querySelector('.dropdown__menu');
    const options = dropdown.querySelectorAll('.dropdown__menu li');
    const selected = dropdown.querySelector('.selected');

    const activeOption = dropdown.querySelector('.dropdown__menu .active');
    if (activeOption) {
        selected.innerText = activeOption.innerText;
        loadModel(activeOption.dataset.model);
    }

    select.addEventListener('click', () => {
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu.classList.toggle('dropdown__menu-open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            const modelName = option.dataset.model;
            selected.innerText = option.innerText;
            selected.classList.add("text-fade-in");

            setTimeout(() => selected.classList.remove("text-fade-in"), 300);

            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('dropdown__menu-open');

            options.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');

            loadModel(modelName);
        });
    });

    window.addEventListener("click", e => {
        const size = dropdown.getBoundingClientRect();
        if (
            e.clientX < size.left ||
            e.clientX > size.right ||
            e.clientY < size.top ||
            e.clientY > size.bottom
        ) {
            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('dropdown__menu-open');
        }
    });
});

const shadowCheckbox = document.getElementById("toggle-shadow");

if (shadowCheckbox) {
    shadowCheckbox.addEventListener("change", () => {
        isShadowOn = shadowCheckbox.checked;
        toggleShadow();
    });

    shadowCheckbox.checked = isShadowOn;
}