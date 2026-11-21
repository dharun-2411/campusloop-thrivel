const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const envFile = path.join(__dirname, ".env");
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2");
  }
}

const PORT = process.env.PORT || 3000;
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const PUBLIC_DIR = path.join(__dirname, "public");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const starterProducts = [
  {id:"p1", title:"Engineering Mathematics Vol. 1", category:"Books", price:180, condition:"Good", seller:"Ananya", campus:"SNS College", description:"Clean pages, no missing chapters. Useful for first-year engineering.", image:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=900", createdAt:Date.now()-900000},
  {id:"p2", title:"Scientific Calculator", category:"Electronics", price:450, condition:"Like New", seller:"Karthik", campus:"SNS College", description:"Fully working scientific calculator. Includes protective cover.", image:"https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=900", createdAt:Date.now()-800000},
  {id:"p3", title:"Engineering Drawing Practice Set", category:"Stationery", price:220, condition:"Good", seller:"Meera", campus:"SNS College", description:"Used drawing practice supplies and notes for engineering graphics. Ask the seller which instruments are included.", image:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900", createdAt:Date.now()-700000},
  {id:"p4", title:"Casual Backpack", category:"Fashion", price:399, condition:"Good", seller:"Arun", campus:"SNS College", description:"Lightweight backpack with laptop compartment.", image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900", createdAt:Date.now()-600000},
  {id:"p5", title:"Desk Study Lamp", category:"Hostel Essentials", price:299, condition:"Like New", seller:"Divya", campus:"SNS College", description:"LED lamp with flexible neck. Perfect for hostel study desks.", image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900", createdAt:Date.now()-500000},
  {id:"p6", title:"Java Programming Guide", category:"Books", price:150, condition:"Good", seller:"Vishal", campus:"SNS College", description:"Beginner-friendly Java reference book.", image:"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900", createdAt:Date.now()-400000},
  {id:"p7", title:"Wireless Mouse", category:"Electronics", price:250, condition:"Good", seller:"Priya", campus:"SNS College", description:"Wireless mouse with USB receiver. Battery included.", image:"https://images.unsplash.com/photo-1527814050087-3793815479db?w=900", createdAt:Date.now()-300000},
  {id:"p8", title:"Lab Coat", category:"Fashion", price:280, condition:"Like New", seller:"Sanjay", campus:"SNS College", description:"White lab coat, size M. Recently washed.", image:"https://images.unsplash.com/photo-1584467735871-bd2f3f4f6a4a?w=900", createdAt:Date.now()-200000},
  {id:"p9", title:"Arduino Uno R3 Starter Kit", category:"Electronics", price:950, rentPrice:85, deposit:500, listingType:"both", condition:"Like New", seller:"Ishaan", campus:"SNS College", description:"Uno board, USB cable, LEDs, resistors and jumper wires for first embedded-systems projects.", image:"https://images.unsplash.com/photo-1553406830-ef2513450d76?w=900", createdAt:Date.now()-190000},
  {id:"p10", title:"Arduino Mega 2560 Board", category:"Electronics", price:1100, rentPrice:100, deposit:600, listingType:"both", condition:"Good", seller:"Nila", campus:"SNS College", description:"More I/O pins for robotics, automation and multi-sensor prototypes. Board and USB cable included.", image:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=900", createdAt:Date.now()-180000},
  {id:"p11", title:"ESP32 Wi-Fi + Bluetooth Dev Board", category:"Electronics", price:520, rentPrice:55, deposit:250, listingType:"both", condition:"Good", seller:"Rohan", campus:"SNS College", description:"Compact microcontroller board for IoT, wireless sensors and connected-device projects.", image:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=900", createdAt:Date.now()-170000},
  {id:"p12", title:"Electronics Prototyping Bundle", category:"Lab Equipment", price:420, rentPrice:45, deposit:200, listingType:"both", condition:"Good", seller:"Aditi", campus:"SNS College", description:"Full-size breadboard, jumper wire set, LEDs, resistors, push buttons and a small buzzer.", image:"https://images.unsplash.com/photo-1553406830-ef2513450d76?w=900", createdAt:Date.now()-160000},
  {id:"p13", title:"Arduino Sensor Pack", category:"Lab Equipment", price:680, rentPrice:65, deposit:300, listingType:"both", condition:"Like New", seller:"Dev", campus:"SNS College", description:"Ultrasonic distance, soil-moisture, temperature and light sensors for student prototypes.", image:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=900", createdAt:Date.now()-150000},
  {id:"p14", title:"Campus Robotics Demo Robot", category:"Lab Equipment", price:750, rentPrice:90, deposit:400, listingType:"both", condition:"Good", seller:"Maya", campus:"SNS College", description:"Pre-loved campus robotics demonstration robot for project presentations. Ask the owner about its controller, software and accessories.", image:"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900", createdAt:Date.now()-140000},
  {id:"p15", title:"Digital Multimeter", category:"Lab Equipment", price:390, rentPrice:40, deposit:150, listingType:"both", condition:"Good", seller:"Joel", campus:"SNS College", description:"Portable digital multimeter for basic voltage, resistance and continuity checks.", image:"https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900", createdAt:Date.now()-130000},
  {id:"p16", title:"USB Logic Analyzer", category:"Electronics", price:600, rentPrice:60, deposit:250, listingType:"both", condition:"Good", seller:"Sana", campus:"SNS College", description:"8-channel USB logic analyzer for learning digital signals and debugging I2C or SPI projects.", image:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=900", createdAt:Date.now()-120000},
  {id:"p17", title:"Class-D Audio Amplifier Module", category:"Electronics", price:260, rentPrice:30, deposit:100, listingType:"both", condition:"Like New", seller:"Kavin", campus:"SNS College", description:"Small audio amplifier board for speaker, tone-generator and microcontroller audio experiments.", image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900", createdAt:Date.now()-110000},
  {id:"p18", title:"Compact Wireless Keyboard", category:"Electronics", price:350, rentPrice:35, deposit:150, listingType:"both", condition:"Good", seller:"Tara", campus:"SNS College", description:"Pre-loved compact wireless keyboard for laptop and project-bench use. Confirm receiver compatibility with the seller.", image:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900", createdAt:Date.now()-100000},
  {id:"p19", title:"Engineering Scientific Calculator", category:"Electronics", price:540, rentPrice:45, deposit:250, listingType:"both", condition:"Good", seller:"Naveen", campus:"SNS College", description:"Multi-function scientific calculator for engineering maths and exam practice.", image:"https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=900", createdAt:Date.now()-90000},
  {id:"p20", title:"Black Formal Blazer - Size M", category:"Fashion", price:1250, rentPrice:180, deposit:700, listingType:"both", condition:"Like New", seller:"Keerthi", campus:"SNS College", description:"Clean black blazer for interviews, presentations, placements and formal campus events.", image:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900", createdAt:Date.now()-80000},
  {id:"p21", title:"Campus Sports Kit", category:"Sports", price:480, condition:"Good", seller:"Arun", campus:"SNS College", description:"Football, pump and training cones for a casual campus match.", image:"https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=900", createdAt:Date.now()-70000},
  {id:"p22", title:"USB-C Soldering Iron Set", category:"Lab Equipment", price:890, rentPrice:110, deposit:500, listingType:"both", condition:"Good", seller:"Farah", campus:"SNS College", description:"Temperature-controlled portable soldering iron, stand and basic tip set. Use with supervision.", image:"https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900", createdAt:Date.now()-60000},
  {id:"p23", title:"Student Audio Recording Setup", category:"Electronics", price:1850, rentPrice:150, deposit:800, listingType:"both", condition:"Good", seller:"Ria", campus:"SNS College", description:"Pre-loved student audio workstation for podcast, music and recording projects. Confirm the interface, microphone and cables included with the seller.", image:"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900", createdAt:Date.now()-50000},
  {id:"p24", title:"Hostel Shared Kitchen Starter Setup", category:"Hostel Essentials", price:1350, rentPrice:130, deposit:700, listingType:"both", condition:"Good", seller:"Siva", campus:"SNS College", description:"Pre-loved shared kitchen starter setup. Ask the student seller for the exact cookware and appliances included; check hostel rules before pickup.", image:"https://images.unsplash.com/photo-1556911220-bff31c812dba?w=900", createdAt:Date.now()-40000},
  {id:"p25", title:"DSLR Camera for Project Documentation", category:"College Essentials", price:4200, rentPrice:350, deposit:2000, listingType:"both", condition:"Good", seller:"Meera", campus:"SNS College", description:"Entry-level DSLR with kit lens and one battery for project documentation and events.", image:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900", createdAt:Date.now()-30000},
  {id:"p26", title:"Data Structures in C - Used Semester Text", category:"Books", price:220, condition:"Good", seller:"Nithin", campus:"SNS College", description:"Second-hand semester reference covering lists, trees, graphs and sorting. Original price ₹480; student resale at less than half.", image:"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900", createdAt:Date.now()-29000},
  {id:"p27", title:"Engineering Physics Lab Manual", category:"Books", price:95, condition:"Used", seller:"Pavithra", campus:"SNS College", description:"Used lab manual with clear experiment notes. Check your department's current syllabus before buying.", image:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=900", createdAt:Date.now()-28000},
  {id:"p28", title:"Digital Electronics Workbook", category:"Books", price:160, condition:"Good", seller:"Sanjay", campus:"SNS College", description:"Used practice workbook for logic gates, flip-flops, counters and Boolean algebra. Original price ₹360.", image:"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=900", createdAt:Date.now()-27000},
  {id:"p29", title:"Microcontroller and IoT Project Guide", category:"Books", price:190, condition:"Like New", seller:"Asha", campus:"SNS College", description:"Project-focused guide to sensors, microcontrollers and basic IoT prototypes. Original price ₹420.", image:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=900", createdAt:Date.now()-26000},
  {id:"p30", title:"A4 Lab Record Notebook - Unused Pages", category:"Stationery", price:45, condition:"Good", seller:"Siva", campus:"SNS College", description:"Part-used ruled lab record with most pages unused. Verify your department's record format first.", image:"https://images.unsplash.com/photo-1517842645767-c639042777db?w=900", createdAt:Date.now()-25000},
  {id:"p31", title:"Used Mechanical Drawing Textbook", category:"Books", price:140, condition:"Good", seller:"Meera", campus:"SNS College", description:"Used technical drawing reference with worked examples for engineering students. Check the syllabus before buying.", image:"https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900", createdAt:Date.now()-24000},
  {id:"p32", title:"Project Notes Notebook", category:"Stationery", price:110, condition:"Good", seller:"Tara", campus:"SNS College", description:"Pre-loved ruled notebook for project planning, review notes and demo checklists.", image:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900", createdAt:Date.now()-23000},
  {id:"p33", title:"Precision Electronics Screwdriver Kit", category:"Lab Equipment", price:390, rentPrice:45, deposit:200, listingType:"both", condition:"Like New", seller:"Joel", campus:"SNS College", description:"Small insulated driver set for low-voltage electronics assembly and project repair. Not for mains electrical work.", image:"https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=900", createdAt:Date.now()-22000},
  {id:"p34", title:"Low-Voltage Bench Power Supply", category:"Lab Equipment", price:1800, rentPrice:160, deposit:900, listingType:"both", condition:"Good", seller:"Kavin", campus:"SNS College", description:"Adjustable low-voltage DC bench supply for supervised student electronics work. Confirm lab safety rules before use.", image:"https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=900", createdAt:Date.now()-21000},
  {id:"p35", title:"PCB Practice and Soldering Kit", category:"Lab Equipment", price:320, rentPrice:35, deposit:150, listingType:"both", condition:"Good", seller:"Farah", campus:"SNS College", description:"Practice PCB, solder wire and basic component set for supervised soldering exercises. Soldering iron rented separately.", image:"https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900", createdAt:Date.now()-20000},
  {id:"p36", title:"Blue Formal Blazer - Size M", category:"Fashion", price:1250, rentPrice:180, deposit:700, listingType:"both", condition:"Like New", seller:"Keerthi", campus:"SNS College", description:"Pre-loved navy blue blazer for interviews, presentations, placements and formal campus events.", image:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900", createdAt:Date.now()-19000},
  {id:"p37", title:"White Formal Blazer - Size M", category:"Fashion", price:1100, rentPrice:170, deposit:650, listingType:"both", condition:"Good", seller:"Ria", campus:"SNS College", description:"Clean white formal blazer for department events, stage presentations and placements.", image:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900", createdAt:Date.now()-18000},
  {id:"p38", title:"Grey Formal Blazer - Size L", category:"Fashion", price:1200, rentPrice:175, deposit:680, listingType:"both", condition:"Good", seller:"Dev", campus:"SNS College", description:"Pre-loved grey blazer, size L. A reusable option for interviews and college functions.", image:"https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900", createdAt:Date.now()-17000},
  {id:"p39", title:"L298N Dual Motor Driver Board", category:"Electronics", price:190, rentPrice:25, deposit:100, listingType:"both", condition:"Good", seller:"Joel", campus:"SNS College", description:"Used dual H-bridge driver for low-voltage robotics projects. Check pin labels and wiring before use.", image:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=900", createdAt:Date.now()-16000},
  {id:"p40", title:"Low-Voltage Robotics Circuit Board", category:"Lab Equipment", price:280, rentPrice:35, deposit:120, listingType:"both", condition:"Good", seller:"Maya", campus:"SNS College", description:"Pre-loved electronics control board for a low-voltage student robotics prototype. Check the included connectors and compatible controller before pickup.", image:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=900", createdAt:Date.now()-15000},
  {id:"p41", title:"Raspberry Pi 4 Project Kit", category:"Electronics", price:4800, rentPrice:420, deposit:2200, listingType:"both", condition:"Good", seller:"Asha", campus:"SNS College", description:"Raspberry Pi board with power adapter, case and micro-HDMI cable. Storage card not included.", image:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=900", createdAt:Date.now()-14000},
  {id:"p43", title:"Insulated Electronics Toolkit", category:"Lab Equipment", price:640, rentPrice:70, deposit:350, listingType:"both", condition:"Like New", seller:"Farah", campus:"SNS College", description:"Project tool roll with insulated drivers, wire stripper, flush cutter and small pliers. For low-voltage work only.", image:"https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=900", createdAt:Date.now()-12000}
];

const seedImageById = {
  p1:"/images/products/books-engineering.jpg", p2:"/images/products/scientific-calculator.jpg", p3:"/images/products/stationery-drawing.jpg", p4:"/images/products/backpack.jpg", p5:"/images/products/study-lamp.jpg", p6:"/images/products/books-programming.jpg", p7:"/images/products/wireless-mouse.jpg", p8:"/images/products/lab-coat-candidate-1.jpg", p9:"/images/products/arduino-uno.jpg", p10:"/images/products/arduino-mega.jpg", p11:"/images/products/electronics-board.jpg", p12:"/images/products/breadboard.jpg", p13:"/images/products/breadboard.jpg", p14:"/images/products/robotics-kit.jpg", p15:"/images/products/digital-multimeter.jpg", p16:"/images/products/logic-analyzer.jpg", p17:"/images/products/electronics-board.jpg", p18:"/images/products/compact-keyboard.jpg", p19:"/images/products/scientific-calculator.jpg", p20:"/images/products/blazer-rack.jpg", p21:"/images/products/sports-football.jpg", p22:"/images/products/soldering-workbench.jpg", p23:"/images/products/audio-interface.jpg", p24:"/images/products/hostel-cooktop.jpg", p25:"/images/products/dslr-camera.jpg", p26:"/images/products/books-engineering.jpg", p27:"/images/products/books-programming.jpg", p28:"/images/products/books-engineering.jpg", p29:"/images/products/books-programming.jpg", p30:"/images/products/stationery-notebook.jpg", p31:"/images/products/books-engineering.jpg", p32:"/images/products/stationery-notebook.jpg", p33:"/images/products/precision-screwdrivers.jpg", p34:"/images/products/bench-power-supply.jpg", p35:"/images/products/soldering-workbench.jpg", p36:"/images/products/blazer-rack.jpg", p37:"/images/products/blazer-rack.jpg", p38:"/images/products/blazer-rack.jpg", p39:"/images/products/electronics-board.jpg", p40:"/images/products/electronics-board.jpg", p41:"/images/products/raspberry-pi-4.png", p43:"/images/products/precision-screwdrivers.jpg"
};
for (const product of starterProducts) product.image = seedImageById[product.id] || product.image;

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = { users: [], products: starterProducts, orders: [], rentals: [], notifications: [], sessions: {}, wanted: [], exchanges: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  try { return JSON.parse(fs.readFileSync(DB_FILE, "utf8")); }
  catch { return { users: [], products: starterProducts, orders: [], sessions: {}, wanted: [], exchanges: [] }; }
}
let db = loadDB();
db.users ||= [];
db.products ||= starterProducts;
db.orders ||= [];
db.sessions ||= {};
db.wanted ||= [];
db.exchanges ||= [];
db.rentals ||= [];
db.notifications ||= [];
for (const product of starterProducts) {
  const existing = db.products.find(item => item.id === product.id);
  if (!existing) db.products.push(product);
  else if (!existing.sellerId) { existing.image = product.image; existing.title = product.title; existing.description = product.description; }
}
db.products = db.products.filter(product => product.id !== "p42" || product.sellerId);
function save() { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }
save();
function send(res, status, data) {
  res.writeHead(status, { "Content-Type":"application/json; charset=utf-8", "X-Content-Type-Options":"nosniff", "Cache-Control":"no-store", "Access-Control-Allow-Headers":"Content-Type, Authorization", "Access-Control-Allow-Methods":"GET,POST,PUT,DELETE,PATCH,OPTIONS" });
  res.end(JSON.stringify(data));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => { raw += chunk; if (raw.length > 1e6) { reject(new Error("Request too large")); req.destroy(); } });
    req.on("end", () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error("Invalid JSON")); } });
    req.on("error", reject);
  });
}
function token() { return crypto.randomBytes(32).toString("hex"); }
function createSession(user) { const value = token(); db.sessions[value] = { userId:user.id, expiresAt:Date.now() + 14 * 24 * 60 * 60 * 1000 }; return value; }
function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}
function getUser(req) {
  const auth = req.headers.authorization || "";
  const t = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const session = db.sessions[t];
  if (!session) return null;
  if (typeof session === "object") {
    if (session.expiresAt < Date.now()) { delete db.sessions[t]; save(); return null; }
    return db.users.find(u => u.id === session.userId) || null;
  }
  return db.users.find(u => u.email === session) || null;
}
function safeUser(u) { return u ? { id:u.id, name:u.name, email:u.email, campus:u.campus, department:u.department || "", year:u.year || "", role:u.role || "student" } : null; }
function cleanProduct(p) {
  return { id:p.id, title:p.title, category:p.category, price:p.price, originalPrice:p.originalPrice || 0, rentPrice:p.rentPrice || 0, deposit:p.deposit || 0, listingType:p.listingType || "sale", condition:p.condition, seller:p.seller, sellerId:p.sellerId || "", campus:p.campus, description:p.description, image:p.image, createdAt:p.createdAt, popularity:p.popularity || 0 };
}
function addNotification(userId, type, title, message, referenceId) {
  if (!userId) return;
  db.notifications.unshift({ id:crypto.randomUUID(), userId, type, title, message, referenceId, read:false, createdAt:Date.now() });
}
const requestHits = new Map();
function rateLimited(req, key, limit, windowMs) {
  const now = Date.now(), ip = req.socket.remoteAddress || "local", id = `${ip}:${key}`;
  const hits = (requestHits.get(id) || []).filter(time => now - time < windowMs);
  hits.push(now); requestHits.set(id, hits);
  return hits.length > limit;
}
function validImage(value) { return !value || (/^https:\/\//i.test(value) && value.length <= 2048); }
const categories = ["Books", "Electronics", "Stationery", "Fashion", "Lab Equipment", "Hostel Essentials", "Sports", "College Essentials", "Other"];
const productPhotoFallbacks = { Books:"/images/products/books-engineering.jpg", Electronics:"/images/products/electronics-board.jpg", Stationery:"/images/products/stationery-notebook.jpg", Fashion:"/images/products/blazer-rack.jpg", "Lab Equipment":"/images/products/bench-power-supply.jpg", "Hostel Essentials":"/images/products/study-lamp.jpg", Sports:"/images/products/sports-football.jpg", "College Essentials":"/images/products/books-engineering.jpg", Other:"/images/products/electronics-board.jpg" };
for (const product of db.products) if (!product.image || product.image.includes("photo-1542291026-7eec264c27ff")) product.image = productPhotoFallbacks[product.category] || productPhotoFallbacks.Other;
save();
const mime = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"application/javascript; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".webp":"image/webp"};

async function handle(req, res) {
  if (req.method === "OPTIONS") return send(res, 204, {});
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const route = url.pathname;
  const user = getUser(req);

  if (route === "/api/health") return send(res, 200, { ok:true, app:"CampusLoop", time:new Date().toISOString() });

  if (route === "/api/register" && req.method === "POST") {
    if (rateLimited(req, "auth", 8, 15 * 60 * 1000)) return send(res, 429, { error:"Too many attempts. Please try again later." });
    const b = await readBody(req);
    const name = String(b.name || "").trim(), email = String(b.email || "").trim().toLowerCase(), password = String(b.password || ""), campus = String(b.campus || "SNS College").trim();
    if (!name || name.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 200 || campus.length > 120) return send(res, 400, { error:"Enter a valid name, email, campus and a password with at least 8 characters." });
    if (db.users.some(u => u.email === email)) return send(res, 409, { error:"An account with this email already exists." });
    const pw = hashPassword(password), u = { id:crypto.randomUUID(), name, email, campus, department:String(b.department || "").trim().slice(0,100), year:String(b.year || "").trim().slice(0,30), cart:[], wishlist:[], role:email === String(process.env.ADMIN_EMAIL || "").toLowerCase() ? "admin" : "student", ...pw, createdAt:Date.now() };
    db.users.push(u); const t = createSession(u); save();
    return send(res, 201, { token:t, user:safeUser(u) });
  }

  if (route === "/api/login" && req.method === "POST") {
    if (rateLimited(req, "auth", 8, 15 * 60 * 1000)) return send(res, 429, { error:"Too many attempts. Please try again later." });
    const b = await readBody(req), email = String(b.email || "").trim().toLowerCase(), password = String(b.password || "");
    const u = db.users.find(x => x.email === email);
    if (!u) return send(res, 401, { error:"Incorrect email or password." });
    const check = crypto.scryptSync(password, u.salt, 64).toString("hex");
    if (!crypto.timingSafeEqual(Buffer.from(check, "hex"), Buffer.from(u.hash, "hex"))) return send(res, 401, { error:"Incorrect email or password." });
    const t = createSession(u); save();
    return send(res, 200, { token:t, user:safeUser(u) });
  }

  if (route === "/api/me" && req.method === "GET") return send(res, 200, { user:safeUser(user) });
  if (route === "/api/me" && req.method === "PUT") {
    if (!user) return send(res, 401, { error:"Please log in to update your profile." });
    const b = await readBody(req), name = String(b.name || "").trim(), campus = String(b.campus || "").trim();
    if (!name || name.length > 80 || !campus || campus.length > 120) return send(res, 400, { error:"Enter a valid name and campus." });
    user.name = name; user.campus = campus; user.department = String(b.department || "").trim().slice(0,100); user.year = String(b.year || "").trim().slice(0,30); save();
    for (const product of db.products) if (product.sellerId === user.id) { product.seller = user.name; product.campus = user.campus; }
    save(); return send(res, 200, { user:safeUser(user) });
  }
  if (route === "/api/me/saved" && req.method === "GET") {
    if (!user) return send(res, 401, { error:"Please log in to view saved items." });
    return send(res, 200, { cart:user.cart || [], wishlist:user.wishlist || [] });
  }
  if (route === "/api/me/saved" && req.method === "PUT") {
    if (!user) return send(res, 401, { error:"Please log in to save items." });
    const b = await readBody(req), validIds = new Set(db.products.map(p => p.id));
    if (!Array.isArray(b.cart) || !Array.isArray(b.wishlist)) return send(res, 400, { error:"Cart and wishlist must be lists." });
    user.cart = b.cart.filter(x => validIds.has(x.id)).map(x => ({ id:x.id, qty:Math.max(1, Math.min(20, Number(x.qty) || 1)) }));
    user.wishlist = [...new Set(b.wishlist.filter(id => validIds.has(id)))]; save();
    return send(res, 200, { ok:true });
  }
  if (route === "/api/logout" && req.method === "POST") {
    const auth = req.headers.authorization || "", t = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    delete db.sessions[t]; save(); return send(res, 200, { ok:true });
  }

  if (route === "/api/products" && req.method === "GET") {
    let products = [...db.products];
    const q = (url.searchParams.get("q") || "").toLowerCase();
    const cat = url.searchParams.get("category") || "All";
    const condition = url.searchParams.get("condition") || "All";
    const sort = url.searchParams.get("sort") || "newest";
    const mode = url.searchParams.get("mode") || "buy";
    const min = Number(url.searchParams.get("min")), max = Number(url.searchParams.get("max"));
    if (q) products = products.filter(p => [p.title,p.description,p.category,p.seller].join(" ").toLowerCase().includes(q));
    if (cat !== "All") products = products.filter(p => p.category === cat);
    if (condition !== "All") products = products.filter(p => p.condition === condition);
    if (mode === "rent") products = products.filter(p => ["rent", "both"].includes(p.listingType || "sale") && p.rentPrice > 0);
    else if (mode === "buy") products = products.filter(p => ["sale", "both"].includes(p.listingType || "sale") && p.price > 0);
    const listingPrice = product => mode === "rent" ? product.rentPrice : product.price;
    if (Number.isFinite(min) && url.searchParams.has("min")) products = products.filter(p => listingPrice(p) >= min);
    if (Number.isFinite(max) && url.searchParams.has("max")) products = products.filter(p => listingPrice(p) <= max);
    if (sort === "low") products.sort((a,b)=>listingPrice(a)-listingPrice(b));
    else if (sort === "high") products.sort((a,b)=>listingPrice(b)-listingPrice(a));
    else if (sort === "popular") products.sort((a,b)=>(b.popularity||0)-(a.popularity||0));
    else products.sort((a,b)=>b.createdAt-a.createdAt);
    return send(res, 200, { products:products.map(cleanProduct) });
  }

  if (route === "/api/products" && req.method === "POST") {
    if (!user) return send(res, 401, { error:"Please log in to list an item." });
    const b = await readBody(req);
    const title = String(b.title || "").trim(), category = String(b.category || "Other"), price = Number(b.price), originalPrice = Number(b.originalPrice || 0), rentPrice = Number(b.rentPrice), deposit = Number(b.deposit || 0), listingType = String(b.listingType || "sale");
    const condition = String(b.condition || "Good");
    if (!title || title.length > 120 || !Number.isFinite(price) || price < (listingType === "rent" ? 0 : 1) || price > 10000000 || !Number.isFinite(originalPrice) || originalPrice < 0 || originalPrice > 10000000 || !["sale", "rent", "both"].includes(listingType) || (listingType !== "sale" && (!Number.isFinite(rentPrice) || rentPrice <= 0 || !Number.isFinite(deposit) || deposit < 0 || deposit > 10000000)) || !categories.includes(category) || !["Like New", "Good", "Used"].includes(condition) || !validImage(b.image) || String(b.description || "").length > 3000) return send(res, 400, { error:"Check the title, category, price, rental rate, deposit, condition, image URL and description." });
    const p = { id:crypto.randomUUID(), title, category, price, originalPrice, rentPrice:listingType === "sale" ? 0 : rentPrice, deposit:listingType === "sale" ? 0 : deposit, listingType, condition, seller:user.name, sellerId:user.id, campus:user.campus, description:String(b.description || "").trim(), image:String(b.image || productPhotoFallbacks[category] || productPhotoFallbacks.Other), createdAt:Date.now(), popularity:0 };
    db.products.unshift(p); save(); return send(res, 201, { product:cleanProduct(p) });
  }

  if (route.startsWith("/api/products/") && req.method === "GET") {
    const p = db.products.find(x => x.id === route.split("/")[3]);
    return p ? send(res, 200, { product:cleanProduct(p) }) : send(res, 404, { error:"Product not found." });
  }

  if (route === "/api/me/listings" && req.method === "GET") {
    if (!user) return send(res, 401, { error:"Please log in to view your listings." });
    return send(res, 200, { products:db.products.filter(p => p.sellerId === user.id).map(cleanProduct) });
  }
  if (route.startsWith("/api/products/") && ["PUT", "DELETE"].includes(req.method)) {
    if (!user) return send(res, 401, { error:"Please log in to manage listings." });
    const id = route.split("/")[3], product = db.products.find(p => p.id === id);
    if (!product) return send(res, 404, { error:"Product not found." });
    if (product.sellerId !== user.id && user.role !== "admin") return send(res, 403, { error:"You can only manage your own listings." });
    if (req.method === "DELETE") { db.products = db.products.filter(p => p.id !== id); for (const account of db.users) { account.cart = (account.cart || []).filter(x => x.id !== id); account.wishlist = (account.wishlist || []).filter(x => x !== id); } save(); return send(res, 200, { ok:true }); }
    const b = await readBody(req), price = Number(b.price), originalPrice = Number(b.originalPrice || 0), rentPrice = Number(b.rentPrice), deposit = Number(b.deposit || 0), listingType = String(b.listingType || "sale"), title = String(b.title || "").trim(), category = String(b.category || ""), condition = String(b.condition || "");
    if (!title || title.length > 120 || !Number.isFinite(price) || price < (listingType === "rent" ? 0 : 1) || price > 10000000 || !Number.isFinite(originalPrice) || originalPrice < 0 || originalPrice > 10000000 || !["sale", "rent", "both"].includes(listingType) || (listingType !== "sale" && (!Number.isFinite(rentPrice) || rentPrice <= 0 || !Number.isFinite(deposit) || deposit < 0 || deposit > 10000000)) || !categories.includes(category) || !["Like New", "Good", "Used"].includes(condition) || !validImage(b.image) || String(b.description || "").length > 3000) return send(res, 400, { error:"Check the listing details and try again." });
    Object.assign(product, { title, price, originalPrice, rentPrice:listingType === "sale" ? 0 : rentPrice, deposit:listingType === "sale" ? 0 : deposit, listingType, category, condition, description:String(b.description || "").trim(), image:String(b.image || product.image || productPhotoFallbacks[category] || productPhotoFallbacks.Other) }); save();
    return send(res, 200, { product:cleanProduct(product) });
  }

  if (route === "/api/notifications" && req.method === "GET") {
    if (!user) return send(res, 401, { error:"Please log in to view notifications." });
    const notifications = db.notifications.filter(item => item.userId === user.id);
    return send(res, 200, { notifications, unread:notifications.filter(item => !item.read).length });
  }
  if (route === "/api/notifications/read" && req.method === "POST") {
    if (!user) return send(res, 401, { error:"Please log in to update notifications." });
    for (const notification of db.notifications) if (notification.userId === user.id) notification.read = true;
    save(); return send(res, 200, { ok:true });
  }

  if (route === "/api/rentals" && req.method === "GET") {
    if (!user) return send(res, 401, { error:"Please log in to view rental requests." });
    return send(res, 200, { rentals:db.rentals.filter(rental => rental.renterId === user.id || rental.sellerId === user.id) });
  }
  if (route === "/api/rentals" && req.method === "POST") {
    if (!user) return send(res, 401, { error:"Please log in to request a rental." });
    const b = await readBody(req), product = db.products.find(item => item.id === b.productId);
    if (!product || !["rent", "both"].includes(product.listingType || "sale") || !(product.rentPrice > 0)) return send(res, 404, { error:"This product is not available to rent." });
    if (product.sellerId === user.id) return send(res, 400, { error:"You cannot rent your own listing." });
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(String(b.startDate)) || !datePattern.test(String(b.endDate))) return send(res, 400, { error:"Choose valid rental start and end dates." });
    const start = new Date(`${b.startDate}T00:00:00Z`), end = new Date(`${b.endDate}T00:00:00Z`), today = new Date();
    today.setUTCHours(0,0,0,0);
    const days = Math.round((end - start) / 86400000) + 1;
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start.toISOString().slice(0,10) !== b.startDate || end.toISOString().slice(0,10) !== b.endDate || start < today || days < 1 || days > 30) return send(res, 400, { error:"Choose valid dates from today for a rental of 1 to 30 days." });
    const pickup = String(b.pickup || "").trim();
    if (!pickup || pickup.length > 200) return send(res, 400, { error:"Enter a campus meetup or pickup point." });
    const paymentMethod = String(b.paymentMethod || "campus_handoff");
    if (!["campus_handoff", "demo_online"].includes(paymentMethod)) return send(res, 400, { error:"Choose one of the available demo payment options." });
    const fee = product.rentPrice * days, deposit = product.deposit || 0;
    const paymentMode = paymentMethod === "demo_online" ? "Online payment demo; no money collected" : "Campus handoff; arrange cash or UPI directly; no money collected here";
    const rental = { id:"CLR-"+crypto.randomUUID().slice(0,8).toUpperCase(), productId:product.id, productTitle:product.title, image:product.image, renterId:user.id, renterName:user.name, sellerId:product.sellerId || null, sellerName:product.seller, startDate:b.startDate, endDate:b.endDate, days, dailyRate:product.rentPrice, fee, deposit, total:fee+deposit, pickup, paymentMethod, paymentMode, status:product.sellerId ? "Requested" : "Approved (demo listing)", createdAt:Date.now() };
    db.rentals.unshift(rental);
    if (product.sellerId) addNotification(product.sellerId, "rental_request", "New rental request", `${user.name} requested ${product.title} for ${days} day(s).`, rental.id);
    else addNotification(user.id, "rental_approved", "Demo rental confirmed", `${product.title} is reserved in demo mode.`, rental.id);
    save(); return send(res, 201, { rental });
  }
  if (route.startsWith("/api/rentals/") && req.method === "PATCH") {
    if (!user) return send(res, 401, { error:"Please log in to update a rental request." });
    const rental = db.rentals.find(item => item.id === route.split("/")[3]);
    if (!rental) return send(res, 404, { error:"Rental request not found." });
    if (rental.sellerId !== user.id) return send(res, 403, { error:"Only the listing owner can respond to this rental." });
    const b = await readBody(req);
    if (!["Approved", "Declined"].includes(b.status) || rental.status !== "Requested") return send(res, 400, { error:"This rental request can no longer be updated." });
    if (b.status === "Approved") {
      const start = new Date(`${rental.startDate}T00:00:00Z`), end = new Date(`${rental.endDate}T00:00:00Z`);
      const overlaps = db.rentals.some(other => other.id !== rental.id && other.productId === rental.productId && ["Approved", "Approved (demo listing)"].includes(other.status) && new Date(`${other.startDate}T00:00:00Z`) <= end && new Date(`${other.endDate}T00:00:00Z`) >= start);
      if (overlaps) return send(res, 409, { error:"Those dates overlap an approved rental." });
    }
    rental.status = b.status; rental.updatedAt = Date.now();
    addNotification(rental.renterId, b.status === "Approved" ? "rental_approved" : "rental_declined", b.status === "Approved" ? "Rental approved" : "Rental declined", `${rental.sellerName} ${b.status.toLowerCase()} your request for ${rental.productTitle}.`, rental.id);
    save(); return send(res, 200, { rental });
  }

  if (route === "/api/orders" && req.method === "POST") {
    if (!user) return send(res, 401, { error:"Please log in before checkout." });
    const b = await readBody(req), items = Array.isArray(b.items) ? b.items : [];
    if (!items.length) return send(res, 400, { error:"Your cart is empty." });
    const orderItems = [];
    for (const item of items) {
      const p = db.products.find(x => x.id === item.id);
      const qty = Math.max(1, Math.min(20, Number(item.qty) || 1));
      if (!p) return send(res, 400, { error:"A product in your cart is no longer available." });
      if (p.sellerId === user.id) return send(res, 400, { error:"You cannot purchase your own listing." });
      if (p.listingType === "rent") return send(res, 400, { error:"This listing is rental-only. Submit a rental request instead." });
      orderItems.push({ id:p.id, title:p.title, price:p.price, qty, image:p.image, seller:p.seller });
    }
    const total = orderItems.reduce((s,x)=>s+x.price*x.qty,0);
    const address = String(b.address || "").trim();
    if (!address || address.length > 300) return send(res, 400, { error:"Enter a campus pickup or delivery note (up to 300 characters)." });
    const paymentMethod = String(b.paymentMethod || "campus_handoff");
    if (!["campus_handoff", "demo_online"].includes(paymentMethod)) return send(res, 400, { error:"Choose one of the available demo payment options." });
    const paymentMode = paymentMethod === "demo_online" ? "Online payment demo; no money collected" : "Campus handoff; arrange cash or UPI directly; no money collected here";
    const order = { id:"CL-"+crypto.randomUUID().slice(0,8).toUpperCase(), userId:user.id, customer:user.name, items:orderItems, subtotal:total, total, status:"Order placed", address, paymentMethod, paymentMode, createdAt:Date.now() };
    for (const item of orderItems) { const product = db.products.find(p => p.id === item.id); product.popularity = (product.popularity || 0) + item.qty; }
    db.orders.unshift(order); save(); return send(res, 201, { order });
  }

  if (route === "/api/orders" && req.method === "GET") {
    if (!user) return send(res, 401, { error:"Please log in to view orders." });
    return send(res, 200, { orders:db.orders.filter(o=>o.userId===user.id) });
  }

  if (route === "/api/wanted" && req.method === "GET") {
    const q = (url.searchParams.get("q") || "").toLowerCase(), maxBudget = Number(url.searchParams.get("maxBudget"));
    const posts = db.wanted.filter(post => (!q || `${post.title} ${post.details} ${post.campus}`.toLowerCase().includes(q)) && (!url.searchParams.has("maxBudget") || (post.budget || 0) <= maxBudget));
    return send(res, 200, { posts });
  }
  if (route === "/api/wanted" && req.method === "POST") {
    if (!user) return send(res, 401, { error:"Please log in to post a request." });
    const b = await readBody(req), title = String(b.title || "").trim();
    const budget = b.budget === "" || b.budget === undefined ? 0 : Number(b.budget);
    if (!title || title.length > 120 || !Number.isFinite(budget) || budget < 0 || budget > 10000000 || String(b.details || "").length > 1500) return send(res, 400, { error:"Check the request title, budget and details." });
    const post = { id:crypto.randomUUID(), title, details:String(b.details||"").trim(), budget, author:user.name, authorId:user.id, campus:user.campus, responses:[], createdAt:Date.now() };
    db.wanted.unshift(post); save(); return send(res, 201, { post });
  }
  if (route.startsWith("/api/wanted/") && route.endsWith("/responses") && req.method === "POST") {
    if (!user) return send(res, 401, { error:"Please log in to respond to a request." });
    const id = route.split("/")[3], post = db.wanted.find(item => item.id === id);
    if (!post) return send(res, 404, { error:"Wanted request not found." });
    if (post.authorId === user.id) return send(res, 400, { error:"You cannot respond to your own request." });
    const b = await readBody(req), product = db.products.find(item => item.id === b.productId && item.sellerId === user.id);
    if (!product) return send(res, 400, { error:"Choose one of your active listings." });
    if (post.budget > 0 && product.price > post.budget) return send(res, 400, { error:"Your listing is above the request budget." });
    if (!Array.isArray(post.responses)) post.responses = [];
    if (post.responses.some(response => response.userId === user.id)) return send(res, 409, { error:"You have already responded to this request." });
    const response = { id:crypto.randomUUID(), userId:user.id, name:user.name, productId:product.id, productTitle:product.title, price:product.price, createdAt:Date.now() };
    post.responses.push(response); save(); return send(res, 201, { response });
  }

  if (route === "/api/exchanges" && req.method === "GET") {
    if (!user) return send(res, 401, { error:"Please log in to view exchanges." });
    return send(res, 200, { exchanges:db.exchanges.filter(x => x.fromUserId === user.id || x.toUserId === user.id) });
  }
  if (route === "/api/exchanges" && req.method === "POST") {
    if (!user) return send(res, 401, { error:"Please log in to request an exchange." });
    const b = await readBody(req), offered = db.products.find(p => p.id === b.offeredId), wanted = db.products.find(p => p.id === b.wantedId);
    if (!offered || !wanted || offered.sellerId !== user.id || wanted.sellerId === user.id || offered.id === wanted.id) return send(res, 400, { error:"Choose one of your listings and another student's listing." });
    const exchange = { id:crypto.randomUUID(), fromUserId:user.id, fromName:user.name, toUserId:wanted.sellerId, toName:wanted.seller, offeredId:offered.id, offeredTitle:offered.title, wantedId:wanted.id, wantedTitle:wanted.title, status:"Pending", createdAt:Date.now() };
    db.exchanges.unshift(exchange); save(); return send(res, 201, { exchange });
  }
  if (route.startsWith("/api/exchanges/") && req.method === "PATCH") {
    if (!user) return send(res, 401, { error:"Please log in to respond to an exchange." });
    const exchange = db.exchanges.find(x => x.id === route.split("/")[3]);
    if (!exchange) return send(res, 404, { error:"Exchange request not found." });
    if (exchange.toUserId !== user.id) return send(res, 403, { error:"Only the listing owner can respond." });
    const b = await readBody(req);
    if (!["Accepted", "Rejected"].includes(b.status) || exchange.status !== "Pending") return send(res, 400, { error:"This exchange can no longer be updated." });
    exchange.status = b.status; exchange.updatedAt = Date.now(); save(); return send(res, 200, { exchange });
  }

  if (route === "/api/admin" && req.method === "GET") {
    if (!user || user.role !== "admin") return send(res, 403, { error:"Administrator access required." });
    return send(res, 200, { users:db.users.map(safeUser), products:db.products.map(cleanProduct), orders:db.orders, categories, stats:{ users:db.users.length, products:db.products.length, orders:db.orders.length, wanted:db.wanted.length, exchanges:db.exchanges.length } });
  }
  if (route.startsWith("/api/admin/products/") && req.method === "DELETE") {
    if (!user || user.role !== "admin") return send(res, 403, { error:"Administrator access required." });
    const id = route.split("/")[4]; db.products = db.products.filter(p => p.id !== id); save(); return send(res, 200, { ok:true });
  }

  if (route === "/api/ai" && req.method === "POST") {
    if (rateLimited(req, "ai", 20, 60 * 1000)) return send(res, 429, { error:"Please wait a moment before asking again." });
    const b = await readBody(req), question = String(b.message || "").toLowerCase().replace(/audirono|ardunio/g, "arduino").replace(/bread\s+board/g, "breadboard");
    if (!question.trim() || question.length > 500) return send(res, 400, { error:"Ask a question up to 500 characters." });
    const products = db.products;
    let picks = [];
    const terms = question.split(/[^a-z0-9]+/).filter(w=>w.length>2);
    picks = products.map(p=>({p, score:terms.reduce((n,t)=>n+([p.title,p.category,p.description].join(" ").toLowerCase().includes(t)?1:0),0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,3).map(x=>cleanProduct(x.p));
    if (!picks.length) {
      const budget = question.match(/(?:under|below|within|less than)\s*₹?\s*(\d+)/);
      if (budget) picks = products.filter(p=>p.price<=Number(budget[1])).sort((a,b)=>a.price-b.price).slice(0,3).map(cleanProduct);
    }
    let reply = picks.length
      ? "These current listings look like the closest matches. Compare their condition and arrange a campus meetup with the seller."
      : "I couldn't match that to a current listing. Try an item, category, or budget, such as 'calculator under 500'.";
    let mode = "local smart matching";
    if (process.env.GEMINI_API_KEY && picks.length) {
      try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", { method:"POST", headers:{"Content-Type":"application/json", "x-goog-api-key":process.env.GEMINI_API_KEY}, body:JSON.stringify({ contents:[{parts:[{text:`Rank the best matching listings for the student's request. Return only a JSON array of listing IDs, no prose. Use only IDs in the provided list. Request: ${String(b.message).slice(0,500)}\nListings: ${JSON.stringify(picks.map(p => ({id:p.id,title:p.title,price:p.price,category:p.category,condition:p.condition})))}`}]}], generationConfig:{temperature:0, maxOutputTokens:100, responseMimeType:"application/json"} }), signal:AbortSignal.timeout(8000) });
        if (response.ok) {
          const result = await response.json(), text = result.candidates?.[0]?.content?.parts?.map(part => part.text).join("").trim();
          const rankedIds = JSON.parse(text), matches = new Map(picks.map(product => [product.id, product]));
          if (Array.isArray(rankedIds)) { picks = [...new Set(rankedIds)].filter(id => matches.has(id)).map(id => matches.get(id)).concat(picks.filter(product => !rankedIds.includes(product.id))); mode = "Gemini-ranked catalog matches"; }
        }
      } catch { mode = "local smart matching fallback"; }
    }
    return send(res, 200, { reply, products:picks, mode });
  }

  // Serve the single-page frontend.
  let file = route === "/" ? "index.html" : decodeURIComponent(route.slice(1));
  let target = path.normalize(path.join(PUBLIC_DIR, file));
  if (!target.startsWith(PUBLIC_DIR)) return send(res, 403, { error:"Forbidden" });
  if (!fs.existsSync(target) || fs.statSync(target).isDirectory()) target = path.join(PUBLIC_DIR, "index.html");
  const ext = path.extname(target);
  res.writeHead(200, { "Content-Type":mime[ext] || "application/octet-stream", "Cache-Control":"no-cache" });
  fs.createReadStream(target).pipe(res);
}

http.createServer((req,res)=>handle(req,res).catch(err=>send(res,500,{error:err.message || "Server error"}))).listen(PORT, ()=> {
  console.log(`CampusLoop running at http://localhost:${PORT}`);
  console.log("Data is stored locally in ./data/db.json");
});
