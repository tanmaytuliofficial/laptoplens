// ============================================================
// LAPTOPLENS — Quiz Engine
// All quiz questions and the matching algorithm live here.
// ============================================================

// ─────────────────────────────────────────────
// QUIZ QUESTIONS
// Each question has: id, icon, text, hint, type, options
// Types: single (pick one), slider (range), multi (pick many)
// ─────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    id: "budget",
    icon: "💰",
    text: "What's your budget?",
    hint: "Drag to set your comfortable spending range",
    type: "slider",
    min: 20000, max: 300000, step: 5000, unit: "₹",
    default: 80000,
    // Map ranges to scoring weights used later
    ranges: [
      { max: 40000,  label: "Budget", tag: "budget" },
      { max: 70000,  label: "Mid-range", tag: "midrange" },
      { max: 120000, label: "Upper-mid", tag: "uppermid" },
      { max: 200000, label: "Premium", tag: "premium" },
      { max: 300000, label: "Flagship", tag: "flagship" },
    ]
  },
  {
    id: "use_case",
    icon: "🎯",
    text: "What will you mainly use this laptop for?",
    hint: "Pick the one that fits best — you can always use it for other things too",
    type: "single",
    layout: "two-col",
    options: [
      { value: "student", icon: "📚", label: "Student / College", sub: "Notes, browsing, docs" },
      { value: "coding",  icon: "💻", label: "Coding & Dev",       sub: "VSCode, terminals, APIs" },
      { value: "gaming",  icon: "🎮", label: "Gaming",             sub: "AAA games, competitive" },
      { value: "editing", icon: "🎬", label: "Video Editing",      sub: "Premiere, DaVinci, FCP" },
      { value: "design",  icon: "🎨", label: "Graphic Design",     sub: "Figma, Illustrator, PS" },
      { value: "business",icon: "📊", label: "Business / Office",  sub: "Excel, Zoom, presentations" },
    ]
  },
  {
    id: "gaming_level",
    icon: "🎮",
    text: "How serious is your gaming?",
    hint: "Be honest — this heavily affects GPU recommendations",
    type: "single",
    layout: "one-col",
    options: [
      { value: "none",       icon: "🚫", label: "No gaming at all",              sub: "I don't play games" },
      { value: "casual",     icon: "🕹️",  label: "Casual gaming",                sub: "Minecraft, indie games, browser games" },
      { value: "moderate",   icon: "⚔️",  label: "Moderate gamer",              sub: "GTA, FIFA, Valorant occasionally" },
      { value: "serious",    icon: "🏆", label: "Serious gamer",                sub: "Daily gaming, high FPS, competitive" },
      { value: "enthusiast", icon: "🔥", label: "Enthusiast / Streamer",        sub: "Max settings, streaming, tournaments" },
    ]
  },
  {
    id: "battery",
    icon: "🔋",
    text: "How important is battery life?",
    hint: "Think about how often you're near a power outlet",
    type: "single",
    layout: "one-col",
    options: [
      { value: "1", icon: "⚡", label: "Not important — I'm always plugged in",   sub: "Home/desk setup" },
      { value: "2", icon: "🔌", label: "Moderate — 4-6 hours is fine",            sub: "Occasional travel" },
      { value: "3", icon: "🔋", label: "Important — 6-8 hours minimum",           sub: "College, daily commute" },
      { value: "4", icon: "💪", label: "Very important — 8+ hours",               sub: "All-day portable use" },
      { value: "5", icon: "🏕️", label: "Critical — no charging access sometimes", sub: "Travel, field work" },
    ]
  },
  {
    id: "portability",
    icon: "🎒",
    text: "How portable does it need to be?",
    hint: "Affects weight and form factor recommendations",
    type: "single",
    layout: "two-col",
    options: [
      { value: "1", icon: "🏠", label: "Stays home",      sub: "Weight doesn't matter" },
      { value: "2", icon: "📦", label: "Occasionally moved", sub: "1-2 times a week" },
      { value: "3", icon: "🎒", label: "Daily commute",   sub: "College / office" },
      { value: "4", icon: "✈️",  label: "Frequent travel", sub: "Weekly flights" },
      { value: "5", icon: "🪶", label: "Ultra-light",     sub: "Every gram counts" },
    ]
  },
  {
    id: "screen_size",
    icon: "🖥️",
    text: "What screen size do you prefer?",
    hint: "Larger = better workspace, smaller = more portable",
    type: "single",
    layout: "two-col",
    options: [
      { value: "13",   icon: "📱", label: "13 inch",     sub: "Super portable" },
      { value: "14",   icon: "📓", label: "14 inch",     sub: "Best balance" },
      { value: "15",   icon: "💼", label: "15-16 inch",  sub: "Most popular size" },
      { value: "17",   icon: "🖥️", label: "17+ inch",    sub: "Maximum screen space" },
      { value: "any",  icon: "🤷", label: "No preference", sub: "Show me everything" },
    ]
  },
  {
    id: "brand",
    icon: "🏷️",
    text: "Any brand preference?",
    hint: "Skip if you don't have a preference — we'll recommend the best regardless",
    type: "single",
    layout: "two-col",
    options: [
      { value: "apple",   icon: "🍎", label: "Apple",   sub: "macOS ecosystem" },
      { value: "dell",    icon: "💻", label: "Dell",    sub: "XPS, Inspiron, Alienware" },
      { value: "hp",      icon: "🖨️", label: "HP",      sub: "Spectre, Envy, Omen" },
      { value: "lenovo",  icon: "🔴", label: "Lenovo",  sub: "ThinkPad, IdeaPad, Legion" },
      { value: "asus",    icon: "🔵", label: "ASUS",    sub: "ZenBook, VivoBook, ROG" },
      { value: "any",     icon: "⭐", label: "No preference", sub: "Best value wins" },
    ]
  },
  {
    id: "editing",
    icon: "🎬",
    text: "Do you edit photos or videos?",
    hint: "Professional editing needs more GPU and RAM",
    type: "single",
    layout: "one-col",
    options: [
      { value: "none",    icon: "🚫", label: "No editing at all",          sub: "Not relevant" },
      { value: "light",   icon: "📸", label: "Light photo editing",        sub: "Basic Lightroom / Snapseed" },
      { value: "moderate",icon: "🎞️",  label: "Moderate video editing",   sub: "YouTube videos, reels" },
      { value: "heavy",   icon: "🎬", label: "Heavy video editing",        sub: "4K, color grading, effects" },
      { value: "pro",     icon: "🏆", label: "Pro-level production",       sub: "Cinema, 3D rendering, DaVinci" },
    ]
  },
  {
    id: "coding",
    icon: "💻",
    text: "What's your coding intensity?",
    hint: "AI/ML workloads need significantly more compute",
    type: "single",
    layout: "one-col",
    options: [
      { value: "none",    icon: "🚫", label: "No coding",                  sub: "Not a developer" },
      { value: "light",   icon: "🌱", label: "Beginner / hobby coding",    sub: "HTML, Python basics" },
      { value: "moderate",icon: "⚙️", label: "Regular developer",          sub: "Full-stack, mobile apps" },
      { value: "heavy",   icon: "🧠", label: "Heavy developer / DevOps",   sub: "Docker, VMs, compiling" },
      { value: "ai",      icon: "🤖", label: "AI/ML Engineer",             sub: "PyTorch, CUDA, LLM fine-tuning" },
    ]
  },
  {
    id: "perf_vs_battery",
    icon: "⚖️",
    text: "Performance vs. Battery — where do you lean?",
    hint: "Most laptops trade one for the other",
    type: "single",
    layout: "one-col",
    options: [
      { value: "max_perf",    icon: "🚀", label: "Maximum performance, I'll plug in",  sub: "Every watt toward power" },
      { value: "perf_lean",   icon: "⚡", label: "Lean toward performance",            sub: "Some battery sacrifice is OK" },
      { value: "balanced",    icon: "⚖️", label: "Perfectly balanced",                sub: "Good at both" },
      { value: "batt_lean",   icon: "🔋", label: "Lean toward battery",               sub: "A bit less power is fine" },
      { value: "max_battery", icon: "🪶", label: "Maximum battery life",              sub: "Performance is secondary" },
    ]
  },
  {
    id: "storage",
    icon: "💾",
    text: "How much storage do you need?",
    hint: "Video editors and gamers need significantly more",
    type: "single",
    layout: "two-col",
    options: [
      { value: "256",  icon: "💿", label: "256 GB",  sub: "Light use, cloud sync" },
      { value: "512",  icon: "📀", label: "512 GB",  sub: "Most users" },
      { value: "1000", icon: "🗄️", label: "1 TB",    sub: "Games, large projects" },
      { value: "2000", icon: "🏗️", label: "2 TB+",   sub: "Video library, serious work" },
    ]
  },
  {
    id: "future_proof",
    icon: "🔭",
    text: "How long should this laptop last you?",
    hint: "Affects whether we recommend higher specs than your immediate needs",
    type: "single",
    layout: "two-col",
    options: [
      { value: "1", icon: "📅", label: "1-2 years",  sub: "Short-term, might upgrade soon" },
      { value: "2", icon: "📆", label: "3-4 years",  sub: "Standard replacement cycle" },
      { value: "3", icon: "🗓️", label: "5+ years",   sub: "Buy once, use long" },
      { value: "4", icon: "♾️", label: "As long as possible", sub: "Max specs for longevity" },
    ]
  }
];


