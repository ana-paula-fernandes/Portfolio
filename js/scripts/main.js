
document.addEventListener('DOMContentLoaded', () => {

const lenis = new Lenis({
  duration: 1.2,
  smoothWheel: true,
  smoothTouch: false,
  wheelMultiplier: 1,
  touchMultiplier: 1,
  infinite: false
});

// Atualiza o ScrollTrigger junto com o Lenis
lenis.on('scroll', ScrollTrigger.update);

// Loop de animação do Lenis
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Evita que o GSAP altere a velocidade do Lenis
gsap.ticker.lagSmoothing(0);

  /* ==========================================================================
    1. CONTROLE DE TEMA CLARO / ESCURO (DARK / LIGHT MODE)
     ========================================================================== */
  const themeToggleBtn = document.querySelector('#theme-toggle');
  const htmlElement = document.documentElement;

  // Recupera tema salvo ou detecta preferência do sistema
  const savedTheme = localStorage.getItem('anap_theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = savedTheme ? savedTheme : (systemPrefersLight ? 'light' : 'dark');

  // Aplica o tema inicial
  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('anap_theme', theme);

    if (themeToggleBtn) {
      const label = themeToggleBtn.querySelector('.theme-label');
      if (label) {
        label.textContent = theme === 'dark' ? 'CLARO' : 'ESCURO';
      }
    }
  }

  /* ==========================================================================
    2. MENU MOBILE RESPONSIVO
     ========================================================================== */
  const mobileToggle = document.querySelector('#mobile-toggle');
  const navbar = document.querySelector('#navbar');

  if (mobileToggle && navbar) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navbar.classList.toggle('active');
    });

    // Fecha menu ao clicar em qualquer link
    navbar.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navbar.classList.remove('active');
      });
    });
  }

  /* ==========================================================================
    3. ROLAGEM SUAVE DO BOTÃO CONTATO DO HEADER
     ========================================================================== */
  const contatoHeaderBtn = document.querySelector('.left-container .button');
  if (contatoHeaderBtn) {
    contatoHeaderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#contato');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ==========================================================================
     4. GSAP & SCROLLTRIGGER: PARALLAX E ANIMAÇÕES FLUIDAS
     ========================================================================== */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  
    // Parallax suave no vídeo de fundo da Hero
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
      gsap.to(heroVideo, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: {
          trigger: '.s-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    // Marca d'água "CONTATO" parallax suave
    const contatoBg = document.querySelector('.contato__background');
    if (contatoBg) {
      gsap.to(contatoBg, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.contato',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    }

    // Composição "Sobre mim": parallax sutil e entrada do nome.
    const aboutCard = document.querySelector('.about-card');
    if (aboutCard) {
      const aboutMedia = gsap.matchMedia();

      aboutMedia.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to('.about-card__portrait', {
          y: -42,
          scale: 1.04,
          ease: 'none',
          scrollTrigger: {
            trigger: aboutCard,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });

        gsap.to('.about-card__robot', {
          y: 34,
          scale: 1.02,
          ease: 'none',
          scrollTrigger: {
            trigger: aboutCard,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
          }
        });

        gsap.from('.about-card__name', {
          y: 32,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: aboutCard,
            start: 'top 72%',
            toggleActions: 'play none none reverse'
          }
        });
      });
    }
  }

gsap.from(".box", {
  opacity: 0,
  duration: 1,
  filter: "blur(20px)",
  stagger: 3,
  scrollTrigger: {
    trigger: ".box",
    markers: false,
    start: "0% 60%",
    end: "100% 60%",
    scrub: true
  }
});

  /* ==========================================================================
    6. FORMULÁRIO DE CONTATO COM FEEDBACK
     ========================================================================== */
emailjs.init({
  publicKey: "fIjQE4lvZfk3fDIUL"
});

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const button = contactForm.querySelector(".contato__button");
    const buttonText = button.querySelector("span:first-child");

    button.disabled = true;
    buttonText.textContent = "Enviando...";

    emailjs.sendForm(
      "service_j8kmtwu",
      "template_4li5y78",
      contactForm
    )
    .then(function () {

      contactForm.innerHTML = `
        <div class="contato__sucesso" data-aos="zoom-in">
          <span>✓</span>
          <h3>Mensagem enviada!</h3>
          <p>
            Obrigada pelo contato. Em breve entrarei em contato com você.
          </p>
        </div>
      `;

    })
    .catch(function (error) {

      console.error("Erro ao enviar:", error);

      button.disabled = false;
      buttonText.textContent = "Erro ao enviar";

      setTimeout(function () {
        buttonText.textContent = "Enviar mensagem";
      }, 3000);

    });
  });
}

  /* ==========================================================================
     7. INICIALIZAÇÃO DO AOS (ANIMATE ON SCROLL)
     ========================================================================== */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 80
    });
  }
});

