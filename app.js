// ================== ESTADO ==================
const STORE_KEY = "englishCoach";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch { return {}; }
}

let state = Object.assign({
  streak: 0, lastDay: null, xp: 0, todayCount: 0, todayDate: todayStr(),
  theme: "dark", learned: {}, apiKey: "", chat: []
}, loadState());

if (state.todayDate !== todayStr()) {
  state.todayCount = 0;
  state.todayDate = todayStr();
}

function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

function registerPractice(points) {
  const today = todayStr();
  if (state.lastDay !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    state.streak = (state.lastDay === yesterday) ? state.streak + 1 : 1;
    state.lastDay = today;
  }
  state.xp += points;
  state.todayCount += 1;
  save();
  renderStats();
  if (state.todayCount === 10) toast("🎉 ¡Meta diaria cumplida! Racha: " + state.streak + " días");
}

function renderStats() {
  document.getElementById("streak").textContent = state.streak;
  document.getElementById("xp").textContent = state.xp;
  document.getElementById("goalLabel").textContent = Math.min(10, state.todayCount) + "/10";
  const segs = document.getElementById("goalSegs");
  segs.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const s = document.createElement("span");
    if (i < state.todayCount) s.classList.add("on");
    segs.appendChild(s);
  }
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3000);
}

// ================== TEMA ==================
function applyTheme() {
  document.body.dataset.theme = state.theme;
  document.getElementById("themeLabel").textContent = state.theme === "dark" ? "Modo claro" : "Modo oscuro";
}
document.getElementById("themeBtn").addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  save();
  applyTheme();
});

// ================== NAVEGACIÓN ==================
const TAB_TITLES = {
  tutor: ["Tutor IA", "Practica conversando con Alex, tu tutor"],
  hablar: ["Hablar", "Lee en voz alta y mejora tu pronunciación"],
  shadowing: ["Shadowing", "Escucha y repite frases reales"],
  frases: ["Frases", "Aprende expresiones útiles por tema"]
};

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    const tab = btn.dataset.tab;
    document.getElementById(tab).classList.add("active");
    document.getElementById("tabTitle").textContent = TAB_TITLES[tab][0];
    document.getElementById("tabSubtitle").textContent = TAB_TITLES[tab][1];
  });
});

// ================== VOZ: texto a voz ==================
let enVoice = null;
function pickVoice() {
  const voices = speechSynthesis.getVoices();
  enVoice = voices.find(v => v.lang === "en-US" && v.name.includes("Natural"))
    || voices.find(v => v.lang === "en-US")
    || voices.find(v => v.lang.startsWith("en"));
}
speechSynthesis.onvoiceschanged = pickVoice;
pickVoice();

function speak(text, rate = 0.95, onend = null) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  if (enVoice) u.voice = enVoice;
  u.rate = rate;
  if (onend) u.onend = onend;
  speechSynthesis.speak(u);
}

// ================== VOZ: reconocimiento ==================
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let activeRec = null;

function listen(button, onResult, hintEl = null) {
  if (!SR) {
    toast("Tu navegador no soporta micrófono. Usa Google Chrome.");
    return;
  }
  if (activeRec) { activeRec.abort(); activeRec = null; }
  const rec = new SR();
  activeRec = rec;
  rec.lang = "en-US";
  rec.interimResults = false;
  rec.maxAlternatives = 3;
  button.classList.add("recording");
  if (hintEl) hintEl.textContent = "Grabando… habla ya (toca para detener)";

  const done = () => {
    button.classList.remove("recording");
    if (activeRec === rec) activeRec = null;
  };
  rec.onresult = (e) => {
    done();
    const alternatives = Array.from(e.results[0]).map(a => a.transcript);
    onResult(alternatives);
  };
  rec.onerror = (e) => {
    done();
    if (hintEl) hintEl.textContent = "Toca el micrófono y lee la frase";
    if (e.error === "no-speech") toast("No te escuché 🙉 Intenta de nuevo, más cerca del micrófono.");
    else if (e.error === "not-allowed") toast("Permite el micrófono en Chrome (candado junto a la URL).");
    else if (e.error !== "aborted") toast("Error de micrófono: " + e.error);
  };
  rec.onend = done;
  rec.start();
}

// ================== COMPARADOR DE PRONUNCIACIÓN ==================
function normalize(text) {
  return text.toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9' ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  return d[m][n];
}

function wordsMatch(a, b) {
  if (a === b) return true;
  const dist = levenshtein(a, b);
  return dist / Math.max(a.length, b.length) <= 0.34;
}

