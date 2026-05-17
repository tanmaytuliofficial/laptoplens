const QUESTIONS = [
  {
    id: 'budget',
    type: 'slider',
    title: 'What is your budget?',
    sub: 'Drag to set your maximum spend',
    min: 25000, max: 200000, step: 5000, default: 60000,
    format: v => '₹' + Number(v).toLocaleString('en-IN'),
    labels: ['₹25,000', '₹1,00,000', '₹2,00,000']
  },
  {
    id: 'usecase',
    type: 'options',
    title: 'What will you primarily use it for?',
    sub: 'Choose the one that fits best',
    options: [
      { val: 'study', icon: '📚', label: 'College / Study', desc: 'Notes, assignments, browsing' },
      { val: 'coding', icon: '💻', label: 'Coding / Dev', desc: 'VS Code, terminal, web dev' },
      { val: 'gaming', icon: '🎮', label: 'Gaming', desc: 'AAA games, casual gaming' },
      { val: 'design', icon: '🎨', label: 'Design / Creative', desc: 'Photoshop, video editing' },
      { val: 'business', icon: '💼', label: 'Office / Business', desc: 'Excel, PPT, meetings' },
      { val: 'engineering', icon: '⚙️', label: 'Engineering / CAD', desc: 'AutoCAD, SolidWorks, MATLAB' }
    ]
  },
  {
    id: 'performance',
    type: 'options',
    title: 'Performance level needed?',
    sub: 'Higher performance = heavier, more expensive',
    options: [
      { val: 'basic', icon: '🌱', label: 'Basic', desc: 'Docs, YouTube, browsing' },
      { val: 'mid', icon: '⚡', label: 'Mid-range', desc: 'Multitasking, light editing' },
      { val: 'high', icon: '🚀', label: 'High-end', desc: 'Heavy workloads, 3D, gaming' }
    ],
    cols: 'three'
  },
  {
    id: 'screen',
    type: 'options',
    title: 'Preferred screen size?',
    sub: 'Bigger screen = less portable',
    options: [
      { val: '13', icon: '📱', label: '13–14 inch', desc: 'Ultraportable' },
      { val: '15', icon: '💻', label: '15–16 inch', desc: 'Most popular' },
      { val: '17', icon: '🖥️', label: '17+ inch', desc: 'Desktop replacement' }
    ],
    cols: 'three'
  },
  {
    id: 'os',
    type: 'options',
    title: 'Operating system preference?',
    sub: '',
    options: [
      { val: 'windows', icon: '🪟', label: 'Windows', desc: 'Most compatible' },
      { val: 'mac', icon: '🍎', label: 'macOS', desc: 'Premium, creative work' },
      { val: 'any', icon: '🌐', label: 'No preference', desc: 'Show me the best deal' }
    ],
    cols: 'three'
  },
  {
    id: 'battery',
    type: 'options',
    title: 'How important is battery life?',
    sub: '',
    options: [
      { val: 'low', icon: '🔌', label: 'Not critical', desc: 'Near power outlet mostly' },
      { val: 'mid', icon: '🔋', label: 'Moderate (6–8h)', desc: 'College lectures, travel' },
      { val: 'high', icon: '⚡', label: 'Very important (10h+)', desc: 'All-day without charger' }
    ],
    cols: 'three'
  },
  {
    id: 'portability',
    type: 'options',
    title: 'How portable does it need to be?',
    sub: '',
    options: [
      { val: 'ultra', icon: '🪶', label: 'Ultralight', desc: 'Under 1.5kg, slim' },
      { val: 'normal', icon: '🎒', label: 'Normal', desc: '1.5–2kg, standard' },
      { val: 'desktop', icon: '🏋️', label: "Don't care", desc: 'Power over weight' }
    ],
    cols: 'three'
  },
  {
    id: 'ram',
    type: 'options',
    title: 'How much RAM do you need?',
    sub: '16GB is recommended for most use cases in 2026',
    options: [
      { val: 8, icon: '💾', label: '8 GB', desc: 'Basic tasks only' },
      { val: 16, icon: '💾', label: '16 GB', desc: 'Recommended' },
      { val: 32, icon: '💾', label: '32 GB+', desc: 'Heavy workloads' }
    ],
    cols: 'three'
  },
  {
    id: 'gaming',
    type: 'options',
    title: 'Do you need a dedicated GPU for gaming?',
    sub: '',
    options: [
      { val: 'none', icon: '❌', label: 'No gaming', desc: 'Integrated graphics fine' },
      { val: 'casual', icon: '🎯', label: 'Casual gaming', desc: 'Indie, older titles' },
      { val: 'heavy', icon: '🎮', label: 'Heavy gaming', desc: 'RTX/RX GPU needed' }
    ],
    cols: 'three'
  },
  {
    id: 'brand',
    type: 'multi',
    title: 'Any brand preferences?',
    sub: 'Select all you\'re okay with (or none for all)',
    options: [
      { val: 'hp', label: 'HP' },
      { val: 'dell', label: 'Dell' },
      { val: 'lenovo', label: 'Lenovo' },
      { val: 'asus', label: 'ASUS' },
      { val: 'acer', label: 'Acer' },
      { val: 'apple', label: 'Apple' },
      { val: 'msi', label: 'MSI' },
      { val: 'samsung', label: 'Samsung' }
    ]
  },
  {
    id: 'profession',
    type: 'options',
    title: 'Are you a student or professional?',
    sub: '',
    options: [
      { val: 'school', icon: '🎓', label: 'School student', desc: 'Class 9–12' },
      { val: 'college', icon: '🏫', label: 'College student', desc: 'UG / PG' },
      { val: 'professional', icon: '💼', label: 'Working professional', desc: 'Job, freelance' },
      { val: 'other', icon: '👤', label: 'Other', desc: '' }
    ]
  },
  {
    id: 'software',
    type: 'multi',
    title: 'Which software do you use?',
    sub: 'Select all that apply — helps us match specs',
    options: [
      { val: 'office', label: 'MS Office / Google Docs' },
      { val: 'coding', label: 'VS Code / IntelliJ' },
      { val: 'autocad', label: 'AutoCAD / SolidWorks' },
      { val: 'photoshop', label: 'Photoshop / Illustrator' },
      { val: 'premiere', label: 'Premiere / DaVinci Resolve' },
      { val: 'unity', label: 'Unity / Unreal Engine' },
      { val: 'zoom', label: 'Zoom / Teams / Meet' },
      { val: 'none', label: 'None of the above' }
    ]
  }
];

