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


function swapImage(thumb) {
    const mainImg = thumb.closest('.card-gallery').querySelector('.gallery-main');
    mainImg.src = thumb.src;
}

function openLightbox(src) {
    const box = document.createElement('div');
    box.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
    box.innerHTML = `<img src="${src}" style="max-width:90%;max-height:90%;border-radius:8px;box-shadow:0 0 30px rgba(160,32,240,0.5);">`;
    box.onclick = () => box.remove();
    document.body.appendChild(box);
}