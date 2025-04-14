/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Tutup menu mobile
        document.getElementById('nav-menu').classList.remove('show-menu');
    });
});

/*=============== SHADOW HEADER ===============*/
const shadowHeader = () => {
    const header = document.getElementById('header')
    this.scrollY >= 50 ? header.classList.add('shadow-header')
        : header.classList.remove('shadow-header')
}
window.addEventListener('scroll', shadowHeader)

/*=============== EMAIL JS ===============*/


/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
    const scrollUp = document.getElementById('scroll-up')
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
        : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/

const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id');

        const navLink = document.querySelector('#nav-menu a[href*=' + sectionId + ']');

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active-link');
            } else {
                navLink.classList.remove('active-link');
            }
        }
    });
}
window.addEventListener('scroll', scrollActive);


/*=============== DARK LIGHT THEME ===============*/
const themeButtons = document.querySelectorAll('.change-theme')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-fill'

// Tema yang sebelumnya dipilih (jika ada)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// Mendapatkan tema saat ini dari body
const getCurrentTheme = () =>
    document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () =>
    themeButtons[0].classList.contains(iconTheme) ? 'ri-moon-clear-fill' : 'ri-sun-fill'

// Validasi jika pengguna sebelumnya memilih tema
if (selectedTheme) {
    // Aktifkan atau nonaktifkan tema berdasarkan penyimpanan lokal
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)

    themeButtons.forEach(button => {
        button.classList[selectedIcon === 'ri-moon-clear-fill' ? 'add' : 'remove'](iconTheme)
    })
}

// Tambahkan event listener ke semua tombol tema
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Toggle tema di body dan ikon di tombol
        document.body.classList.toggle(darkTheme)
        themeButtons.forEach(btn => btn.classList.toggle(iconTheme))

        // Simpan tema dan ikon yang dipilih ke localStorage
        localStorage.setItem('selected-theme', getCurrentTheme())
        localStorage.setItem('selected-icon', getCurrentIcon())
    })
})

/*=============== SCROLL REVEAL ANIMATION ===============*/
document.addEventListener("DOMContentLoaded", () => {
    const projectCards = document.querySelectorAll(".projects__card");

    projectCards.forEach((card) => {
        const toggleButton = card.querySelector(".projects__button");
        const sliderLine = card.querySelector(".slider-line");
        const sliderIcon = card.querySelector(".slider-icon");
        const slider = card.querySelector(".slider");
        const beforeImage = card.querySelector(".before-image");

        toggleButton.addEventListener("click", (e) => {
            e.preventDefault();

            if (slider.classList.contains("hidden")) {
                // Aktifkan Image Comparison untuk card ini
                sliderLine.classList.remove("hidden");
                sliderIcon.classList.remove("hidden");
                slider.classList.remove("hidden");
                slider.removeAttribute("disabled"); // Aktifkan slider
                toggleButton.textContent = "ON";
            } else {
                // Matikan Image Comparison dengan animasi pergeseran
                slider.value = 0;
                beforeImage.style.transition = "width 0.5s ease"; // Tambahkan animasi
                beforeImage.style.width = "0%";
                sliderLine.style.transition = "left 0.5s ease"; // Tambahkan animasi
                sliderIcon.style.transition = "left 0.5s ease"; // Tambahkan animasi
                sliderLine.style.left = "0%";
                sliderIcon.style.left = "0%";

                setTimeout(() => {
                    sliderLine.classList.add("hidden");
                    sliderIcon.classList.add("hidden");
                    slider.classList.add("hidden");
                    slider.setAttribute("disabled", "true"); // Matikan slider
                    toggleButton.textContent = "OFF";
                }, 500); // Tunggu animasi selesai sebelum disembunyikan
            }
        });

        // Pastikan setiap slider memiliki event listener masing-masing
        slider.addEventListener("input", (e) => {
            let sliderValue = e.target.value + "%";
            beforeImage.style.transition = sliderValue // Hapus animasi agar responsif
            beforeImage.style.width = sliderValue;
            sliderLine.style.left = sliderValue;
            sliderIcon.style.left = sliderValue;
        });
    });
});

window.onload = function () {
    particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": 60,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#FEFEFE"
            },
            "line_linked": {
                "enable": false,
                "distance": 100,
                "color": "#ffffff",
                "opacity": 0.5,
                "width": 2
            },
            "shape": {
                "type": "circle"
            },
            "opacity": {
                "value": 1.0,
            },
            "size": {
                "value": 5,
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
};

// document.getElementById('view360Btn').addEventListener('click', function(e) {
//     e.preventDefault(); // Mencegah default link behavior
//     document.getElementById('container3D').classList.remove('hidden');
//   });

//   document.getElementById('closePopup').addEventListener('click', function() {
//     document.getElementById('container3D').classList.add('hidden');
//   });