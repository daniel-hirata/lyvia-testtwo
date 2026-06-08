// ==============================
// LYVIA — ADMIN SCRIPT
// ==============================

const ADMIN_PASSWORD = '3906483845';
let isAuthenticated = false;
let deleteTarget = null;

// ===== CURSOR =====
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

// ===== DATA =====
const DEFAULT_DATA = {
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
  ],
  textos: [
    { id: 1, title: "às 3 da manhã", excerpt: "escrevo pra mim mesma porque o silêncio pesa mais do que qualquer palavra...", content: `às 3 da manhã\n\nescrevo pra mim mesma\nporque o silêncio pesa\nmais do que qualquer palavra\nque eu poderia dizer em voz alta.`, date: "2025" },
    { id: 2, title: "eu e o caos", excerpt: "o caos não me assusta. o caos é o único lugar onde eu me sinto em casa...", content: `eu e o caos\n\no caos não me assusta.\no caos é o único lugar\nonde eu me sinto em casa.`, date: "2025" },
  ],
  config: { tiktok: "@thxyx.lyy", instagram: "@thxyx.lyy" }
};

let DATA = JSON.parse(JSON.stringify(DEFAULT_DATA));

function loadData() {
  const saved = localStorage.getItem('lyviaData');
  if (saved) {
    try { DATA = { ...DEFAULT_DATA, ...JSON.parse(saved) }; }
    catch(e) {}
  }
}

function saveData() {
  localStorage.setItem('lyviaData', JSON.stringify(DATA));
}

// ===== AUTH =====
window.checkPassword = function() {
  const input = document.getElementById('passwordInput');
  const error = document.getElementById('loginError');
  const val = input.value.trim();

  if (val === ADMIN_PASSWORD) {
    error.textContent = '';
    const screen = document.getElementById('loginScreen');
    const panel = document.getElementById('adminPanel');

    screen.classList.add('hidden');
    setTimeout(() => {
      screen.style.display = 'none';
      panel.style.display = 'flex';
      isAuthenticated = true;
      initAdmin();
    }, 500);
  } else {
    error.textContent = '✕ senha incorreta';
    error.style.animation = 'none';
    void error.offsetWidth;
    error.style.animation = 'shake 0.3s ease';
    input.value = '';
    input.focus();

    // Shake effect
    const box = document.querySelector('.login-box');
    box.style.animation = 'none';
    void box.offsetWidth;
    box.style.animation = 'shake 0.3s ease';
  }
};

window.togglePassword = function() {
  const input = document.getElementById('passwordInput');
  const btn = document.getElementById('toggleBtn');
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
};

window.logout = function() {
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('passwordInput').value = '';
  isAuthenticated = false;
};

// ===== TABS =====
window.showTab = function(tabName, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.sb-item').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tabName).style.display = 'block';
  btn.classList.add('active');

  if (tabName === 'ilustracoes') renderIlustracoes();
  if (tabName === 'textos') renderTextos();
  if (tabName === 'sobre') loadSobreForm();
  if (tabName === 'config') loadConfigForm();
};

// ===== SOBRE =====
function loadSobreForm() {
  document.getElementById('sobreTitleInput').value = DATA.sobre.title;
  document.getElementById('sobreContentInput').value = DATA.sobre.content;
  document.getElementById('statArtesInput').value = DATA.sobre.stats.artes;
  document.getElementById('statSegInput').value = DATA.sobre.stats.seguidores;
  document.getElementById('statAnosInput').value = DATA.sobre.stats.anos;
}

window.saveSobre = function() {
  DATA.sobre.title = document.getElementById('sobreTitleInput').value;
  DATA.sobre.content = document.getElementById('sobreContentInput').value;
  DATA.sobre.stats.artes = parseInt(document.getElementById('statArtesInput').value) || 0;
  DATA.sobre.stats.seguidores = parseInt(document.getElementById('statSegInput').value) || 0;
  DATA.sobre.stats.anos = parseInt(document.getElementById('statAnosInput').value) || 0;
  saveData();
  showFeedback('sobreFeedback', '✦ alterações salvas com sucesso!', 'success');
};

// ===== ILUSTRAÇÕES =====
function renderIlustracoes() {
  const grid = document.getElementById('ilustracoesGrid');
  grid.innerHTML = '';
  if (DATA.ilustracoes.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-dim);font-size:12px;letter-spacing:2px;">nenhuma ilustração ainda. adicione a primeira!</p>';
    return;
  }
  DATA.ilustracoes.forEach(item => {
    const el = document.createElement('div');
    el.className = 'admin-item';
    el.innerHTML = `
      ${item.img
        ? `<img class="ai-img-preview" src="${item.img}" alt="${item.title}" onerror="this.style.display='none'" />`
        : `<div class="ai-no-img">✦</div>`
      }
      <div class="ai-title">${item.title}</div>
      <div class="ai-meta">${item.desc} · ${item.date}</div>
      <div class="ai-actions">
        <button class="ai-del" onclick="confirmDelete('ilustracoes', ${item.id})">✕</button>
      </div>
    `;
    grid.appendChild(el);
  });
}

