function smoothScroll(e, id) {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

// Animated counter
document.querySelectorAll('.stat-n[data-target]').forEach(el => {
  const target = parseInt(el.dataset.target);
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString('en-IN') + '+';
    if (current >= target) clearInterval(timer);
  }, 20);
});

// Close quiz on overlay click
document.getElementById('quiz-overlay')?.addEventListener('click', function(e) {
  if (e.target === this) closeQuiz();
});

// Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeQuiz();
});
