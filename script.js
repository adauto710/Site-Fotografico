// ===== CONFIGURAÇÃO DAS CATEGORIAS =====
const categories = [
  "Casal",
  "Natureza",
  "Avatar",
  "Viagem",
  "Saúde",
  "Educação",
  "Moda",
  "Esporte",
  "Comida",
  "Outros"
];

const PHOTOS_PER_CATEGORY = 30;

const galleryEl = document.getElementById("gallery");
const filtersEl = document.getElementById("filters");

let allPhotos = [];

// ===== GERAR DADOS DAS FOTOS =====
function generatePhotos() {
  let id = 1;
  categories.forEach(category => {
    for (let i = 1; i <= PHOTOS_PER_CATEGORY; i++) {
      allPhotos.push({
        id,
        category,
        title: `${category} ${i}`,
        // Caminho padrão das imagens (você pode trocar depois)
        src: `${category.toLowerCase()}/${i}.jpg`
      });
      id++;
    }
  });
}

// ===== RENDER BOTÕES =====
function renderFilters() {
  const allBtn = document.createElement("button");
  allBtn.textContent = "Todas";
  allBtn.classList.add("active");
  allBtn.onclick = () => setFilter("all", allBtn);
  filtersEl.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => setFilter(cat, btn);
    filtersEl.appendChild(btn);
  });
}

function setFilter(category, btn) {
  document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  if (category === "all") renderGallery(allPhotos);
  else renderGallery(allPhotos.filter(p => p.category === category));
}

// ===== RENDER GALERIA =====
function renderGallery(photos) {
  galleryEl.innerHTML = "";

  photos.forEach(photo => {
    const card = document.createElement("div");
    card.className = "photo-card";

    card.innerHTML = `
      <img src="${photo.src}" alt="${photo.title}" onerror="this.src='https://via.placeholder.com/400x300?text=Foto+${photo.id}'" />
      <div class="info">${photo.title} – ${photo.category}</div>
    `;

    // Adicionar event listener para abrir modal
    const img = card.querySelector("img");
    img.addEventListener("click", () => openModal(photo));

    galleryEl.appendChild(card);
  });
}

// ===== MODAL FUNCTIONS =====
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalInfo = document.getElementById("modalInfo");
const modalClose = document.querySelector(".modal-close");
const zoomInBtn = document.getElementById("zoomIn");
const zoomOutBtn = document.getElementById("zoomOut");
const zoomResetBtn = document.getElementById("zoomReset");
const zoomLevel = document.getElementById("zoomLevel");

let currentZoom = 100;
const zoomStep = 20;
const maxZoom = 300;
const minZoom = 100;
let offsetX = 0;
let offsetY = 0;

function openModal(photo) {
  modalImage.src = photo.src;
  modalImage.onerror = () => { modalImage.src = `https://via.placeholder.com/400x300?text=Foto+${photo.id}`; };
  modalInfo.textContent = `${photo.title} – ${photo.category}`;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  currentZoom = 100;
  offsetX = 0;
  offsetY = 0;
  updateZoom();
}

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
  currentZoom = 100;
}

function updateZoom() {
  modalImage.style.transform = `scale(${currentZoom / 100}) translate(${offsetX}px, ${offsetY}px)`;
  zoomLevel.textContent = `${currentZoom}%`;
}

function zoom(direction) {
  if (direction === "in" && currentZoom < maxZoom) {
    currentZoom = Math.min(currentZoom + zoomStep, maxZoom);
  } else if (direction === "out" && currentZoom > minZoom) {
    currentZoom = Math.max(currentZoom - zoomStep, minZoom);
    // Resetar posição ao diminuir zoom
    if (currentZoom === minZoom) {
      offsetX = 0;
      offsetY = 0;
    }
  }
  updateZoom();
}

// Controles de zoom
zoomInBtn.addEventListener("click", () => zoom("in"));
zoomOutBtn.addEventListener("click", () => zoom("out"));
zoomResetBtn.addEventListener("click", () => {
  currentZoom = 100;
  offsetX = 0;
  offsetY = 0;
  updateZoom();
});

// ===== DRAG/ARRASTE DA IMAGEM =====
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragOffsetX = 0;
let dragOffsetY = 0;

modalImage.addEventListener("mousedown", (e) => {
  if (currentZoom > minZoom) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragOffsetX = offsetX;
    dragOffsetY = offsetY;
    modalImage.classList.add("dragging");
  }
});

document.addEventListener("mousemove", (e) => {
  if (isDragging && modal.classList.contains("active")) {
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;

    const maxOffset = (currentZoom - minZoom) * 2;
    offsetX = Math.max(-maxOffset, Math.min(maxOffset, dragOffsetX + deltaX / (currentZoom / 100)));
    offsetY = Math.max(-maxOffset, Math.min(maxOffset, dragOffsetY + deltaY / (currentZoom / 100)));

    updateZoom();
  }
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    modalImage.classList.remove("dragging");
  }
});

// Zoom com scroll do mouse no modal
modal.addEventListener("wheel", (e) => {
  if (modal.classList.contains("active")) {
    e.preventDefault();
    if (e.deltaY < 0) zoom("in");
    else zoom("out");
  }
}, { passive: false });

// Fechar ao clicar no X
modalClose.addEventListener("click", closeModal);

// Fechar ao clicar fora da imagem
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// Fechar ao pressionar ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ===== INICIALIZAÇÃO =====
generatePhotos();
renderFilters();

// Verificar se há parâmetro de categoria na URL
const urlParams = new URLSearchParams(window.location.search);
const selectedCategory = urlParams.get('categoria');

if (selectedCategory) {
  // Encontrar e clicar no botão da categoria
  const buttons = document.querySelectorAll('.filters button');
  buttons.forEach(btn => {
    if (btn.textContent === selectedCategory) {
      btn.click();
    }
  });
} else {
  // Caso contrário, mostrar todas as fotos
  renderGallery(allPhotos);
}

