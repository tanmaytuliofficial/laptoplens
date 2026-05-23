// ============================================================
// LAPTOPLENS — Main App Controller
// Handles: quiz flow, results rendering, theme toggle, search
// ============================================================

// ─────────────────────────────────────────────
// APP STATE
// Think of this as the "memory" of the app.
// ─────────────────────────────────────────────
const AppState = {
  currentQuestion: 0,       // which question we're on (0-indexed)
  answers: {},              // { budget: 80000, use_case: "coding", ... }
  laptops: [],              // all laptops fetched from Firestore
  results: [],              // ranked laptops with match scores
  theme: localStorage.getItem("ll_theme") || "dark",
  activeFilters: [],        // current brand/category filters
};

// ─────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────

// Show a toast notification
function showToast(message, type = "success") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  setTimeout(() => toast.classList.remove("show"), 3500);
}

// Format price in Indian Rupees
function formatPrice(price) {
  if (!price) return "Price N/A";
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)}L`;
  return `₹${(price / 1000).toFixed(0)}K`;
}

// Debounce — for search input
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Get budget range tag
function getBudgetTag(budget) {
  if (budget <= 40000)  return "budget";
  if (budget <= 70000)  return "midrange";
  if (budget <= 120000) return "uppermid";
  if (budget <= 200000) return "premium";
  return "flagship";
}

// ─────────────────────────────────────────────
// THEME TOGGLE
// ─────────────────────────────────────────────
function initTheme() {
  document.documentElement.setAttribute("data-theme", AppState.theme);
  updateThemeIcon();
}

function toggleTheme() {
  AppState.theme = AppState.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", AppState.theme);
  localStorage.setItem("ll_theme", AppState.theme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  toggle.innerHTML = AppState.theme === "dark"
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
}

// ─────────────────────────────────────────────
// PAGE ROUTER
// The app is a single page — we show/hide sections.
// ─────────────────────────────────────────────
const PAGES = ["page-landing", "page-quiz", "page-analyzing", "page-results"];

function showPage(pageId) {
  PAGES.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// ─────────────────────────────────────────────
// QUIZ RENDERING
// ─────────────────────────────────────────────
function startQuiz() {
  AppState.currentQuestion = 0;
  AppState.answers = {};
  showPage("page-quiz");
  renderQuestion(0);
}

function renderQuestion(index) {
  const q = QUIZ_QUESTIONS[index];
  const container = document.getElementById("quizContent");
  if (!container || !q) return;

  // Update progress bar
  const progress = ((index) / QUIZ_QUESTIONS.length) * 100;
  document.getElementById("progressFill").style.width = `${progress}%`;
  document.getElementById("stepLabel").textContent = `Question ${index + 1} of ${QUIZ_QUESTIONS.length}`;
  document.querySelector(".quiz-step-count").textContent =
    `${QUIZ_QUESTIONS.length - index - 1} more to go`;

  // Build the inner HTML based on question type
  let optionsHTML = "";

  if (q.type === "slider") {
    const val = AppState.answers[q.id] || q.default;
    optionsHTML = `
      <div class="budget-slider-wrap">
        <div class="budget-display" id="budgetDisplay">${q.unit}${val.toLocaleString("en-IN")}</div>
        <input
          type="range"
          class="range-slider"
          id="sliderInput"
          min="${q.min}" max="${q.max}" step="${q.step}"
          value="${val}"
          oninput="handleSlider(this.value)"
        />
        <div class="range-labels">
          <span>${q.unit}${(q.min/1000).toFixed(0)}K</span>
          <span>${q.unit}${(q.max/1000).toFixed(0)}K</span>
        </div>
      </div>`;
  } else {
    const selectedVal = AppState.answers[q.id];
    const optionItems = q.options.map(opt => `
      <button
        class="option-btn ${selectedVal === opt.value ? "selected" : ""}"
        onclick="selectOption('${q.id}', '${opt.value}', this)"
      >
        <span class="option-icon">${opt.icon}</span>
        <span class="option-text-wrap">
          <span class="option-label">${opt.label}</span>
          ${opt.sub ? `<span class="option-sub">${opt.sub}</span>` : ""}
        </span>
      </button>
    `).join("");
    optionsHTML = `<div class="options-grid ${q.layout}">${optionItems}</div>`;
  }

  // Animate out, swap, animate in
  container.classList.add("slide-out");
  setTimeout(() => {
    container.innerHTML = `
      <span class="question-icon">${q.icon}</span>
      <div class="question-text">${q.text}</div>
      <p class="question-hint">${q.hint}</p>
      ${optionsHTML}
    `;
    container.classList.remove("slide-out");
    container.classList.add("slide-in");
    setTimeout(() => container.classList.remove("slide-in"), 400);
  }, 250);

  // Back button visibility
  const backBtn = document.getElementById("quizBack");
  if (backBtn) backBtn.style.visibility = index === 0 ? "hidden" : "visible";

  // Next button state
  updateNextBtn();
}

// Handle slider change
function handleSlider(value) {
  const q = QUIZ_QUESTIONS[AppState.currentQuestion];
  const display = document.getElementById("budgetDisplay");
  if (display) display.textContent = `${q.unit}${parseInt(value).toLocaleString("en-IN")}`;
  AppState.answers[q.id] = parseInt(value);
  updateNextBtn();
}

// Handle option click
function selectOption(questionId, value, btn) {
  // Deselect all
  document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
  btn.classList.add("selected");
  AppState.answers[questionId] = value;
  updateNextBtn();

  // Auto-advance after short delay for single-select
  setTimeout(() => nextQuestion(), 300);
}

function updateNextBtn() {
  const nextBtn = document.getElementById("quizNext");
  if (!nextBtn) return;
  const q = QUIZ_QUESTIONS[AppState.currentQuestion];
  const hasAnswer = q.type === "slider"
    ? true  // slider always has a value
    : AppState.answers[q.id] !== undefined;
  nextBtn.disabled = !hasAnswer;
  nextBtn.textContent = AppState.currentQuestion === QUIZ_QUESTIONS.length - 1 ? "See Results →" : "Next →";
}

function nextQuestion() {
  const q = QUIZ_QUESTIONS[AppState.currentQuestion];
  // Capture slider value on advance
  if (q.type === "slider") {
    const slider = document.getElementById("sliderInput");
    if (slider) AppState.answers[q.id] = parseInt(slider.value);
  }

  if (AppState.currentQuestion < QUIZ_QUESTIONS.length - 1) {
    AppState.currentQuestion++;
    renderQuestion(AppState.currentQuestion);
  } else {
    startAnalysis();
  }
}

function prevQuestion() {
  if (AppState.currentQuestion > 0) {
    AppState.currentQuestion--;
    renderQuestion(AppState.currentQuestion);
  }
}

// ─────────────────────────────────────────────
// ANALYSIS / LOADING SCREEN
// Fake the AI "thinking" feel with timed steps
// ─────────────────────────────────────────────
function startAnalysis() {
  showPage("page-analyzing");

  const steps = [
    "Loading laptop database...",
    "Analyzing your requirements...",
    "Running compatibility scoring...",
    "Ranking matches...",
    "Generating personalized reasons...",
  ];

  const stepEls = document.querySelectorAll(".analyzing-step");
  let i = 0;
  const interval = setInterval(() => {
    if (stepEls[i]) stepEls[i].classList.add("active");
    i++;
    if (i >= steps.length) {
      clearInterval(interval);
      setTimeout(() => fetchAndMatchLaptops(), 600);
    }
  }, 600);
}

// ─────────────────────────────────────────────
// FIRESTORE FETCH + MATCHING
// ─────────────────────────────────────────────
async function fetchAndMatchLaptops() {
  try {
    const snapshot = await db.collection("laptops").get();
    AppState.laptops = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (AppState.laptops.length === 0) {
      // Fallback: use demo data if DB is empty
      AppState.laptops = DEMO_LAPTOPS;
    }

    AppState.results = rankLaptops(AppState.answers, AppState.laptops, 6);
    renderResults();
    showPage("page-results");
  } catch (err) {
    console.error("Firestore error:", err);
    // Use demo data if Firebase not configured
    AppState.laptops = DEMO_LAPTOPS;
    AppState.results = rankLaptops(AppState.answers, AppState.laptops, 6);
    renderResults();
    showPage("page-results");
  }
}

// ─────────────────────────────────────────────
// RESULTS RENDERING
// ─────────────────────────────────────────────
function renderResults() {
  const container = document.getElementById("laptopsGrid");
  if (!container) return;

  if (AppState.results.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px;">
        <div style="font-size:3rem;margin-bottom:16px">😕</div>
        <div class="section-title">No laptops found</div>
        <p class="text-secondary" style="margin-top:8px">Try adjusting your budget or requirements</p>
        <button class="btn-secondary" style="margin-top:24px" onclick="startQuiz()">Retake Quiz</button>
      </div>`;
    return;
  }

  container.innerHTML = AppState.results.map((laptop, idx) => buildLaptopCard(laptop, idx)).join("");

  // Stagger animations
  document.querySelectorAll(".laptop-card").forEach((card, i) => {
    card.style.animationDelay = `${i * 0.1}s`;
  });
}

