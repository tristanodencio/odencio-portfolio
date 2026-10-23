/* =========================================================
   Tristan Odencio — Portfolio · script.js
   ========================================================= */
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const MY_EMAIL = "tristanodencio@gmail.com";
const canHover = matchMedia("(hover: hover)").matches;

/* ---------- Typing effect ---------- */
const phrases = ["web systems.", "UI designs in Figma.", "Django apps.", "browser games.", "short films."];
(function typeLoop() {
  const el = $("#typed");
  let p = 0, i = 0, deleting = false;
  (function tick() {
    const word = phrases[p];
    el.textContent = word.slice(0, i);
    if (!deleting && i < word.length) i++;
    else if (deleting && i > 0) i--;
    else if (!deleting) { deleting = true; return setTimeout(tick, 1500); }
    else { deleting = false; p = (p + 1) % phrases.length; }
    setTimeout(tick, deleting ? 40 : 80);
  })();
})();

/* ---------- Theme (light blue by default) ---------- */
const root = document.documentElement;
const themeMeta = $('meta[name="theme-color"]');
function applyTheme(t) {
  root.dataset.theme = t;
  themeMeta.content = t === "dark" ? "#08203f" : "#e3efff";
}
try { const saved = localStorage.getItem("theme"); if (saved) applyTheme(saved); } catch (e) {}
$("#themeToggle").addEventListener("click", () => {
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
  try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
});

/* ---------- Dynamic Island notification ---------- */
let islandTimer;
function island(msg) {
  const el = $("#island");
  $("#islandText").textContent = msg;
  el.classList.add("show");
  clearTimeout(islandTimer);
  islandTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

/* ---------- Live clock in Cebu (Asia/Manila) ---------- */
function tickClock() {
  const now = new Date();
  const time = now.toLocaleTimeString("en-US", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" });
  const day = now.toLocaleDateString("en-US", { timeZone: "Asia/Manila", weekday: "long" });
  const hour = +now.toLocaleString("en-US", { timeZone: "Asia/Manila", hour: "numeric", hour12: false });
  const part = hour < 5 ? "night" : hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  $("#clock").textContent = time;
  $("#clockSub").textContent = `${day} ${part} in Cebu`;
}
tickClock();
setInterval(tickClock, 15000);

/* ---------- Scroll: progress, nav state, active section ---------- */
const navWrap = $(".nav-wrap"), toTop = $("#toTop"), progress = $("#progress");
const sections = $$("main section[id]");
const navItems = $$("[data-sec]");
function onScroll() {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  navWrap.classList.toggle("scrolled", y > 20);
  toTop.classList.toggle("show", y > 600);
  let current = sections[0].id;
  sections.forEach(s => { if (y + 160 >= s.offsetTop) current = s.id; });
  if (y >= max - 4) current = sections[sections.length - 1].id;
  navItems.forEach(a => a.classList.toggle("active", a.dataset.sec === current));
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

/* ---------- Desktop: cursor glow, card spotlight, photo tilt ---------- */
if (canHover) {
  const glow = $("#cursorGlow");
  addEventListener("pointermove", e => { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; }, { passive: true });
  $$(".spot").forEach(card => card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  }));
  const tilt = $("[data-tilt]");
  tilt.addEventListener("pointermove", e => {
    const r = tilt.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    tilt.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  tilt.addEventListener("pointerleave", () => (tilt.style.transform = ""));
}

/* ---------- Activity rings (built from the legend levels) ---------- */
const RING_COLORS = ["#0a6cff", "#4ba3ff", "#93c7ff"];
$$("[data-rings]").forEach(box => {
  const svg = $("svg", box);
  const levels = $$(".legend li", box.parentElement).map(li => +li.dataset.level);
  levels.forEach((lvl, i) => {
    const r = 52 - i * 15, c = 2 * Math.PI * r;
    svg.insertAdjacentHTML("beforeend",
      `<circle class="track" cx="60" cy="60" r="${r}" stroke-width="11"/>` +
      `<circle class="arc" cx="60" cy="60" r="${r}" stroke-width="11" stroke="${RING_COLORS[i]}"
         stroke-dasharray="${c}" stroke-dashoffset="${c}" data-target="${c * (1 - lvl / 100)}"/>`);
  });
});

/* ---------- Reveal on scroll + rings + counters ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    el.classList.add("in");
    $$(".arc", el).forEach(a => setTimeout(() => (a.style.strokeDashoffset = a.dataset.target), 200));
    const num = $(".num", el);
    if (num && !num.dataset.done) {
      num.dataset.done = 1;
      const target = +num.dataset.count, start = performance.now();
      (function step(t) {
        const k = Math.min((t - start) / 1200, 1);
        num.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      })(start);
    }
    io.unobserve(el);
  });
}, { threshold: 0.12 });
$$(".reveal").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(el); });

/* ---------- Swipe dots for the project carousel (phones) ---------- */
const row = $("#projectsRow"), dots = $("#swipeDots");
function buildDots() {
  const cards = $$(".project:not(.hide)", row);
  dots.innerHTML = cards.map(() => "<i></i>").join("");
  dots.hidden = cards.length < 2;
  updateDots();
}
function updateDots() {
  const cards = $$(".project:not(.hide)", row);
  if (!cards.length) return;
  const mid = row.scrollLeft + row.clientWidth / 2;
  let best = 0, bestD = Infinity;
  cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bestD) { bestD = d; best = i; } });
  $$("i", dots).forEach((d, i) => d.classList.toggle("on", i === best));
}
row.addEventListener("scroll", () => requestAnimationFrame(updateDots), { passive: true });
addEventListener("resize", updateDots);
buildDots();

