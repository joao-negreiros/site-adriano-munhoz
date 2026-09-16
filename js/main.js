// site Adriano Munhoz & Advogados Associados

document.addEventListener('DOMContentLoaded', () => {

  // ---- Header: fundo sólido ao rolar (ou com o menu mobile aberto) ----
  const header = document.querySelector('.site-header');
  const burger = document.getElementById('menuBurger');
  const nav = document.getElementById('mainNav');

  function syncHeaderState() {
    const shouldBeSolid = window.scrollY > 40 || (nav && nav.classList.contains('open'));
    header.classList.toggle('is-scrolled', shouldBeSolid);
  }

  if (header) {
    syncHeaderState();
    document.addEventListener('scroll', syncHeaderState, { passive: true });
  }

  // ---- Menu mobile ----
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(isOpen));
      syncHeaderState();
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        syncHeaderState();
      });
    });
  }

  // ---- FAQ accordion ----
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.faq-a').style.maxHeight = null;
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---- Reveal on scroll ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ---- Carrossel de imagens (ex: Sobre nós) ----
  document.querySelectorAll('.image-carousel').forEach(carousel => {
    const carouselTrack = carousel.querySelector('.carousel-track');
    const slides = [...carouselTrack.children];
    const dotsWrap = carousel.querySelector('.carousel-dots');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    let index = 0;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ir para foto ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('button');

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      carouselTrack.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, di) => dot.classList.toggle('active', di === index));
    }

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));
  });

  // ---- Carrossel de depoimentos ----
  const track = document.querySelector('.testimonials-track');
  const dotsWrap = document.getElementById('testimonialDots');

  if (track && dotsWrap) {
    const cards = track.querySelectorAll('.testimonial-card');
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Ir para depoimento ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('button');

    track.addEventListener('scroll', () => {
      let closestIndex = 0;
      let closestDistance = Infinity;
      cards.forEach((card, i) => {
        const distance = Math.abs(card.offsetLeft - track.scrollLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
      dots.forEach((dot, i) => dot.classList.toggle('active', i === closestIndex));
    }, { passive: true });
  }

});
