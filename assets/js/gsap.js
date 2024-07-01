document.addEventListener("DOMContentLoaded", (event) => {
    // Animasi untuk .home-img-1 dengan loop
    gsap.from('.home-img-1', {duration: 2, y: -100, repeat: -1, yoyo: true});
    
    // Timeline untuk .home-img-2 dengan loop
    let tl1 = gsap.timeline({repeat: -1, yoyo: true});
    tl1.from('.home-img-2', {duration: 3, x: -400, y: -50, rotation: 32, scale: 0.5})
       .to('.home-img-2', {duration: 1, rotation: 15, scale: 1.2})
       .to('.home-img-2', {duration: 1, rotation: 0, scale: 1});

    // Timeline untuk .home-img-3 dengan loop
    let tl2 = gsap.timeline({repeat: -1, yoyo: true});
    tl2.from('.home-img-3', {duration: 4, x: 50, y: -50, rotation: 30})
       .to('.home-img-3', {duration: 5, rotation: 360});

    // Animasi untuk .home-img-4 dan .home-img-5 dengan loop
    gsap.from('.home-img-4', {duration: 5, y: -100, scale: 1.3, repeat: -1, yoyo: true});
    gsap.from('.home-img-5', {duration: 3, y: 100, repeat: -1, yoyo: true});
});