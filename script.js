// ==============================
// LYVIA — MAIN SCRIPT
// ==============================

// ===== DATA STORE =====
const DATA = {
  sobre: {
    title: "oi, eu sou a Lyvia.",
    content: `artista alternativa que vive entre ilustrações e palavras. minha arte nasce do caos emocional, da nostalgia y2k e de tudo que é intenso demais pra caber em palavras comuns.

crio porque preciso. porque a tela aguenta o que a cabeça não consegue segurar. porque cada traço é uma confissão e cada texto é uma ferida bonita.

bem vinda ao meu mundo.`,
    stats: { artes: 42, seguidores: 3800, anos: 4 }
  },
  ilustracoes: [
    { id: 1, title: "sangue de tinta", img: "", desc: "ilustração em aquarela digital, série caos emocional", date: "2025" },
    { id: 2, title: "garotinha de vidro", img: "", desc: "arte digital, técnica mista", date: "2025" },
    { id: 3, title: "estrelas mortas", img: "", desc: "ilustração conceitual, y2k vibes", date: "2024" },
    { id: 4, title: "nostalgia toxica", img: "", desc: "colagem digital", date: "2024" },
    { id: 5, title: "fragmentos", img: "", desc: "serie de ilustrações abstratas", date: "2024" },
    { id: 6, title: "menina-maré", img: "", desc: "ilustração poética", date: "2023" },
  ],
  textos: [
    {
      id: 1,
      title: "às 3 da manhã",
      excerpt: "escrevo pra mim mesma porque o silêncio pesa mais do que qualquer palavra que eu poderia dizer em voz alta...",
      content: `às 3 da manhã

escrevo pra mim mesma
porque o silêncio pesa
mais do que qualquer palavra
que eu poderia dizer em voz alta.

tem coisas que só existem
nessa hora estranha
onde o dia ainda não começou
e a noite já cansou.

me sento no chão frio
e deixo a caneta sangrar.
esse é o único jeito que eu sei
de continuar.`,
      date: "2025"
    },
    {
      id: 2,
      title: "eu e o caos",
      excerpt: "o caos não me assusta. o caos é o único lugar onde eu me sinto em casa...",
      content: `eu e o caos

o caos não me assusta.
o caos é o único lugar
onde eu me sinto em casa.

gente arrumada me sufoca —
suas prateleiras perfeitas,
suas palavras medidas,
seus sorrisos calculados.

me dê o desorganizado.
me dê o que transborda.
me dê a arte que sangra.

porque eu também sou assim:
intensa, irregular, viva.`,
      date: "2025"
    },
    {
      id: 3,
      title: "glitch",
      excerpt: "sou o erro no sistema. o pixel fora do lugar. a cor que não deveria estar ali...",
      content: `glitch

sou o erro no sistema.
o pixel fora do lugar.
a cor que não deveria estar ali
mas está, teimosa, brilhante.

me chamam de bug
mas prefiro glitch —
aquela falha bonita
que faz todo mundo parar.

✦`,
      date: "2024"
    },
  ]
};

// Load from localStorage if exists
function loadData() {
  try {
    const saved = localStorage.getItem('lyviaData');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(DATA, parsed);
    }
  } catch(e) {}
}

function saveData() {
  localStorage.setItem('lyviaData', JSON.stringify(DATA));
}

// ===== LOADER =====
window.addEventListener('load', () => {
  loadData();
  const fill = document.getElementById('loaderFill');
  const loader = document.getElementById('loader');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        initAnimations();
      }, 400);
    }
    fill.style.width = progress + '%';
  }, 80);
});

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    cursorTrail.style.left = e.clientX + 'px';
    cursorTrail.style.top = e.clientY + 'px';
  }, 80);
});

document.addEventListener('click', (e) => {
  cursor.style.transform = 'translate(-50%, -50%) scale(2)';
  setTimeout(() => cursor.style.transform = 'translate(-50%, -50%) scale(1)', 200);
});

