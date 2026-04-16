'use strict';

// ===== SCROLL SUAVE =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute('href'));

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});


// ===== NAVBAR CAMBIO AL SCROLL =====
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
    header.style.background = "linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)";
  } else {
    header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
    header.style.background = "linear-gradient(90deg, #ffffff 0%, #f8fafc 100%)";
  }
});


// ===== ANIMACIONES AL HACER SCROLL =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.2
});

document.querySelectorAll('.card, .section-title, .about-grid, .product, .form')
  .forEach(el => {
    el.classList.add('hidden');
    observer.observe(el);
  });


// ===== VALIDACIÓN FORMULARIO =====
const form = document.querySelector('.form');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const inputs = form.querySelectorAll('input, textarea');
    let valid = true;

    inputs.forEach(input => {
      if (input.value.trim() === '') {
        input.style.border = "1px solid red";
        valid = false;
      } else {
        input.style.border = "1px solid #ccc";
      }
    });

    if (valid) {
      alert("Mensaje enviado correctamente 🚀");
      form.reset();
    } else {
      alert("Por favor completa todos los campos");
    }
  });
}


// ===== BOTÓN WHATSAPP =====
const whatsappBtn = document.querySelector('.whatsapp-float');

if (whatsappBtn) {
  whatsappBtn.addEventListener('click', () => {
    const phone = "59391234567"; // CAMBIAR
    const message = encodeURIComponent("Hola, quiero información sobre sus servicios");

    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  });
}


// ===== EFECTO HOVER AVANZADO (CARDS) =====
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.transform = `
      perspective(1000px)
      rotateX(${(y - rect.height / 2) / 20}deg)
      rotateY(${-(x - rect.width / 2) / 20}deg)
      scale(1.03)
    `;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = "rotateX(0) rotateY(0) scale(1)";
  });
});


// ===== CONTADOR ANIMADO =====
function animateCounter(el, target) {
  let count = 0;
  const speed = target / 100;

  const update = () => {
    count += speed;
    if (count < target) {
      el.innerText = Math.floor(count);
      requestAnimationFrame(update);
    } else {
      el.innerText = target;
    }
  };

  update();
}

// EJEMPLO USO:
// animateCounter(document.querySelector('#counter1'), 1200);


// ===== APARICIÓN SUAVE =====
const style = document.createElement('style');
style.innerHTML = `
.hidden {
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.6s ease;
}

.show {
  opacity: 1;
  transform: translateY(0);
}
`;
document.head.appendChild(style);