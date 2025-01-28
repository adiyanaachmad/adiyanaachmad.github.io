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
const navLink = document.querySelectorAll('.nav-link')

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
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollDown = window.scrollY;
    sections.forEach((current) => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id');

        const sectionsClasses = document.querySelectorAll(
            `.nav-menu a[href*="${sectionId}"], .nav__link-mobile[href*="${sectionId}"]`
        );

        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
       
            sectionsClasses.forEach((link) => link.classList.add('active-link'));
        } else {
            
            sectionsClasses.forEach((link) => link.classList.remove('active-link'));
        }
    });
};

window.addEventListener('scroll', scrollActive);


/*=============== DARK LIGHT THEME ===============*/ 
const themeButtons = document.querySelectorAll('.night')
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

/*=============== NAVIGATION MOBILE ===============*/