function buildLaptopCard(laptop, index) {
  const isTopPick = index === 0;
  const scoreDeg = Math.round((laptop.matchScore / 100) * 360);
  const pros = (laptop.pros || []).slice(0, 3);
  const cons = (laptop.cons || []).slice(0, 2);
  const specs = [];
  if (laptop.cpu)     specs.push(laptop.cpu);
  if (laptop.ram)     specs.push(laptop.ram + " RAM");
  if (laptop.storage) specs.push(laptop.storage + " SSD");
  if (laptop.gpu)     specs.push(laptop.gpu);

  const matchColor = laptop.matchScore >= 85 ? "#c8f060"
                   : laptop.matchScore >= 70 ? "#f0d060"
                   : "#f06060";

  const reasonsHTML = laptop.matchReasons?.length
    ? `<div class="why-match">
        <strong>Why it matches you:</strong> ${laptop.matchReasons.join(" · ")}
      </div>` : "";

  const prosHTML = pros.length ? `
    <div class="pros">
      <div class="pros-title">✓ Pros</div>
      ${pros.map(p => `<div class="pro-item">${p}</div>`).join("")}
    </div>` : "";

  const consHTML = cons.length ? `
    <div class="cons">
      <div class="cons-title">✗ Cons</div>
      ${cons.map(c => `<div class="con-item">${c}</div>`).join("")}
    </div>` : "";

  const imgHTML = laptop.image
    ? `<img src="${laptop.image}" alt="${laptop.name}" loading="lazy"/>`
    : `<div class="laptop-img-placeholder">💻</div>`;

  return `
    <div class="laptop-card ${isTopPick ? "top-pick" : ""}" data-id="${laptop.id}" style="animation-delay:${index*0.1}s">
      ${isTopPick ? `<div class="top-pick-badge">⭐ Best Match</div>` : ""}
      
      <div class="laptop-img-wrap">
        ${imgHTML}
        <div class="match-score-wrap">
          <div class="match-ring" style="--score-deg:${scoreDeg}deg; background: conic-gradient(${matchColor} ${scoreDeg}deg, var(--bg-secondary) 0deg);">
            <span class="match-ring-text">${laptop.matchScore}%</span>
          </div>
        </div>
      </div>

      <div class="laptop-body">
        <div class="laptop-brand">${laptop.brand || "Unknown"}</div>
        <div class="laptop-name">${laptop.name}</div>
        <div class="laptop-price">${formatPrice(laptop.price)}</div>

        <div class="spec-chips">
          ${specs.map(s => `<span class="spec-chip">${s}</span>`).join("")}
        </div>

        ${reasonsHTML}

        <div class="pros-cons">
          <div class="pros-cons-row">
            ${prosHTML}
            ${consHTML}
          </div>
        </div>

        <a href="${laptop.affiliateLink || "#"}" target="_blank" rel="noopener" class="btn-buy" onclick="trackClick('${laptop.id}', '${laptop.name}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Buy on Amazon
        </a>
      </div>
    </div>`;
}

