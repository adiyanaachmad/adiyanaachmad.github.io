/*==================== SHOW NAVBAR ====================*/
const showMenu = (headerToggle, navbarId) => {
    const toggleBtn = document.getElementById(headerToggle),
          nav = document.getElementById(navbarId);
    
    // Validasi bahwa variabel ada
    if (toggleBtn && nav) {
        toggleBtn.addEventListener('click', () => {
            // Tambahkan atau hapus kelas 'show-menu' pada elemen nav
            nav.classList.toggle('show-menu');
            // Ubah ikon
            if (toggleBtn.classList.contains('fi-br-menu-burger')) {
                toggleBtn.classList.remove('fi-br-menu-burger');
                toggleBtn.classList.add('fi-br-circle-xmark');
            } else {
                toggleBtn.classList.remove('fi-br-circle-xmark');
                toggleBtn.classList.add('fi-br-menu-burger');
            }
        });
    }
};

showMenu('header-toggle', 'navbar');

/*==================== LINK ACTIVE ====================*/
// const linkColor = document.querySelectorAll('.nav__link')

// function colorLink(){
//     linkColor.forEach(l => l.classList.remove('active'))
//     this.classList.add('active')
// }

// linkColor.forEach(l => l.addEventListener('click', colorLink))

const themeButton = document.getElementById('theme-button');
const themeSpan = document.getElementById('theme-span');
const darkTheme = 'dark-theme';
const iconThemeOn = 'fi-br-toggle-on';
const iconThemeOff = 'fi-br-toggle-off';

// Previously selected theme (if user selected)
const selectedTheme = localStorage.getItem('selected-theme');

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconThemeOn) ? iconThemeOn : iconThemeOff;

// We validate if the user previously chose a theme
if (selectedTheme) {
    // If the validation is fulfilled, we set the theme and icon based on previous selection
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[selectedTheme === 'dark' ? 'add' : 'remove'](iconThemeOn);
    themeButton.classList[selectedTheme === 'dark' ? 'remove' : 'add'](iconThemeOff);
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Toggle the dark theme
    document.body.classList.toggle(darkTheme);
    
    // Toggle the icon class
    if (themeButton.classList.contains(iconThemeOn)) {
        themeButton.classList.remove(iconThemeOn);
        themeButton.classList.add(iconThemeOff);
    } else {
        themeButton.classList.remove(iconThemeOff);
        themeButton.classList.add(iconThemeOn);
    }

    // Save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme());
    localStorage.setItem('selected-icon', getCurrentIcon());
});