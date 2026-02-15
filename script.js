// Simple Scroll Reveal Effect
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);

// Initial call to reveal items on page load
reveal();


const menuIcon = document.getElementById('menu-icon');
const navlist = document.getElementById('navlist');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// 1. Hamburger Toggle Logic
menuIcon.onclick = () => {
    navlist.classList.toggle('open');
    
    // Switch between bars and X icon
    const icon = menuIcon.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
};



// Close menu when a user clicks a link
navlist.onclick = () => {
    navlist.classList.remove('open');
    menuIcon.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
};