let current = 0;
let answers = {};

function startQuiz() {
  current = 0;
  answers = {};
  document.getElementById('quiz-overlay').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderQuestion();
}

function closeQuiz() {
  document.getElementById('quiz-overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

function renderQuestion() {
  const q = QUESTIONS[current];
  const pct = ((current + 1) / QUESTIONS.length) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('stepLabel').textContent = `Question ${current + 1} of ${QUESTIONS.length}`;
  document.getElementById('btnPrev').style.visibility = current === 0 ? 'hidden' : 'visible';
  document.getElementById('btnNext').textContent = current === QUESTIONS.length - 1 ? 'Find my laptop →' : 'Continue →';

  let html = `<div class="q-title">${q.title}</div>`;
  if (q.sub) html += `<div class="q-sub">${q.sub}</div>`;

  if (q.type === 'slider') {
    const val = answers[q.id] || q.default;
    html += `<div class="slider-wrap">
      <div class="slider-val" id="sliderDisplay">${q.format(val)}</div>
      <input type="range" class="q-slider" id="sliderInput"
        min="${q.min}" max="${q.max}" step="${q.step}" value="${val}"
        oninput="updateSlider(this.value)">
      <div class="slider-labels">${q.labels.map(l => `<span>${l}</span>`).join('')}</div>
    </div>`;
  } else if (q.type === 'options') {
    const cols = q.cols === 'three' ? 'three' : q.options.length === 2 ? 'single' : '';
    html += `<div class="q-options ${cols}">`;
    q.options.forEach(opt => {
      const sel = answers[q.id] === opt.val ? 'selected' : '';
      html += `<button class="q-option ${sel}" onclick="selectOption('${q.id}','${opt.val}',this)">
        ${opt.icon ? `<span class="opt-icon">${opt.icon}</span>` : ''}
        <span class="opt-label">${opt.label}</span>
        ${opt.desc ? `<span class="opt-desc">${opt.desc}</span>` : ''}
      </button>`;
    });
    html += '</div>';
  } else if (q.type === 'multi') {
    const sel = answers[q.id] || [];
    html += `<div class="q-options">`;
    q.options.forEach(opt => {
      const isSelected = sel.includes(opt.val) ? 'selected' : '';
      html += `<button class="q-option ${isSelected}" onclick="toggleMulti('${q.id}','${opt.val}',this)">
        <span class="opt-label">${opt.label}</span>
      </button>`;
    });
    html += '</div>';
  }

  document.getElementById('quizBody').innerHTML = html;
}

function updateSlider(val) {
  const q = QUESTIONS[current];
  document.getElementById('sliderDisplay').textContent = q.format(val);
  answers[q.id] = parseInt(val);
}

function selectOption(id, val, el) {
  answers[id] = val;
  document.querySelectorAll('.q-option').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

function toggleMulti(id, val, el) {
  if (!answers[id]) answers[id] = [];
  const idx = answers[id].indexOf(val);
  if (idx > -1) {
    answers[id].splice(idx, 1);
    el.classList.remove('selected');
  } else {
    answers[id].push(val);
    el.classList.add('selected');
  }
}

function nextQ() {
  const q = QUESTIONS[current];
  if (q.type === 'slider') {
    const inp = document.getElementById('sliderInput');
    if (inp) answers[q.id] = parseInt(inp.value);
  }
  if (current === QUESTIONS.length - 1) {
    submitQuiz();
    return;
  }
  current++;
  renderQuestion();
}

function prevQ() {
  if (current > 0) { current--; renderQuestion(); }
}

async function submitQuiz() {
  document.getElementById('quizBody').innerHTML = `
    <div style="text-align:center;padding:40px 0;">
      <div style="font-size:36px;margin-bottom:16px;">🔍</div>
      <div style="font-family:var(--font-display);font-size:20px;font-weight:700;margin-bottom:8px;">Finding your perfect laptop...</div>
      <div style="color:var(--text2);font-size:14px;">Matching your profile with our database</div>
    </div>`;
  document.getElementById('btnNext').disabled = true;
  document.getElementById('btnPrev').style.visibility = 'hidden';

  try {
    const res = await fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers)
    });
    const data = await res.json();
    const params = new URLSearchParams({ results: JSON.stringify(data.laptops), session: data.sessionId });
    window.location.href = '/results.html?' + params.toString();
  } catch (err) {
    const params = new URLSearchParams({ answers: JSON.stringify(answers) });
    window.location.href = '/results.html?' + params.toString();
  }
}
