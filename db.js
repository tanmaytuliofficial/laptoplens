const { createClient } = require('@supabase/supabase-js');

let supabase = null;
let useSupabase = false;

// Try Supabase first, fallback to SQLite
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  useSupabase = true;
  console.log('Using Supabase');
} else {
  console.log('Using SQLite (local dev)');
}

let sqlite = null;

async function init() {
  if (useSupabase) return; // Supabase tables managed via dashboard
  const Database = require('better-sqlite3');
  const path = require('path');
  sqlite = new Database(path.join(__dirname, '../../laptoplens.db'));

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS laptops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT,
      price INTEGER,
      image_url TEXT,
      amazon_url TEXT,
      affiliate_url TEXT,
      specs TEXT,
      tags TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      quiz_answers TEXT,
      matched_laptops TEXT,
      ip TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS clicks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      laptop_id INTEGER,
      action TEXT,
      session_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT,
      ip TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Seed sample laptops if empty
  const count = sqlite.prepare('SELECT COUNT(*) as c FROM laptops').get();
  if (count.c === 0) {
    const insert = sqlite.prepare(`INSERT INTO laptops (name, brand, price, image_url, amazon_url, affiliate_url, specs, tags) VALUES (?,?,?,?,?,?,?,?)`);
    const seed = [
      ['ASUS Vivobook 16X OLED', 'asus', 62990, 'https://m.media-amazon.com/images/I/71oL9PLKFWL._SL1500_.jpg', 'https://www.amazon.in/dp/B0BZGHKM5V', '', '{"cpu":"AMD Ryzen 5 6600H","ram":"16GB","storage":"512GB SSD","display":"16 OLED FHD","gpu":"Integrated"}', 'study,coding,mid,15,windows,mid,normal,16,none,college'],
      ['Lenovo IdeaPad Slim 5', 'lenovo', 57990, 'https://m.media-amazon.com/images/I/61WFPU1OZKL._SL1500_.jpg', 'https://www.amazon.in/dp/B0BZGJN9RX', '', '{"cpu":"AMD Ryzen 5 7530U","ram":"16GB","storage":"512GB SSD","display":"15.6 FHD IPS","gpu":"Integrated"}', 'study,coding,mid,15,windows,high,ultra,16,none,college'],
      ['HP Pavilion 15', 'hp', 54990, 'https://m.media-amazon.com/images/I/61RnGqMaQEL._SL1500_.jpg', 'https://www.amazon.in/dp/B0BZ87C2PX', '', '{"cpu":"Intel Core i5-12th Gen","ram":"8GB","storage":"512GB SSD","display":"15.6 FHD","gpu":"Integrated"}', 'study,business,basic,15,windows,mid,normal,8,none,college'],
      ['ASUS TUF Gaming F15', 'asus', 74990, 'https://m.media-amazon.com/images/I/71vFKBpKakL._SL1500_.jpg', 'https://www.amazon.in/dp/B0BZH8KT8J', '', '{"cpu":"Intel Core i5-12500H","ram":"16GB","storage":"512GB SSD","display":"15.6 144Hz FHD","gpu":"RTX 3050"}', 'gaming,gaming,high,15,windows,low,desktop,16,heavy,college'],
      ['Lenovo LOQ 15', 'lenovo', 79990, 'https://m.media-amazon.com/images/I/71r3rAPuZJL._SL1500_.jpg', 'https://www.amazon.in/dp/B0C3SZLPTV', '', '{"cpu":"AMD Ryzen 5 7300HX","ram":"16GB","storage":"512GB SSD","display":"15.6 144Hz FHD","gpu":"RTX 4060"}', 'gaming,gaming,high,15,windows,low,desktop,16,heavy,college'],
      ['MacBook Air M3', 'apple', 114900, 'https://m.media-amazon.com/images/I/71jG+e7roXL._SL1500_.jpg', 'https://www.amazon.in/dp/B0CX3JM7SQ', '', '{"cpu":"Apple M3","ram":"8GB","storage":"256GB SSD","display":"13.6 Liquid Retina","gpu":"10-core GPU"}', 'coding,design,high,13,mac,high,ultra,8,none,professional'],
      ['Dell Inspiron 15', 'dell', 49990, 'https://m.media-amazon.com/images/I/61eY2MmEadL._SL1500_.jpg', 'https://www.amazon.in/dp/B0BZG3M5GS', '', '{"cpu":"Intel Core i3-12th Gen","ram":"8GB","storage":"256GB SSD","display":"15.6 FHD","gpu":"Integrated"}', 'study,business,basic,15,windows,mid,normal,8,none,school'],
      ['Acer Nitro V 15', 'acer', 69990, 'https://m.media-amazon.com/images/I/71bKsGCz+QL._SL1500_.jpg', 'https://www.amazon.in/dp/B0BZH7WSGK', '', '{"cpu":"AMD Ryzen 5 7535HS","ram":"8GB","storage":"512GB SSD","display":"15.6 144Hz FHD","gpu":"RTX 4050"}', 'gaming,gaming,high,15,windows,low,desktop,8,heavy,college']
    ];
    seed.forEach(s => insert.run(...s));
    console.log('Seeded 8 sample laptops');
  }
}

// ====== LAPTOP QUERIES ======

async function getLaptops(activeOnly = true) {
  if (useSupabase) {
    let q = supabase.from('laptops').select('*');
    if (activeOnly) q = q.eq('active', true);
    const { data } = await q.order('created_at', { ascending: false });
    return data || [];
  }
  const filter = activeOnly ? 'WHERE active=1' : '';
  return sqlite.prepare(`SELECT * FROM laptops ${filter} ORDER BY id DESC`).all();
}