// ===== NAV =====
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== CANVAS BG =====
function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.5 + 0.1
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 45, 120, ${p.opacity})`;
      ctx.fill();
    });
    // Draw connections
    particles.forEach((p, i) => {
      particles.slice(i + 1).forEach(q => {
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(255, 45, 120, ${0.05 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const step = target / 60;
  const interval = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(interval); }
    el.textContent = Math.floor(current) + suffix;
  }, 25);
}

// ===== INTERSECTION OBSERVER =====
function initObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Animate stats when sobre is visible
        if (entry.target.id === 'sobre') {
          setTimeout(() => {
            animateCounter(document.getElementById('statArtes'), DATA.sobre.stats.artes);
            const seg = DATA.sobre.stats.seguidores;
            animateCounter(document.getElementById('statSeguidores'), seg > 999 ? Math.floor(seg/1000) : seg, seg > 999 ? 'k' : '');
            animateCounter(document.getElementById('statAnos'), DATA.sobre.stats.anos);
          }, 300);
        }
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.section').forEach(s => observer.observe(s));
}

// ===== CAT INTERACTION =====
const catWrapper = document.getElementById('catWrapper');
const catOptions = document.getElementById('catOptions');
const catSpeech = document.getElementById('catSpeech');
const catParticles = document.getElementById('catParticles');
let catClicked = false;

const speeches = [
  'clique em mim!',
  'meow? 🐾',
  'oi oi!',
  'me clica!',
  '★ arte ★'
];
let speechIdx = 0;

catWrapper.addEventListener('click', () => {
  if (!catClicked) {
    catClicked = true;
    spawnParticles();
    catSpeech.querySelector('span').textContent = 'o que quer ver?';
    catOptions.classList.add('visible');
    catOptions.style.display = 'flex';
  }
});

// Speech bubble cycle on hover
catWrapper.addEventListener('mouseenter', () => {
  speechIdx = (speechIdx + 1) % speeches.length;
  if (!catClicked) catSpeech.querySelector('span').textContent = speeches[speechIdx];
});

function spawnParticles() {
  const emojis = ['★', '✦', '♡', '✧', '⭐', '💫', '🌸', '✨'];
  const rect = catWrapper.getBoundingClientRect();
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'cat-particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const tx = (Math.random() - 0.5) * 200;
      const ty = -(Math.random() * 150 + 50);
      p.style.setProperty('--tx', tx + 'px');
      p.style.setProperty('--ty', ty + 'px');
      p.style.left = (Math.random() * 160 + 30) + 'px';
      p.style.top = (Math.random() * 100 + 60) + 'px';
      catParticles.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }, i * 60);
  }
}

// ===== GALLERY =====
let currentGalleryType = 'ilustracoes';

window.showGallery = function(type) {
  currentGalleryType = type;
  const gate = document.getElementById('catGate');
  const gallery = document.getElementById('galleryView');
  const title = document.getElementById('galleryTitle');

  gate.style.opacity = '0';
  gate.style.transition = 'opacity 0.4s';
  setTimeout(() => {
    gate.style.display = 'none';
    gallery.style.display = 'block';
    gallery.style.opacity = '0';
    gallery.style.transition = 'opacity 0.4s';
    title.textContent = type === 'ilustracoes' ? 'ILUSTRAÇÕES' : 'TEXTOS';
    renderGallery(type, 'all');
    setTimeout(() => gallery.style.opacity = '1', 50);
  }, 400);
};

window.hideFallery = function() {
  const gate = document.getElementById('catGate');
  const gallery = document.getElementById('galleryView');

  gallery.style.opacity = '0';
  setTimeout(() => {
    gallery.style.display = 'none';
    gate.style.display = 'flex';
    gate.style.opacity = '0';
    setTimeout(() => gate.style.opacity = '1', 50);
    catClicked = false;
    catOptions.style.display = 'none';
    catOptions.classList.remove('visible');
    catSpeech.querySelector('span').textContent = 'clique em mim!';
  }, 400);
};

window.filterGallery = function(filter, btn) {
  document.querySelectorAll('.gf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGallery(currentGalleryType, filter);
};

function renderGallery(type, filter) {
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = '';

  if (type === 'ilustracoes') {
    let items = DATA.ilustracoes;
    if (filter === 'recente') items = items.filter(i => i.date === '2025');

    items.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'gallery-item';
      el.style.animationDelay = (idx * 0.08) + 's';
      el.innerHTML = `
        ${item.img
          ? `<img class="gi-img" src="${item.img}" alt="${item.title}" />`
          : `<div class="gi-placeholder">
              <div class="gi-placeholder-icon">✦</div>
              <div class="gi-placeholder-title">${item.title}</div>
            </div>`
        }
        <div class="gi-overlay">
          <div class="gi-title">${item.title}</div>
          <div class="gi-type">ilustração · ${item.date}</div>
        </div>
      `;
      el.addEventListener('click', () => openLightbox(item));
      grid.appendChild(el);
    });
  } else {
    let items = DATA.textos;
    if (filter === 'recente') items = items.filter(i => i.date === '2025');
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';

    items.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'gallery-item text-item';
      el.style.animationDelay = (idx * 0.1) + 's';
      el.style.aspectRatio = 'auto';
      el.style.minHeight = '220px';
      el.innerHTML = `
        <div class="ti-body">
          <span class="ti-tag">✦ TEXTO · ${item.date}</span>
          <div class="ti-title">${item.title}</div>
          <div class="ti-excerpt">${item.excerpt}</div>
          <span class="ti-read">ler completo →</span>
        </div>
      `;
      el.addEventListener('click', () => openTextModal(item));
      grid.appendChild(el);
    });
  }
}

// ===== LIGHTBOX =====
function openLightbox(item) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  const placeholder = document.getElementById('lbPlaceholder');
  document.getElementById('lbTitle').textContent = item.title;
  document.getElementById('lbDesc').textContent = item.desc;

  if (item.img) {
    img.src = item.img;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    img.src = '';
    img.style.display = 'none';
    placeholder.style.display = 'flex';
  }
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}

window.closeLightbox = function() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
};

// ===== TEXT MODAL =====
function openTextModal(item) {
  document.getElementById('tmTitle').textContent = item.title;
  document.getElementById('tmBody').textContent = item.content;
  document.getElementById('textModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

window.closeTextModal = function() {
  document.getElementById('textModal').classList.remove('active');
  document.body.style.overflow = '';
};

// ===== SOBRE CONTENT =====
function loadSobreContent() {
  const titleEl = document.getElementById('sobreTitle');
  const contentEl = document.getElementById('sobreContent');
  if (titleEl) titleEl.textContent = DATA.sobre.title;
  if (contentEl) {
    contentEl.innerHTML = DATA.sobre.content.split('\n\n')
      .map(p => `<p>${p}</p>`).join('');
  }
}

// ===== 3D TILT EFFECT =====
function init3DTilt() {
  const tiltEls = document.querySelectorAll('.rede-card, .cat-3d');
  tiltEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * 15}deg) rotateX(${-y * 15}deg) translateY(-4px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// ===== INIT =====
function initAnimations() {
  initCanvas();
  initObserver();
  init3DTilt();
  loadSobreContent();
}

// Keyboard close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
    closeTextModal();
  }
});
