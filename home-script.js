// Fazer os cards de categoria clicáveis
document.querySelectorAll('.category-card').forEach((card, index) => {
  const categoryNames = [
    'Casal' ,
   
    'Natureza',
    'Avatar',
    'Viagem',
    'Saúde',
    'Educação',
    'Moda',
    'Esporte',
    'Comida',
    'Outros'
  ];

  card.style.cursor = 'pointer';
  
  card.addEventListener('click', () => {
    const category = categoryNames[index];
    // Redireciona para a galeria com a categoria como parâmetro
    window.location.href = `index.html?categoria=${encodeURIComponent(category)}`;
  });

  // Efeito visual ao passar o mouse
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-8px)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
  });
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});