// ─────────────────────────────────────────────
// MATCHING ALGORITHM
// Compares user answers to each laptop's scores
// and returns a match percentage (0–100).
// ─────────────────────────────────────────────

/**
 * calculateMatch(answers, laptop)
 * 
 * HOW IT WORKS (beginner explanation):
 * 1. We look at what the user said (answers).
 * 2. Each answer adds WEIGHT to certain categories (gaming, coding, etc.)
 * 3. We compare those weights to the laptop's category scores.
 * 4. The higher the overlap, the higher the match %.
 * 
 * Returns: { score: 0-100, reasons: string[] }
 */
function calculateMatch(answers, laptop) {
  let totalWeight = 0;
  let weightedScore = 0;
  const reasons = [];
  const mismatches = [];

  // ── Budget check ──
  const budget = answers.budget || 80000;
  const price = laptop.price || 0;
  if (price > budget * 1.15) {
    // Over budget by more than 15% → heavy penalty
    const overBy = Math.round(((price - budget) / budget) * 100);
    return {
      score: Math.max(5, 50 - overBy),
      reasons: [`₹${(price/1000).toFixed(0)}K is over your ₹${(budget/1000).toFixed(0)}K budget`],
      mismatches: ["Over budget"]
    };
  }
  if (price <= budget) {
    reasons.push(`Fits within your ₹${(budget/1000).toFixed(0)}K budget`);
  }

  // ── Use case scoring ──
  const useCase = answers.use_case;
  if (useCase) {
    totalWeight += 25;
    const usecaseScore = laptop.scores?.[useCase] ?? laptop.scores?.student ?? 5;
    weightedScore += (usecaseScore / 10) * 25;
    if (usecaseScore >= 8) reasons.push(`Excellent for ${useCase}`);
    else if (usecaseScore <= 4) mismatches.push(`Not ideal for ${useCase}`);
  }

  // ── Gaming ──
  const gaming = answers.gaming_level;
  if (gaming && gaming !== "none") {
    totalWeight += 20;
    const gamingScore = laptop.scores?.gaming ?? 5;
    const gamingNeeded = { casual: 3, moderate: 5, serious: 7, enthusiast: 9 };
    const needed = gamingNeeded[gaming] || 5;
    const diff = gamingScore - needed;
    const contribution = Math.min(1, Math.max(0, (gamingScore / 10)));
    weightedScore += contribution * 20;
    if (gamingScore >= needed) reasons.push(`Handles ${gaming} gaming well`);
    else mismatches.push(`GPU may struggle for ${gaming} gaming`);
  }

  // ── Battery ──
  const battery = parseInt(answers.battery || "3");
  if (battery >= 3) {
    totalWeight += 15;
    const battScore = laptop.scores?.battery ?? 5;
    weightedScore += (battScore / 10) * 15;
    if (battScore >= 7 && battery >= 4) reasons.push("Long battery life");
    else if (battScore < 5 && battery >= 4) mismatches.push("Battery may not last your full day");
  }

  // ── Portability ──
  const portability = parseInt(answers.portability || "3");
  if (portability >= 3) {
    totalWeight += 10;
    const portScore = laptop.scores?.portability ?? 5;
    weightedScore += (portScore / 10) * 10;
    if (portScore >= 7) reasons.push("Lightweight and portable");
    else if (portability >= 4 && portScore < 5) mismatches.push("Heavier than ideal for your travel needs");
  }

  // ── Editing ──
  const editing = answers.editing;
  if (editing && editing !== "none") {
    totalWeight += 15;
    const editScore = laptop.scores?.editing ?? 5;
    const editNeeded = { light: 4, moderate: 6, heavy: 8, pro: 9 };
    const needed = editNeeded[editing] || 5;
    weightedScore += (editScore / 10) * 15;
    if (editScore >= needed) reasons.push(`Great for ${editing} editing`);
    else mismatches.push(`May struggle with ${editing} editing tasks`);
  }

  // ── Coding ──
  const coding = answers.coding;
  if (coding && coding !== "none") {
    totalWeight += 15;
    const codeScore = laptop.scores?.coding ?? 5;
    weightedScore += (codeScore / 10) * 15;
    if (codeScore >= 8) reasons.push("Powerful for development work");
    if (coding === "ai" && codeScore < 8) mismatches.push("May not handle AI/ML workloads well");
  }

  // ── Storage ──
  const storageNeeded = parseInt(answers.storage || "512");
  const laptopStorage = parseInt(laptop.storage || "512");
  if (laptopStorage >= storageNeeded) {
    totalWeight += 5;
    weightedScore += 5;
    reasons.push(`${laptop.storage} storage fits your needs`);
  } else {
    mismatches.push("Storage might be insufficient");
  }

  // ── Performance vs Battery preference ──
  const perfPref = answers.perf_vs_battery;
  if (perfPref) {
    totalWeight += 10;
    const perfScore   = laptop.scores?.performance ?? 5;
    const battScore   = laptop.scores?.battery ?? 5;
    let prefScore = 5;
    if (perfPref === "max_perf")    prefScore = perfScore;
    if (perfPref === "perf_lean")   prefScore = (perfScore * 0.7 + battScore * 0.3);
    if (perfPref === "balanced")    prefScore = (perfScore + battScore) / 2;
    if (perfPref === "batt_lean")   prefScore = (perfScore * 0.3 + battScore * 0.7);
    if (perfPref === "max_battery") prefScore = battScore;
    weightedScore += (prefScore / 10) * 10;
  }

  // ── Future proofing boost ──
  const futureProof = parseInt(answers.future_proof || "2");
  if (futureProof >= 3) {
    // Boost laptops with high specs
    const avgScore = Object.values(laptop.scores || {}).reduce((a,b) => a+b, 0) /
                     Math.max(1, Object.values(laptop.scores || {}).length);
    if (avgScore >= 7) {
      reasons.push("Well-spec'd for long-term use");
    }
  }

  // ── Brand match ──
  const brand = answers.brand;
  if (brand && brand !== "any") {
    if (laptop.brand?.toLowerCase() === brand.toLowerCase()) {
      reasons.push(`Matches your ${brand} preference`);
    }
  }

  // ── Calculate final score ──
  if (totalWeight === 0) return { score: 60, reasons: ["General recommendation"], mismatches: [] };
  
  let rawScore = (weightedScore / totalWeight) * 100;
  
  // Small bonus if fully under budget
  if (price <= budget * 0.9) rawScore = Math.min(100, rawScore + 3);

  // Cap and floor
  const finalScore = Math.round(Math.max(15, Math.min(99, rawScore)));

  return {
    score: finalScore,
    reasons: reasons.slice(0, 4),     // top 4 reasons
    mismatches: mismatches.slice(0, 2)
  };
}


/**
 * rankLaptops(answers, laptops)
 * Runs calculateMatch for all laptops and sorts by score descending.
 * Returns top N results with their match data.
 */
function rankLaptops(answers, laptops, topN = 6) {
  const ranked = laptops.map(laptop => {
    const match = calculateMatch(answers, laptop);
    return { ...laptop, matchScore: match.score, matchReasons: match.reasons, matchMismatches: match.mismatches };
  });

  ranked.sort((a, b) => b.matchScore - a.matchScore);
  return ranked.slice(0, topN);
}
