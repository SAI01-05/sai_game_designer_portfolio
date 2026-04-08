(() => {
  "use strict";

  /* ======================================================
     UI ELEMENT REFERENCES
  ====================================================== */
  const UI = {
    enterBtn: document.getElementById("enter-btn"),
    startScreen: document.getElementById("start-screen"),
    mainContent: document.getElementById("main-content"),
    loading: document.getElementById("loading"),
    nav: document.querySelector(".nav"),
    sections: document.querySelectorAll("section"),
    navLinks: document.querySelectorAll(".menu a"),
    canvas: document.getElementById("particles"),
    email: document.getElementById("email-link"),
    phone: document.getElementById("phone-link"),
    buttons: document.querySelectorAll("button, .btn, a"),
    hamburger: document.getElementById("hamburger"),
    menu: document.getElementById("menu")
  };

  /* ======================================================
     CONTACT SETUP (EMAIL + PHONE)
  ====================================================== */

  const emailAddress = "saihalwai01@gmail.com";
  if (UI.email) {
    UI.email.textContent = emailAddress;
    UI.email.href =
      "https://mail.google.com/mail/?view=cm&fs=1&to=" + emailAddress;
    UI.email.target = "_blank";
    UI.email.rel = "noopener noreferrer";
  }

  const phoneNumber = "+91 75170 20206";
  if (UI.phone) {
    UI.phone.textContent = phoneNumber;
    UI.phone.href = "tel:" + phoneNumber.replace(/\s/g, "");
  }

  /* ======================================================
     SOUND SYSTEM
  ====================================================== */

  const startSound = new Audio("sounds/start.wav");
  startSound.volume = 0.7;

  const clickSound = new Audio("sounds/click.wav");
  clickSound.volume = 0.5;

  UI.buttons.forEach(btn => {
    if (btn.id !== "enter-btn") {
      btn.addEventListener("click", () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
      });
    }
  });

  /* ======================================================
     START GAME SEQUENCE
  ====================================================== */

  let started = false;

  function startGame() {
    if (started) return;
    started = true;

    UI.enterBtn.disabled = true;
    UI.loading.classList.remove("hidden");

    startSound.currentTime = 0;
    startSound.play().catch(() => {});

    setTimeout(() => {
      UI.startScreen.classList.add("fade-out");

      setTimeout(() => {
        UI.startScreen.style.display = "none";
        UI.mainContent.classList.remove("hidden");
        UI.nav.classList.remove("nav-hidden");

        setTimeout(() => {
    setActiveLink();
  }, 100);
        revealOnScroll();
      }, 800);

    }, 2000);
  }

  UI.enterBtn.addEventListener("click", startGame);

  window.addEventListener("keydown", e => {
    if (e.key === "Enter" && !started) {
      startGame();
    }
  });

  /* ======================================================
     HAMBURGER MENU
  ====================================================== */

  if (UI.hamburger) {
    UI.hamburger.addEventListener("click", () => {
      UI.menu.classList.toggle("active");
    });
  }

  UI.navLinks.forEach(link => {
    link.addEventListener("click", () => {
      UI.menu.classList.remove("active");
    });
  });

  /* ======================================================
     SCROLL REVEAL ANIMATION
  ====================================================== */

  function revealOnScroll() {
    UI.sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      const trigger = window.innerHeight * 0.85;

      if (top < trigger) {
        section.classList.add("show");
      }
    });
  }

  /* ======================================================
     NAVBAR ACTIVE LINK SYSTEM
  ====================================================== */

  function setActiveLink() {
    let current = "";

    UI.sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    UI.navLinks.forEach(link => {
      link.classList.remove("active");

      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", () => {
    UI.nav.classList.toggle("scrolled", window.scrollY > 20);
    revealOnScroll();
    setActiveLink();
  });

  setActiveLink();

  /* ======================================================
     PARTICLES SYSTEM (Canvas Background)
  ====================================================== */

  const ctx = UI.canvas.getContext("2d");

  function resizeCanvas() {
    UI.canvas.width = window.innerWidth;
    UI.canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const shapes = ["circle", "square", "plus"];
  const particleCount = window.innerWidth < 768 ? 60 : 120;

  const particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * UI.canvas.width,
    y: Math.random() * UI.canvas.height,
    size: Math.random() * 2 + 1,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    type: shapes[Math.floor(Math.random() * shapes.length)]
  }));

  function drawParticle(p) {
    ctx.strokeStyle = "#00ffff";
    ctx.fillStyle = "#00ffff";

    if (p.type === "circle") {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === "square") {
      ctx.fillRect(p.x, p.y, p.size, p.size);
    } else {
      ctx.beginPath();
      ctx.moveTo(p.x - p.size, p.y);
      ctx.lineTo(p.x + p.size, p.y);
      ctx.moveTo(p.x, p.y - p.size);
      ctx.lineTo(p.x, p.y + p.size);
      ctx.stroke();
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, UI.canvas.width, UI.canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > UI.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > UI.canvas.height) p.vy *= -1;

      drawParticle(p);
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  /* ======================================================
     SKILL TREE INTERACTION
  ====================================================== */

  const skillNodes = document.querySelectorAll(".skill-node");
  const skillCore = document.querySelector(".skill-core");

  skillNodes.forEach(node => {
    node.addEventListener("click", () => {
      skillNodes.forEach(n => n.classList.remove("active"));
      node.classList.add("active");

      skillCore.classList.remove("pulse");
      void skillCore.offsetWidth; // reflow trick
      skillCore.classList.add("pulse");
    });
  });

})();