function scoreAttempt(target, alternatives) {
  const targetWords = normalize(target).split(" ");
  let best = { matched: [], score: 0, heard: alternatives[0] || "" };

  for (const alt of alternatives) {
    const heardWords = normalize(alt).split(" ");
    const matched = targetWords.map(() => false);
    let h = 0;
    for (let t = 0; t < targetWords.length; t++) {
      for (let k = h; k < Math.min(heardWords.length, h + 3); k++) {
        if (wordsMatch(targetWords[t], heardWords[k])) {
          matched[t] = true;
          h = k + 1;
          break;
        }
      }
    }
    const score = Math.round(matched.filter(Boolean).length / targetWords.length * 100);
    if (score > best.score || best.matched.length === 0) {
      best = { matched, score, heard: alt };
    }
  }
  return { ...best, targetWords: target.replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim().split(" ") };
}

function scoreMessage(score) {
  if (score >= 90) return "¡Excelente! Suenas genial.";
  if (score >= 70) return "¡Muy bien!";
  if (score >= 40) return "Buen intento, repite las palabras rojas.";
  return "Tranquilo, equivocarse es aprender.";
}

// ================== MODO HABLAR ==================
const SESSION_SIZE = 5;
let hSession = [], hPos = 0;

function shuffleSession() {
  const idxs = PHRASES.map((_, i) => i);
  for (let i = idxs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
  }
  hSession = idxs.slice(0, SESSION_SIZE);
  hPos = 0;
}

function currentPhrase() { return PHRASES[hSession[hPos]]; }

function renderHablar() {
  const p = currentPhrase();
  document.getElementById("hEn").textContent = p.en;
  document.getElementById("hEs").textContent = p.es;
  document.getElementById("hScore").style.display = "none";
  document.getElementById("hHint").textContent = "Toca el micrófono y lee la frase";
  const dots = document.getElementById("hDots");
  dots.innerHTML = "";
  for (let i = 0; i < SESSION_SIZE; i++) {
    const d = document.createElement("span");
    if (i === hPos) d.classList.add("on");
    dots.appendChild(d);
  }
}

function nextHablar() {
  hPos++;
  if (hPos >= SESSION_SIZE) shuffleSession();
  renderHablar();
}

document.getElementById("hListen").addEventListener("click", () => speak(currentPhrase().en));
document.getElementById("hListenSlow").addEventListener("click", () => speak(currentPhrase().en, 0.55));
document.getElementById("hNext").addEventListener("click", nextHablar);

document.getElementById("hMic").addEventListener("click", function () {
  if (this.classList.contains("recording")) {
    if (activeRec) activeRec.stop();
    return;
  }
  const hint = document.getElementById("hHint");
  listen(this, (alts) => {
    const result = scoreAttempt(currentPhrase().en, alts);
    const points = result.score >= 80 ? 8 : 4;
    const numEl = document.getElementById("scoreOverall");
    numEl.textContent = result.score;
    numEl.parentElement.classList.toggle("low", result.score < 70);
    document.getElementById("scoreTitle").textContent = scoreMessage(result.score);
    document.getElementById("scoreSub").textContent = "+" + points + " XP · te escuché: “" + result.heard + "”";
    const wordsEl = document.getElementById("scoreWords");
    wordsEl.innerHTML = "";
    result.targetWords.forEach((w, i) => {
      const s = document.createElement("span");
      s.textContent = w;
      if (!result.matched[i]) s.classList.add("bad");
      wordsEl.appendChild(s);
    });
    document.getElementById("hScore").style.display = "";
    hint.textContent = "Toca el micrófono para intentar de nuevo";
    registerPractice(points);
  }, hint);
});

// ================== SHADOWING ==================
const EQ_HEIGHTS = [8,15,22,12,18,26,14,9,20,24,11,16,23,13,19,10,25,15,21,12,17,9,22,14];
let playingClip = null;

function estimateDur(text) {
  const secs = Math.max(6, Math.round(text.split(" ").length * 0.45));
  return "0:" + String(secs).padStart(2, "0");
}