// ===== TEXTOS =====
function renderTextos() {
  const grid = document.getElementById('textosGrid');
  grid.innerHTML = '';
  if (DATA.textos.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-dim);font-size:12px;letter-spacing:2px;">nenhum texto ainda. adicione o primeiro!</p>';
    return;
  }
  DATA.textos.forEach(item => {
    const el = document.createElement('div');
    el.className = 'admin-item';
    el.innerHTML = `
      <div class="ai-title">${item.title}</div>
      <div class="ai-meta">texto · ${item.date}</div>
      <div class="ai-excerpt">${item.excerpt}</div>
      <div class="ai-actions">
        <button class="ai-del" onclick="confirmDelete('textos', ${item.id})">✕</button>
      </div>
    `;
    grid.appendChild(el);
  });
}

// ===== ADD MODAL =====
let currentModalType = '';

window.openAddModal = function(type) {
  currentModalType = type;
  const overlay = document.getElementById('modalOverlay');
  const ilustForm = document.getElementById('modalIlustForm');
  const textForm = document.getElementById('modalTextForm');
  const title = document.getElementById('modalTitle');

  ilustForm.style.display = 'none';
  textForm.style.display = 'none';

  if (type === 'ilustracoes') {
    title.textContent = 'NOVA ILUSTRAÇÃO';
    ilustForm.style.display = 'block';
    clearForm(['ilustTitleInput', 'ilustImgInput', 'ilustDescInput']);
    document.getElementById('ilustDateInput').value = '2025';
  } else {
    title.textContent = 'NOVO TEXTO';
    textForm.style.display = 'block';
    clearForm(['textTitleInput', 'textExcerptInput', 'textContentInput']);
    document.getElementById('textDateInput').value = '2025';
  }

  overlay.style.display = 'flex';
  document.getElementById('modalFeedback').textContent = '';
};

window.closeModal = function() {
  document.getElementById('modalOverlay').style.display = 'none';
};

window.saveIlust = function() {
  const title = document.getElementById('ilustTitleInput').value.trim();
  if (!title) {
    showFeedback('modalFeedback', '✕ título obrigatório', 'error');
    return;
  }
  const newId = Date.now();
  DATA.ilustracoes.push({
    id: newId,
    title,
    img: document.getElementById('ilustImgInput').value.trim(),
    desc: document.getElementById('ilustDescInput').value.trim() || 'ilustração',
    date: document.getElementById('ilustDateInput').value.trim() || '2025'
  });
  saveData();
  closeModal();
  renderIlustracoes();
};

window.saveText = function() {
  const title = document.getElementById('textTitleInput').value.trim();
  const content = document.getElementById('textContentInput').value.trim();
  if (!title || !content) {
    showFeedback('modalFeedback', '✕ título e texto obrigatórios', 'error');
    return;
  }
  const excerpt = document.getElementById('textExcerptInput').value.trim()
    || content.substring(0, 80) + '...';
  const newId = Date.now();
  DATA.textos.push({
    id: newId, title, excerpt, content,
    date: document.getElementById('textDateInput').value.trim() || '2025'
  });
  saveData();
  closeModal();
  renderTextos();
};

// ===== DELETE =====
window.confirmDelete = function(type, id) {
  deleteTarget = { type, id };
  document.getElementById('deleteOverlay').style.display = 'flex';
  document.getElementById('confirmDeleteBtn').onclick = executeDelete;
};

window.cancelDelete = function() {
  document.getElementById('deleteOverlay').style.display = 'none';
  deleteTarget = null;
};

function executeDelete() {
  if (!deleteTarget) return;
  const { type, id } = deleteTarget;
  DATA[type] = DATA[type].filter(item => item.id !== id);
  saveData();
  cancelDelete();
  if (type === 'ilustracoes') renderIlustracoes();
  if (type === 'textos') renderTextos();
}

// ===== CONFIG =====
function loadConfigForm() {
  if (DATA.config) {
    document.getElementById('tiktokInput').value = DATA.config.tiktok || '@thxyx.lyy';
    document.getElementById('instagramInput').value = DATA.config.instagram || '@thxyx.lyy';
  }
}

window.saveConfig = function() {
  if (!DATA.config) DATA.config = {};
  DATA.config.tiktok = document.getElementById('tiktokInput').value;
  DATA.config.instagram = document.getElementById('instagramInput').value;
  saveData();
  showFeedback('configFeedback', '✦ configurações salvas!', 'success');
};

window.resetData = function() {
  if (confirm('Tem certeza? Isso vai apagar TODOS os dados personalizados.')) {
    localStorage.removeItem('lyviaData');
    DATA = JSON.parse(JSON.stringify(DEFAULT_DATA));
    loadSobreForm();
    showFeedback('configFeedback', '✦ dados resetados.', 'success');
  }
};

// ===== UTILS =====
function clearForm(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function showFeedback(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = 'save-feedback ' + type;
  setTimeout(() => { el.textContent = ''; el.className = 'save-feedback'; }, 3000);
}

// ===== INIT =====
function initAdmin() {
  loadSobreForm();
}

loadData();