/* ---------- Project filter ---------- */
$$(".chip").forEach(chip => chip.addEventListener("click", () => {
  $$(".chip").forEach(c => c.classList.toggle("active", c === chip));
  const f = chip.dataset.filter;
  let shownInRow = 0;
  $$(".project").forEach(p => {
    const show = f === "all" || p.dataset.cat.split(" ").includes(f);
    p.classList.toggle("hide", !show);
    if (show) { p.classList.add("in"); if (p.parentElement === row) shownInRow++; }
  });
  $("#emptyMsg").hidden = shownInRow > 0 || !$("#reksolva").classList.contains("hide");
  row.scrollTo({ left: 0 });
  buildDots();
}));

/* ---------- Project modal / bottom sheet ---------- */
const modal = $("#modal"), sheet = $(".modal-card", modal);
let lastFocus;
function openModal(card) {
  const d = card.dataset;
  $("#mTitle").textContent = d.title;
  $("#mDesc").textContent = d.desc;
  $("#mRole").textContent = d.role;
  $("#mStack").textContent = d.stack;
  $("#mImg").src = d.img;
  $("#mImg").alt = d.title + " screenshot";
  const st = $("#mStatus");
  st.hidden = !d.status;
  $("span:last-child", st).textContent = d.status || "";
  const actions = $("#mActions");
  actions.innerHTML = "";
  for (let i = 1; d["l" + i]; i++) {
    const a = document.createElement("a");
    a.href = d["l" + i];
    a.textContent = (d["l" + i + "Label"] || "Open link") + " ↗";
    a.target = "_blank"; a.rel = "noopener";
    a.className = "btn " + (i === 1 ? "btn-primary" : "btn-glass");
    actions.appendChild(a);
  }
  actions.hidden = !actions.children.length;
  lastFocus = document.activeElement;
  sheet.scrollTop = 0;
  sheet.style.transform = "";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $(".modal-close", modal).focus({ preventScroll: true });
}
function closeModal() {
  if (!modal.classList.contains("open")) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  sheet.style.transform = "";
  lastFocus && lastFocus.focus({ preventScroll: true });
}
$$(".open-modal").forEach(b => b.addEventListener("click", () => openModal(b.closest(".project"))));
$$(".project .thumb").forEach(t => t.addEventListener("click", () => openModal(t.closest(".project"))));
$$("[data-close]", modal).forEach(el => el.addEventListener("click", closeModal));
addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* Swipe the sheet down to close (phones) */
let startY = null;
sheet.addEventListener("touchstart", e => { if (sheet.scrollTop <= 0) startY = e.touches[0].clientY; }, { passive: true });
sheet.addEventListener("touchmove", e => {
  if (startY === null) return;
  const dy = e.touches[0].clientY - startY;
  if (dy > 0) { sheet.style.transition = "none"; sheet.style.transform = `translateY(${dy}px)`; }
}, { passive: true });
sheet.addEventListener("touchend", e => {
  if (startY === null) return;
  const dy = e.changedTouches[0].clientY - startY;
  sheet.style.transition = "";
  startY = null;
  if (dy > 120) closeModal(); else sheet.style.transform = "";
});

/* "Currently building" tile: jump to Reksolva and open it */
$("[data-open]").addEventListener("click", e => {
  const card = document.getElementById(e.currentTarget.dataset.open);
  $(".chip[data-filter='all']").click();
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => openModal(card), 700);
});

/* ---------- Copy email ---------- */
$("#copyEmail").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(MY_EMAIL);
    island("Email copied");
  } catch {
    const r = document.createRange();
    r.selectNodeContents($("#emailText"));
    getSelection().removeAllRanges(); getSelection().addRange(r);
    island("Email selected — tap Copy");
  }
});

/* ---------- Contact form → opens email app (mailto) ---------- */
const form = $("#contactForm");
const rules = {
  name: v => v.trim().length >= 2 || "Please enter your name.",
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Please enter a valid email.",
  message: v => v.trim().length >= 10 || "Message should be at least 10 characters."
};
function validate(field) {
  const res = rules[field.name](field.value);
  const wrap = field.closest(".field");
  wrap.classList.toggle("invalid", res !== true);
  $(".err", wrap).textContent = res === true ? "" : res;
  return res === true;
}
$$("input, textarea", form).forEach(f => f.addEventListener("input", () => f.closest(".field").classList.contains("invalid") && validate(f)));
form.addEventListener("submit", e => {
  e.preventDefault();
  const ok = $$("input, textarea", form).map(validate).every(Boolean);
  if (!ok) { island("Please check the form"); return; }
  const { name, email, message } = Object.fromEntries(new FormData(form));
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  location.href = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`;
  island("Opening your email app…");
  form.reset();
});

/* ---------- Footer year ---------- */
$("#year").textContent = new Date().getFullYear();