function renderClips() {
  const list = document.getElementById("clipList");
  list.innerHTML = "";
  CLIPS.forEach(clip => {
    const card = document.createElement("div");
    card.className = "clip";
    card.id = "clip-" + clip.id;
    card.innerHTML = `
      <div class="clip-top">
        <button class="play-btn" title="Escuchar">
          <svg class="ico-play" width="19" height="19" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M7 5l12 7-12 7V5z"/></svg>
          <svg class="ico-pause" width="19" height="19" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1.4"/><rect x="14" y="5" width="4" height="14" rx="1.4"/></svg>
        </button>
        <div class="clip-info">
          <div class="clip-meta">
            <span class="clip-title">${clip.title}</span>
            <span class="clip-level">${clip.level}</span>
            <span class="clip-dur">${estimateDur(clip.text)}</span>
          </div>
          <div class="eq">${EQ_HEIGHTS.map(h => `<div style="height:${h}px"></div>`).join("")}</div>
        </div>
        <button class="clip-mic" title="Repetir con tu voz">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" y1="18" x2="12" y2="22"/></svg>
        </button>
      </div>
      <div class="clip-text">${clip.text}</div>
      <div class="clip-result"></div>`;

    card.querySelector(".play-btn").addEventListener("click", () => togglePlay(clip, card));
    card.querySelector(".clip-mic").addEventListener("click", function () {
      if (this.classList.contains("recording")) {
        if (activeRec) activeRec.stop();
        return;
      }
      listen(this, (alts) => {
        const result = scoreAttempt(clip.text.replace(/—/g, " "), alts);
        const box = card.querySelector(".clip-result");
        box.innerHTML = `<span class="r-score${result.score < 70 ? " low" : ""}">${result.score}%</span>` +
          result.targetWords.map((w, i) => `<span class="w${result.matched[i] ? "" : " bad"}">${w}</span>`).join("");
        box.classList.add("show");
        registerPractice(result.score >= 80 ? 8 : 4);
      });
    });
    list.appendChild(card);
  });
}

function togglePlay(clip, card) {
  if (playingClip === clip.id) {
    playingClip = null;
    speechSynthesis.cancel();
    card.classList.remove("playing");
    return;
  }
  document.querySelectorAll(".clip.playing").forEach(c => c.classList.remove("playing"));
  playingClip = clip.id;
  card.classList.add("playing");
  speak(clip.text.replace(/—/g, ","), 0.9, () => {
    if (playingClip === clip.id) {
      playingClip = null;
      card.classList.remove("playing");
    }
  });
}

// ================== FRASES ==================
const CATS = [...new Set(PHRASES.map(p => p.cat))];
let activeCat = 0;

function renderCatChips() {
  const box = document.getElementById("catChips");
  box.innerHTML = "";
  CATS.forEach((c, i) => {
    const b = document.createElement("button");
    b.className = "cat-chip" + (i === activeCat ? " active" : "");
    b.textContent = c;
    b.addEventListener("click", () => { activeCat = i; renderCatChips(); renderPhraseGrid(); });
    box.appendChild(b);
  });
}

function renderLearnedCount() {
  document.getElementById("learnedCount").textContent =
    Object.values(state.learned).filter(Boolean).length;
}

function renderPhraseGrid() {
  const grid = document.getElementById("phraseGrid");
  grid.innerHTML = "";
  const cat = CATS[activeCat];
  PHRASES.forEach((p, i) => {
    if (p.cat !== cat) return;
    const id = "p" + i;
    const learned = !!state.learned[id];
    const card = document.createElement("div");
    card.className = "p-card";
    card.innerHTML = `
      <div class="p-top">
        <button class="p-en" title="Escuchar">${p.en}</button>
        <button class="star-btn${learned ? " learned" : ""}" title="Marcar como aprendida">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2l2.9 6.3 6.9.6-5.2 4.5 1.6 6.7L12 17l-6.2 3.6 1.6-6.7L2.2 9.9l6.9-.6L12 2z"/></svg>
        </button>
      </div>
      <button class="p-reveal">
        <span class="hint"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>Toca para ver traducción</span>
      </button>`;

    card.querySelector(".p-en").addEventListener("click", () => speak(p.en));
    const reveal = card.querySelector(".p-reveal");
    reveal.addEventListener("click", () => {
      reveal.innerHTML = reveal.querySelector(".es")
        ? `<span class="hint"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>Toca para ver traducción</span>`
        : `<span class="es">${p.es}</span>`;
    });
    card.querySelector(".star-btn").addEventListener("click", function () {
      const now = !state.learned[id];
      state.learned[id] = now;
      this.classList.toggle("learned", now);
      if (now) {
        registerPractice(5);
        if (!reveal.querySelector(".es")) reveal.innerHTML = `<span class="es">${p.es}</span>`;
      } else {
        save();
      }
      renderLearnedCount();
    });
    grid.appendChild(card);
  });
}