// Aguarda o DOM (HTML) carregar completamente
document.addEventListener('DOMContentLoaded', () => {
  // Seleciona o vídeo através da classe que você criou
  const heroVideo = document.querySelector('.hero-video');

  if (heroVideo) {
    // Altere o número abaixo para a velocidade desejada (ex: 1.5, 2.0, 3.0)
    heroVideo.playbackRate = 3; 
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const target = document.querySelector(".typing-target");
  if (!target) return;

  // Salva o texto original ("ANA#PAULA") e limpa o elemento
  const fullText = target.innerText;
  target.innerText = "";
  
  // Ativa a classe para mostrar o cursor piscando
  target.classList.add("active-typing");

  let currentIdx = 0;

  function type() {
    if (currentIdx < fullText.length) {
      target.innerText += fullText[currentIdx];
      currentIdx++;
      // Velocidade da digitação: 150ms por caractere (ajuste se quiser mais rápido)
      setTimeout(type, 300);
    } else {
      // Opcional: Remove o cursor 1 segundo após terminar de digitar
      setTimeout(() => {
        target.classList.remove("active-typing");
      }, 1000);
    }
  }

  // Inicia a digitação
  type();
});

let mm = gsap.matchMedia();

// Define que a animação só vai rodar se a tela tiver largura mínima de 768px
mm.add("(min-width: 768px)", () => {
  
  gsap.from(".projetos", {
    y: "-40%",
    immediateRender: false,
    scrollTrigger: {
      trigger: ".projetos",
      markers: false,
      scrub: 1,
      invalidateOnRefresh: true,
      end: "100% 100%"
    }
  });
});

gsap.set(".text-animation-js", { autoAlpha: 1 });

SplitText.create(".text-animation-js", { 
  type: "lines, words, chars", 
  mask: "lines", // Nota: certifique-se de que sua versão do SplitText suporta "mask"
  autoSplit: true, 
  onSplit(self) { 
    return gsap.from(self.chars, { 
      duration: 1, 
      y: 100, 
      autoAlpha: 0, 
      stagger: 0.1,
      scrollTrigger: {
		trigger: ".text-animation-js",
		markers: false,
		scrub: 2,
    invalidateOnRefresh: true,
    end: "bottom 70%",
	}
    }); 
  } 
});

gsap.registerPlugin(ScrollTrigger);

const tlContato = gsap.timeline({
  scrollTrigger: {
    trigger: "#contato",
    start: "top 95%",             // Ativa assim que a bordinha superior do contato toca a base da tela
    toggleActions: "play none none reverse"
  }
});

tlContato
  // 1. A seção inteira desliza por cima da anterior (subindo de y: 150 para 0) e clareia
  .fromTo("#contato", 
    { y: 150, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
  )
  
  // 2. O título "CONTATO" surge logo em seguida
  .fromTo(".contato__intro", 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
    "-=0.8" // Começa bem antes para criar o efeito parallax fluido
  )
  
  // 3. Informações e Formulário entram de forma sincronizada pelas laterais
  .fromTo(".contato__info", 
    { x: -40, opacity: 0 }, 
    { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
    "-=0.5"
  )
  .fromTo(".contato__form", 
    { x: 40, opacity: 0 }, 
    { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
    "-=0.8"
  )
  
  // 4. Imagem mobile finaliza a entrada
  .fromTo(".contato .img-mobile", 
    { y: 40, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
    "-=0.4"
  );