// Track affiliate clicks (logs to Firestore for admin analytics)
async function trackClick(laptopId, laptopName) {
  try {
    await db.collection("clicks").add({
      laptopId,
      laptopName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (e) {
    // Silently fail — don't break UX
  }
}

// ─────────────────────────────────────────────
// SEARCH & FILTER on results page
// ─────────────────────────────────────────────
function initSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;
  input.addEventListener("input", debounce(handleSearch, 250));
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  const cards = document.querySelectorAll(".laptop-card");
  cards.forEach(card => {
    const name = card.querySelector(".laptop-name")?.textContent.toLowerCase() || "";
    const brand = card.querySelector(".laptop-brand")?.textContent.toLowerCase() || "";
    card.style.display = (name.includes(query) || brand.includes(query)) ? "" : "none";
  });
}

function filterByCategory(cat) {
  // Toggle filter
  if (AppState.activeFilters.includes(cat)) {
    AppState.activeFilters = AppState.activeFilters.filter(f => f !== cat);
  } else {
    AppState.activeFilters.push(cat);
  }

  // Update button styles
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", AppState.activeFilters.includes(btn.dataset.filter));
  });

  // Filter cards
  const cards = document.querySelectorAll(".laptop-card");
  if (AppState.activeFilters.length === 0) {
    cards.forEach(c => c.style.display = "");
    return;
  }
  cards.forEach(card => {
    const id = card.dataset.id;
    const laptop = AppState.results.find(l => l.id === id);
    if (!laptop) return;
    const tags = laptop.tags || [];
    const show = AppState.activeFilters.some(f => tags.includes(f));
    card.style.display = show ? "" : "none";
  });
}