async function getLaptopById(id) {
  if (useSupabase) {
    const { data } = await supabase.from('laptops').select('*').eq('id', id).single();
    return data;
  }
  return sqlite.prepare('SELECT * FROM laptops WHERE id=?').get(id);
}

async function insertLaptop(laptop) {
  if (useSupabase) {
    const { data } = await supabase.from('laptops').insert(laptop).select().single();
    return data;
  }
  const r = sqlite.prepare(`INSERT INTO laptops (name,brand,price,image_url,amazon_url,affiliate_url,specs,tags) VALUES (?,?,?,?,?,?,?,?)`).run(
    laptop.name, laptop.brand, laptop.price, laptop.image_url, laptop.amazon_url, laptop.affiliate_url, laptop.specs, laptop.tags
  );
  return { id: r.lastInsertRowid, ...laptop };
}

async function updateLaptop(id, data) {
  if (useSupabase) {
    await supabase.from('laptops').update(data).eq('id', id);
    return;
  }
  const fields = Object.keys(data).map(k => `${k}=?`).join(',');
  sqlite.prepare(`UPDATE laptops SET ${fields} WHERE id=?`).run(...Object.values(data), id);
}

// ====== SESSION QUERIES ======

async function insertSession(session) {
  if (useSupabase) {
    await supabase.from('sessions').insert(session);
    return;
  }
  sqlite.prepare('INSERT INTO sessions (id,quiz_answers,matched_laptops,ip) VALUES (?,?,?,?)').run(
    session.id, session.quiz_answers, session.matched_laptops, session.ip
  );
}

async function getSessions(limit = 50) {
  if (useSupabase) {
    const { data } = await supabase.from('sessions').select('*').order('created_at', { ascending: false }).limit(limit);
    return data || [];
  }
  return sqlite.prepare('SELECT * FROM sessions ORDER BY created_at DESC LIMIT ?').all(limit);
}

// ====== CLICK QUERIES ======

async function insertClick(click) {
  if (useSupabase) {
    await supabase.from('clicks').insert(click);
    return;
  }
  sqlite.prepare('INSERT INTO clicks (laptop_id,action,session_id) VALUES (?,?,?)').run(
    click.laptop_id, click.action, click.session_id
  );
}

async function getClicks(limit = 100) {
  if (useSupabase) {
    const { data } = await supabase.from('clicks').select('*, laptops(name)').order('created_at', { ascending: false }).limit(limit);
    return (data || []).map(c => ({ ...c, laptop_name: c.laptops?.name }));
  }
  return sqlite.prepare(`SELECT c.*, l.name as laptop_name FROM clicks c LEFT JOIN laptops l ON c.laptop_id=l.id ORDER BY c.created_at DESC LIMIT ?`).all(limit);
}

// ====== STATS QUERIES ======

async function getStats() {
  if (useSupabase) {
    const today = new Date().toISOString().split('T')[0];
    const [{ count: visitors }, { count: quizzes }, { count: clicks }, { count: laptops }, { count: visitorsToday }] = await Promise.all([
      supabase.from('page_views').select('*', { count: 'exact', head: true }),
      supabase.from('sessions').select('*', { count: 'exact', head: true }),
      supabase.from('clicks').select('*', { count: 'exact', head: true }).eq('action', 'buy'),
      supabase.from('laptops').select('*', { count: 'exact', head: true }).eq('active', true),
      supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', today)
    ]);
    return { visitors, quizzes, clicks, laptops, visitorsToday };
  }
  return {
    visitors: sqlite.prepare('SELECT COUNT(*) as c FROM page_views').get()?.c || 0,
    quizzes: sqlite.prepare('SELECT COUNT(*) as c FROM sessions').get()?.c || 0,
    clicks: sqlite.prepare("SELECT COUNT(*) as c FROM clicks WHERE action='buy'").get()?.c || 0,
    laptops: sqlite.prepare('SELECT COUNT(*) as c FROM laptops WHERE active=1').get()?.c || 0,
    visitorsToday: sqlite.prepare("SELECT COUNT(*) as c FROM page_views WHERE DATE(created_at)=DATE('now')").get()?.c || 0
  };
}

async function getTopLaptops() {
  if (useSupabase) {
    const { data: clicks } = await supabase.from('clicks').select('laptop_id, action');
    const map = {};
    (clicks || []).forEach(c => {
      if (!map[c.laptop_id]) map[c.laptop_id] = { views: 0, buys: 0 };
      if (c.action === 'view') map[c.laptop_id].views++;
      if (c.action === 'buy') map[c.laptop_id].buys++;
    });
    const { data: laptops } = await supabase.from('laptops').select('id,name');
    return (laptops || []).map(l => ({ ...l, ...(map[l.id] || { views: 0, buys: 0 }) }))
      .sort((a, b) => b.buys - a.buys).slice(0, 10);
  }
  return sqlite.prepare(`
    SELECT l.name, 
      SUM(CASE WHEN c.action='view' THEN 1 ELSE 0 END) as views,
      SUM(CASE WHEN c.action='buy' THEN 1 ELSE 0 END) as buys
    FROM laptops l LEFT JOIN clicks c ON l.id=c.laptop_id
    WHERE l.active=1 GROUP BY l.id ORDER BY buys DESC LIMIT 10
  `).all();
}

async function logPageView(path, ip) {
  if (useSupabase) {
    await supabase.from('page_views').insert({ path, ip });
    return;
  }
  sqlite?.prepare('INSERT INTO page_views (path,ip) VALUES (?,?)').run(path, ip);
}

module.exports = {
  init, getLaptops, getLaptopById, insertLaptop, updateLaptop,
  insertSession, getSessions, insertClick, getClicks,
  getStats, getTopLaptops, logPageView
};
