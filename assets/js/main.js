/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

if(navClose){
    navClose.addEventListener('click',() =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () =>{
    const navMenu = document.getElementById('nav-menu')
        navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== SHADOW HEADER ===============*/
const shadowHeader = () =>{
    const header = document.getElementById('header')
    this.scrollY >= 50 ? header.classList.add('shadow-header')
                        : header.classList.remove('shadow-header')
}
window.addEventListener('scroll', shadowHeader)

/*=============== EMAIL JS ===============*/


/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
    const scrollUp = document.getElementById('scroll-up')
    this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
                        : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 50,
            sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

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
document.querySelectorAll(".image-comparison").forEach((comparison) => {
  const slider = comparison.querySelector(".slider");
  const beforeImage = comparison.querySelector(".before-image");
  const sliderLine = comparison.querySelector(".slider-line");
  const sliderIcon = comparison.querySelector(".slider-icon");

  // Set posisi awal di kiri (0%)
  slider.value = 0;
  beforeImage.style.width = "0%";
  sliderLine.style.left = "0%";
  sliderIcon.style.left = "0%";

  slider.addEventListener("input", (e) => {
     let sliderValue = e.target.value + "%";

     beforeImage.style.width = sliderValue;
     sliderLine.style.left = sliderValue;
     sliderIcon.style.left = sliderValue;
  });
});