// ─────────────────────────────────────────────
// DEMO LAPTOP DATA
// Used as fallback if Firebase isn't configured yet.
// Replace with real Firestore data in production.
// ─────────────────────────────────────────────
const DEMO_LAPTOPS = [
  {
    id: "demo_1",
    name: "MacBook Air M3",
    brand: "Apple",
    price: 114900,
    image: "",
    cpu: "Apple M3",
    gpu: "10-core GPU",
    ram: "16GB",
    storage: "512GB",
    affiliateLink: "https://amzn.to/example1",
    pros: ["Incredible battery (18hr)", "Silent fanless design", "Best-in-class performance/watt"],
    cons: ["No gaming GPU", "Expensive for Indian market"],
    tags: ["ultrabook", "apple", "student", "coding"],
    scores: { gaming: 3, battery: 10, coding: 9, editing: 8, portability: 9, student: 9, performance: 8 }
  },
  {
    id: "demo_2",
    name: "ASUS ROG Strix G16",
    brand: "ASUS",
    price: 129990,
    image: "",
    cpu: "Intel Core i7-13650HX",
    gpu: "RTX 4060 8GB",
    ram: "16GB DDR5",
    storage: "1TB",
    affiliateLink: "https://amzn.to/example2",
    pros: ["Excellent gaming performance", "165Hz display", "Good cooling system"],
    cons: ["Heavy (2.5kg)", "Battery only 4-5 hours"],
    tags: ["gaming", "asus", "editing"],
    scores: { gaming: 9, battery: 4, coding: 7, editing: 8, portability: 4, student: 6, performance: 9 }
  },
  {
    id: "demo_3",
    name: "Dell XPS 15",
    brand: "Dell",
    price: 159990,
    image: "",
    cpu: "Intel Core i7-13700H",
    gpu: "RTX 4060",
    ram: "16GB DDR5",
    storage: "512GB",
    affiliateLink: "https://amzn.to/example3",
    pros: ["Stunning 4K OLED display", "Premium build quality", "Great for editing"],
    cons: ["Expensive", "Battery could be better"],
    tags: ["premium", "dell", "editing", "coding"],
    scores: { gaming: 7, battery: 6, coding: 9, editing: 9, portability: 7, student: 7, performance: 9 }
  },
  {
    id: "demo_4",
    name: "Lenovo IdeaPad Slim 5",
    brand: "Lenovo",
    price: 62990,
    image: "",
    cpu: "AMD Ryzen 5 7530U",
    gpu: "Radeon integrated",
    ram: "16GB",
    storage: "512GB",
    affiliateLink: "https://amzn.to/example4",
    pros: ["Best value for money", "Good battery life", "Lightweight for travel"],
    cons: ["No dedicated GPU", "Average build quality"],
    tags: ["budget", "lenovo", "student"],
    scores: { gaming: 3, battery: 8, coding: 6, editing: 4, portability: 8, student: 9, performance: 6 }
  },
  {
    id: "demo_5",
    name: "HP Spectre x360 14",
    brand: "HP",
    price: 149990,
    image: "",
    cpu: "Intel Core Ultra 7",
    gpu: "Intel Arc",
    ram: "16GB LPDDR5",
    storage: "1TB",
    affiliateLink: "https://amzn.to/example5",
    pros: ["Stunning 2.8K OLED display", "2-in-1 flexibility", "Premium design"],
    cons: ["High price", "Limited gaming capability"],
    tags: ["premium", "hp", "ultrabook", "student"],
    scores: { gaming: 4, battery: 8, coding: 8, editing: 7, portability: 8, student: 9, performance: 7 }
  },
  {
    id: "demo_6",
    name: "Lenovo Legion 5 Pro",
    brand: "Lenovo",
    price: 89990,
    image: "",
    cpu: "AMD Ryzen 7 7745HX",
    gpu: "RTX 4060 8GB",
    ram: "16GB DDR5",
    storage: "512GB",
    affiliateLink: "https://amzn.to/example6",
    pros: ["Best gaming value", "Excellent cooling", "165Hz QHD display"],
    cons: ["Chunky design", "Mediocre battery on gaming"],
    tags: ["gaming", "lenovo", "editing"],
    scores: { gaming: 9, battery: 5, coding: 8, editing: 8, portability: 5, student: 7, performance: 9 }
  },
  {
    id: "demo_7",
    name: "ASUS ZenBook 14 OLED",
    brand: "ASUS",
    price: 74990,
    image: "",
    cpu: "AMD Ryzen 7 7730U",
    gpu: "AMD Radeon",
    ram: "16GB",
    storage: "512GB",
    affiliateLink: "https://amzn.to/example7",
    pros: ["Gorgeous OLED display", "Slim and light", "Great for students"],
    cons: ["No dedicated GPU", "Limited ports"],
    tags: ["ultrabook", "asus", "student", "coding"],
    scores: { gaming: 3, battery: 8, coding: 7, editing: 6, portability: 9, student: 9, performance: 6 }
  },
  {
    id: "demo_8",
    name: "Acer Aspire 7",
    brand: "Acer",
    price: 52990,
    image: "",
    cpu: "AMD Ryzen 5 5500U",
    gpu: "GTX 1650",
    ram: "8GB DDR4",
    storage: "512GB",
    affiliateLink: "https://amzn.to/example8",
    pros: ["Affordable with GPU", "Good for light gaming", "Decent performance"],
    cons: ["Average display", "8GB RAM is limited", "Older CPU generation"],
    tags: ["budget", "acer", "gaming", "student"],
    scores: { gaming: 6, battery: 6, coding: 5, editing: 5, portability: 7, student: 8, performance: 6 }
  }
];

// ─────────────────────────────────────────────
// INIT — runs when DOM is ready
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initSearch();

  // Theme toggle button
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  // Quiz start button
  const startBtn = document.getElementById("startQuiz");
  if (startBtn) startBtn.addEventListener("click", startQuiz);

  // Quiz navigation buttons
  const nextBtn = document.getElementById("quizNext");
  if (nextBtn) nextBtn.addEventListener("click", nextQuestion);

  const backBtn = document.getElementById("quizBack");
  if (backBtn) backBtn.addEventListener("click", prevQuestion);

  // Retake quiz button
  const retakeBtn = document.getElementById("retakeQuiz");
  if (retakeBtn) retakeBtn.addEventListener("click", startQuiz);

  // Nav "Start Quiz" button
  const navQuizBtn = document.getElementById("navStartQuiz");
  if (navQuizBtn) navQuizBtn.addEventListener("click", startQuiz);
});
