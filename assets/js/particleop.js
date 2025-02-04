// Inisialisasi Particles.js
let particleSize = 5; // Set default ukuran partikel

particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 50,  // Set awal jumlah partikel ke 50
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#FEFEFE"
        },
        "shape": {
            "type": "circle"
        },
        "opacity": {
            "value": 0.5
        },
        "size": {
            "value": particleSize, // Gunakan nilai default 5
            "random": false
        },
        "move": {
            "enable": true,
            "speed": 1,
            "direction": "none"
        }
    },
    "retina_detect": true
});

// Variabel untuk menyimpan nilai kecepatan partikel
let particleSpeed = 1;

// Fungsi untuk mengubah jumlah partikel
function slider() {
    const mySlider = document.getElementById("my-slider");
    const sliderValue = document.getElementById("slider-value");
    let rawValue = parseInt(mySlider.value);
    let particleCount = rawValue * 10;
    let percentage = (rawValue - mySlider.min) / (mySlider.max - mySlider.min) * 100;

    mySlider.style.background = `linear-gradient(to right, #3264fe ${percentage}%, #d5d5d5 ${percentage}%)`;
    sliderValue.textContent = particleCount;

    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        let currentSize = particleSize; // Simpan ukuran partikel saat ini
        window.pJSDom[0].pJS.particles.number.value = particleCount;
        window.pJSDom[0].pJS.fn.particlesRefresh();

        // Setelah refresh, update ukuran partikel kembali
        let particles = window.pJSDom[0].pJS.particles.array;
        particles.forEach(particle => {
            particle.radius = currentSize; // Gunakan ukuran sebelumnya
        });

        window.pJSDom[0].pJS.particles.size.value = currentSize;
        window.pJSDom[0].pJS.particles.move.speed = particleSpeed;
    }
}

// Fungsi untuk memperbarui latar belakang slider kecepatan
function updateSliderBackground() {
    const slider = document.getElementById("particle-speed-slider");
    const sliderValue = document.getElementById("slider-value-init");
    const rawValue = parseInt(slider.value);
    const max = slider.max;
    let percentage = (rawValue - slider.min) / (max - slider.min) * 100;

    sliderValue.textContent = rawValue;
    slider.style.background = `linear-gradient(to right, #3264fe ${percentage}%, #d5d5d5 ${percentage}%)`;

    particleSpeed = rawValue;

    if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom[0].pJS.particles.move.speed = particleSpeed;
    }
}

// Pastikan slider diinisialisasi dengan benar
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("my-slider").value = 5;
    slider();

    document.getElementById("particle-speed-slider").value = 1;
    updateSliderBackground();

    // Set nilai default slider size ke 5
    const sizeSlider = document.getElementById("particle-size");
    sizeSlider.value = 5;
    document.getElementById("slider-value-size").textContent = 5;
});

function updateSliderSize() {
    const slider = document.getElementById("particle-size");
    const sliderValue = document.getElementById("slider-value-size");
    particleSize = parseInt(slider.value);
    sliderValue.textContent = particleSize;

    // Menghitung persentase untuk latar belakang slider
    let percentage = (particleSize - slider.min) / (slider.max - slider.min) * 100;

    // Batasi persentase agar tidak melebihi 100% (untuk menghindari latar belakang melewati thumb)
    percentage = Math.min(percentage, 100); 
    
    // Menambahkan latar belakang gradien pada slider sesuai posisi thumb
    slider.style.background = `linear-gradient(to right, #3264fe ${percentage}%, #d5d5d5 ${percentage}%)`;

    if (window.pJSDom && window.pJSDom.length > 0) {
        let particles = window.pJSDom[0].pJS.particles.array;
        particles.forEach(particle => {
            particle.radius = particleSize; // Perbarui ukuran tiap partikel
        });

        // Perbarui nilai dalam konfigurasi tetapi tanpa mereset partikel
        window.pJSDom[0].pJS.particles.size.value = particleSize;
    }
}

// Pastikan untuk memperbarui slider saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
    const sizeSlider = document.getElementById("particle-size");
    sizeSlider.value = 5;  // Set nilai awal slider ke 5
    updateSliderSize(); // Update latar belakang slider
});