// ================== TUTOR IA ==================
const SYSTEM_PROMPT = `You are Alex, a warm and patient English tutor for a Spanish-speaking beginner from Colombia. Rules:
1. Reply in SIMPLE English (A1-A2 level): short sentences, common words.
2. If the student makes a mistake, gently show the correction like this: ✏️ "correct sentence" — then a very short explanation in Spanish (one line max).
3. If they write in Spanish, answer their question briefly, give them the English version of what they wanted to say, and encourage them to repeat it.
4. Always end with ONE simple follow-up question to keep the conversation going.
5. Be encouraging like a friend, never like a strict teacher. Keep replies under 60 words.
6. Talk about their real life: their day, work, projects, food, family, plans.`;

const SUGGESTIONS = [
  "Hello! I want to practice English.",
  "How are you today?",
  "I want to talk about my day.",
  "Can you teach me new phrases?",
  "¿Cómo digo esto en inglés?"
];

let readAloud = true;

function apiKey() {
  return state.apiKey || window.DEFAULT_API_KEY || "";
}

function showTutor() {
  const hasKey = !!apiKey();
  document.getElementById("tutorSetup").style.display = hasKey ? "none" : "";
  document.getElementById("tutorChat").style.display = hasKey ? "" : "none";
  if (!hasKey) return;
  document.getElementById("chatBox").innerHTML = "";
  if (state.chat.length === 0) {
    addMsg("bot", "Hi! I'm Alex, your English tutor. 😊 Let's talk a little every day — don't be afraid of mistakes, they're how we learn!\n\nWhat's your name?");
  } else {
    state.chat.forEach(m => addMsg(m.role === "user" ? "user" : "bot", m.content, false));
  }
  renderSuggestions();
}

function renderSuggestions() {
  const box = document.getElementById("chatSuggestions");
  box.innerHTML = "";
  SUGGESTIONS.forEach(s => {
    const b = document.createElement("button");
    b.className = "chip-btn";
    b.textContent = s;
    b.addEventListener("click", () => { document.getElementById("chatText").value = s; sendChat(); });
    box.appendChild(b);
  });
}

function addMsg(cls, text, persist = true) {
  const box = document.getElementById("chatBox");
  const row = document.createElement("div");
  row.className = "msg-row " + cls;
  const div = document.createElement("div");
  div.className = "msg";
  div.textContent = text;
  row.appendChild(div);
  box.appendChild(row);
  box.scrollTop = box.scrollHeight;
  if (persist && cls !== "thinking") {
    state.chat.push({ role: cls === "user" ? "user" : "assistant", content: text });
    state.chat = state.chat.slice(-30);
    save();
  }
  return row;
}

async function sendChat() {
  const input = document.getElementById("chatText");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  addMsg("user", text);
  const thinking = addMsg("thinking", "Alex está escribiendo…", false);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey(),
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: state.chat.map(m => ({ role: m.role, content: m.content }))
      })
    });
    thinking.remove();
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = err.error && err.error.message || res.status;
      addMsg("bot", "⚠️ Error de la API: " + msg + (res.status === 401 ? "\nRevisa tu API key con el botón de la llave." : ""), false);
      return;
    }
    const data = await res.json();
    const reply = data.content.map(c => c.text || "").join("");
    addMsg("bot", reply);
    registerPractice(3);
    if (readAloud) {
      speak(reply.replace(/✏️/g, "").replace(/—[^\n]*$/gm, ""));
    }
  } catch (e) {
    thinking.remove();
    addMsg("bot", "⚠️ No pude conectar. Revisa tu internet. (" + e.message + ")", false);
  }
}

document.getElementById("saveKey").addEventListener("click", () => {
  const key = document.getElementById("apiKeyInput").value.trim();
  if (!key.startsWith("sk-ant-")) { toast("Esa no parece una API key válida (empieza con sk-ant-)"); return; }
  state.apiKey = key;
  save();
  showTutor();
});

document.getElementById("changeKey").addEventListener("click", () => {
  state.apiKey = "";
  state.chat = [];
  save();
  showTutor();
});

document.getElementById("readBtn").addEventListener("click", function () {
  readAloud = !readAloud;
  this.classList.toggle("on", readAloud);
  if (!readAloud) speechSynthesis.cancel();
});

document.getElementById("chatSend").addEventListener("click", sendChat);
document.getElementById("chatText").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendChat();
});
document.getElementById("chatMic").addEventListener("click", function () {
  if (this.classList.contains("recording")) {
    if (activeRec) activeRec.stop();
    return;
  }
  listen(this, (alts) => {
    document.getElementById("chatText").value = alts[0] || "";
    sendChat();
  });
});

// ================== INICIO ==================
applyTheme();
renderStats();
shuffleSession();
renderHablar();
renderClips();
renderCatChips();
renderPhraseGrid();
renderLearnedCount();
showTutor();
