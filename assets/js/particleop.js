// Inisialisasi Particles.js
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
            "value": 8,
            "random": true
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

    // Perbaiki background agar sesuai dengan thumb
    mySlider.style.background = `linear-gradient(to right, #3264fe ${percentage}%, #d5d5d5 ${percentage}%)`;

    sliderValue.textContent = particleCount;

    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        window.pJSDom[0].pJS.particles.number.value = particleCount;
        window.pJSDom[0].pJS.fn.particlesRefresh();

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

    // Pastikan gradient tidak melebihi thumb
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
});
