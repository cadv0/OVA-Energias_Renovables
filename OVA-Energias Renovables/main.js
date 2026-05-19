/* ============================================================
   ENERGÍAS RENOVABLES — OVA
   main.js  |  Sidebar · Tabs · 4 Actividades interactivas
   ============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════════
   UTILIDADES GLOBALES
   ══════════════════════════════════════════════════════════════ */

function go(url){ window.location.href = url; }

function smoothScrollTo(id){
  setTimeout(() => {
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  }, 80);
}

/* ══════════════════════════════════════════════════════════════
   SIDEBAR — TOGGLE + AUTO-OCULTAR
   ══════════════════════════════════════════════════════════════ */
function toggleSB(){
  const w       = document.getElementById('wrapper');
  const overlay = document.getElementById('sbOverlay');
  if(!w) return;

  if(window.innerWidth <= 700){
    // Mobile: overlay + clase sb-on
    w.classList.toggle('sb-on');
    if(overlay) overlay.classList.toggle('active');
  } else {
    // Desktop: colapsar/expandir
    w.classList.toggle('sb-off');
  }
}

/* Cierra sidebar en mobile (lo llaman los links del sidebar) */
function closeSBMobile(){
  if(window.innerWidth <= 700){
    const w       = document.getElementById('wrapper');
    const overlay = document.getElementById('sbOverlay');
    if(w)       w.classList.remove('sb-on');
    if(overlay) overlay.classList.remove('active');
  }
}

/* Marcar ítem activo en sidebar */
function markSB(el){
  document.querySelectorAll('.ova-sidebar .sb-item').forEach(i => i.classList.remove('active'));
  if(el) el.classList.add('active');
}

/* Submenu desplegable */
function toggleSub(subId, btnId){
  const sub = document.getElementById(subId);
  const btn = document.getElementById(btnId);
  if(!sub || !btn) return;
  sub.classList.toggle('open');
  btn.classList.toggle('open');
}

/* ══════════════════════════════════════════════════════════════
   TABS — SISTEMA DE PESTAÑAS
   ══════════════════════════════════════════════════════════════ */
function showTab(panelId, btnEl){
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  const panel = document.getElementById(panelId);
  if(panel) panel.classList.add('active');

  if(btnEl){
    btnEl.classList.add('active');
  } else {
    const suffix = panelId.replace('tab-','');
    const btn = document.getElementById('tbtn-' + suffix);
    if(btn) btn.classList.add('active');
  }

  // Cuando se abre tab-actividades sin actividad específica, mostrar menú
  if(panelId === 'tab-actividades'){
    mostrarMenuActividades();
  }
}

/* ══════════════════════════════════════════════════════════════
   ACTIVIDADES — MOSTRAR INDIVIDUALMENTE
   ══════════════════════════════════════════════════════════════ */
function showActSola(actId){
  // Activar el tab de actividades
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const tabAct = document.getElementById('tab-actividades');
  if(tabAct) tabAct.classList.add('active');

  // Ocultar menú general
  const menu = document.getElementById('act-menu');
  if(menu) menu.style.display = 'none';

  // Ocultar todas las actividades individuales
  document.querySelectorAll('.act-solo').forEach(a => a.style.display = 'none');

  // Mostrar solo la solicitada
  const actEl = document.getElementById(actId);
  if(actEl){
    actEl.style.display = 'block';
    // Forzar fade-in
    const fadeEl = actEl.querySelector('.fade');
    if(fadeEl) { fadeEl.classList.remove('in'); setTimeout(() => fadeEl.classList.add('in'), 60); }
    actEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Activar sidebar submenu visualmente
  markSBActividad(actId);
}

function volverActMenu(){
  document.querySelectorAll('.act-solo').forEach(a => a.style.display = 'none');
  const menu = document.getElementById('act-menu');
  if(menu){ menu.style.display = 'block'; menu.scrollIntoView({ behavior:'smooth', block:'start' }); }
  // Quitar marca activa del submenu
  document.querySelectorAll('.sb-sub a').forEach(a => a.classList.remove('active'));
}

function mostrarMenuActividades(){
  document.querySelectorAll('.act-solo').forEach(a => a.style.display = 'none');
  const menu = document.getElementById('act-menu');
  if(menu) menu.style.display = 'block';
}

function markSBActividad(actId){
  const mapa = { act1: 0, act2: 1, act3: 2, act4: 3 };
  const links = document.querySelectorAll('.sb-sub a');
  links.forEach(a => a.classList.remove('active'));
  const idx = mapa[actId];
  if(idx !== undefined && links[idx]) links[idx].classList.add('active');
  // Abrir submenu si está cerrado
  const sub = document.getElementById('actSub');
  const btn = document.getElementById('actBtn');
  if(sub && !sub.classList.contains('open')){ sub.classList.add('open'); if(btn) btn.classList.add('open'); }
}

/* Leer query params al cargar contenido.html */
(function initQueryParams(){
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  const act = params.get('act');

  if(tab){
    const tabMap = {
      'contenido':   'tab-contenido',
      'actividades': 'tab-actividades',
      'examen':      'tab-examen',
      'recursos':    'tab-recursos',
      'creditos':    'tab-creditos',
    };
    if(tabMap[tab]){
      showTab(tabMap[tab]);
    }
  }

  if(act && ['act1','act2','act3','act4'].includes(act)){
    showActSola(act);
  }

  // Retrocompatibilidad con hash
  const hash = window.location.hash;
  if(hash){
    const hashMap = {
      '#contenido':   'tab-contenido',
      '#actividades': 'tab-actividades',
      '#examen':      'tab-examen',
      '#recursos':    'tab-recursos',
      '#creditos':    'tab-creditos',
    };
    const actHash = { '#act1':'act1', '#act2':'act2', '#act3':'act3', '#act4':'act4' };
    if(hashMap[hash]) showTab(hashMap[hash]);
    if(actHash[hash]) showActSola(actHash[hash]);
  }
})();

/* ══════════════════════════════════════════════════════════════
   FADE-IN AL SCROLL
   ══════════════════════════════════════════════════════════════ */
(function initFade(){
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade').forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════════════════════════
   ACTIVIDAD 1 — RELACIONAR CONCEPTOS
   ══════════════════════════════════════════════════════════════ */
let relSelected = null;
let relMatches  = {};

(function initRelacionar(){
  const leftItems  = document.querySelectorAll('#rel-left  .rel-item');
  const rightItems = document.querySelectorAll('#rel-right .rel-item');
  if(!leftItems.length) return;

  leftItems.forEach(item => {
    item.addEventListener('click', () => {
      if(item.classList.contains('matched')) return;
      leftItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      relSelected = item.dataset.id;
    });
  });

  rightItems.forEach(item => {
    item.addEventListener('click', () => {
      if(!relSelected || item.classList.contains('matched')) return;

      const lid    = relSelected;
      const rmatch = item.dataset.match;

      if(rmatch === lid){
        document.querySelector(`#rel-left .rel-item[data-id="${lid}"]`).classList.add('matched');
        item.classList.add('matched');
        const arr = document.getElementById('arr-' + lid);
        if(arr) arr.classList.add('lit');
        relMatches[lid] = rmatch;
      } else {
        const lEl = document.querySelector(`#rel-left .rel-item[data-id="${lid}"]`);
        lEl.classList.add('wrong'); item.classList.add('wrong');
        setTimeout(() => {
          lEl.classList.remove('wrong','selected');
          item.classList.remove('wrong');
        }, 600);
      }
      relSelected = null;
      leftItems.forEach(i => i.classList.remove('selected'));
    });
  });
})();

function checkRelacionar(){
  const total   = document.querySelectorAll('#rel-left .rel-item').length;
  const matched = document.querySelectorAll('#rel-left .rel-item.matched').length;
  const fb = document.getElementById('fb-rel');
  if(!fb) return;
  if(matched === total){
    setFB(fb, `✅ ¡Perfecto! Relacionaste los ${total} conceptos correctamente.`, true);
  } else {
    setFB(fb, `⚠️ Llevas ${matched} de ${total}. Sigue intentando.`, false);
  }
}

function resetRelacionar(){
  document.querySelectorAll('#rel-left .rel-item, #rel-right .rel-item').forEach(i => {
    i.className = 'rel-item';
  });
  document.querySelectorAll('.rel-arr').forEach(a => a.classList.remove('lit'));
  relSelected = null; relMatches = {};
  clearFB('fb-rel');
}

/* ══════════════════════════════════════════════════════════════
   ACTIVIDAD 2 — COMPLETAR ESPACIOS
   ══════════════════════════════════════════════════════════════ */
const BLANCOS = [
  { pre:'Los paneles',         key:'solares',       post:'convierten la luz del sol en electricidad mediante efecto fotovoltaico.' },
  { pre:'La energía',          key:'eólica',        post:'se obtiene aprovechando el movimiento del viento.' },
  { pre:'Una fuente es renovable cuando no se', key:'agota', post:'y se regenera de forma natural en la Tierra.' },
  { pre:'La energía',          key:'geotérmica',    post:'aprovecha el calor interno del planeta para generar electricidad.' },
  { pre:'El CO₂ es el principal gas de efecto', key:'invernadero', post:'que intensifica el calentamiento global.' },
];

(function initBlancos(){
  const cont = document.getElementById('blank-container');
  if(!cont) return;
  BLANCOS.forEach((b, i) => {
    const p = document.createElement('p');
    p.style.marginBottom = '.9rem';
    p.innerHTML = `${b.pre} <input class="b-inp" id="bi-${i}" type="text" placeholder="________" autocomplete="off" spellcheck="false"/> ${b.post}`;
    cont.appendChild(p);
  });
})();

function norm(s){ return s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }

function checkBlancos(){
  let ok = 0;
  BLANCOS.forEach((b, i) => {
    const inp = document.getElementById(`bi-${i}`);
    if(!inp) return;
    if(norm(inp.value) === norm(b.key)){
      inp.className = 'b-inp ok'; ok++;
    } else {
      inp.className = 'b-inp err';
    }
  });
  const fb = document.getElementById('fb-blank');
  if(!fb) return;
  if(ok === BLANCOS.length){
    setFB(fb, `✅ ¡Excelente! Todas las respuestas correctas.`, true);
  } else {
    setFB(fb, `⚠️ ${ok} de ${BLANCOS.length} correctas. Las incorrectas están en rojo.`, false);
  }
}

function resetBlancos(){
  BLANCOS.forEach((_,i)=>{
    const inp = document.getElementById(`bi-${i}`);
    if(inp){ inp.value=''; inp.className='b-inp'; }
  });
  clearFB('fb-blank');
}

/* ══════════════════════════════════════════════════════════════
   ACTIVIDAD 3 — VERDADERO O FALSO
   ══════════════════════════════════════════════════════════════ */
const VF_DATA = [
  { stmt:'La energía solar es inagotable porque el sol brillará por miles de millones de años más.', ans:true },
  { stmt:'Las energías renovables producen grandes cantidades de CO₂ durante su operación normal.', ans:false },
  { stmt:'Una turbina eólica genera electricidad al girar impulsada por el viento.', ans:true },
  { stmt:'La energía geotérmica solo se puede usar en países con volcanes activos.', ans:false },
  { stmt:'La biomasa es un tipo de energía renovable que proviene de materia orgánica.', ans:true },
  { stmt:'El carbón se considera una fuente de energía renovable porque se forma en la naturaleza.', ans:false },
];

let vfSel = {};

(function initVF(){
  const list = document.getElementById('vf-list');
  if(!list) return;
  buildVF(list);
})();

function buildVF(list){
  list.innerHTML = '';
  VF_DATA.forEach((item, i) => {
    const li = document.createElement('li');
    li.className = 'vf-item';
    li.innerHTML = `
      <div class="vf-stmt">${i+1}. ${item.stmt}</div>
      <div class="vf-btns">
        <button class="vf-btn" id="vv-${i}" onclick="selVF(${i},true)">✅ Verdadero</button>
        <button class="vf-btn" id="vf-${i}" onclick="selVF(${i},false)">❌ Falso</button>
      </div>`;
    list.appendChild(li);
  });
}

function selVF(i, val){
  vfSel[i] = val;
  const bV = document.getElementById(`vv-${i}`);
  const bF = document.getElementById(`vf-${i}`);
  if(!bV||!bF) return;
  bV.className = (val===true)  ? 'vf-btn sv' : 'vf-btn';
  bF.className = (val===false) ? 'vf-btn sf' : 'vf-btn';
}

function checkVF(){
  let ok = 0;
  VF_DATA.forEach((item, i) => {
    const bV = document.getElementById(`vv-${i}`);
    const bF = document.getElementById(`vf-${i}`);
    if(!bV||!bF) return;
    if(vfSel[i] === undefined) return;
    const correcto = (vfSel[i] === item.ans);
    if(correcto){
      ok++;
      (item.ans ? bV : bF).classList.add('correct');
    } else {
      (vfSel[i]===true ? bV : bF).classList.add('wrong');
      (item.ans ? bV : bF).style.border = '2px solid #2ecc71';
    }
    bV.disabled = true; bF.disabled = true;
  });
  const fb = document.getElementById('fb-vf');
  if(!fb) return;
  if(ok === VF_DATA.length){
    setFB(fb, `✅ ¡Perfecto! ${ok}/${VF_DATA.length} correctas.`, true);
  } else {
    setFB(fb, `⚠️ ${ok} de ${VF_DATA.length} correctas. Las correctas marcadas en verde.`, false);
  }
}

function resetVF(){
  vfSel = {};
  const list = document.getElementById('vf-list');
  if(list) buildVF(list);
  clearFB('fb-vf');
}

/* ══════════════════════════════════════════════════════════════
   ACTIVIDAD 4 — SOPA DE LETRAS (CORREGIDA)
   - Palabras garantizadas en la cuadrícula
   - Fuente más grande para distinguir M/W
   ══════════════════════════════════════════════════════════════ */
const PALABRAS = ['SOLAR','EOLICA','BIOMASA','HIDRO','VERDE','VIENTO','PANEL','GAS'];
const SZ = 14; // cuadrícula más grande para asegurar espacio

let sopaGrid   = [];
let sopaPos    = {};
let sopaFound  = new Set();
let sopaClicks = [];

(function initSopa(){
  const cont  = document.getElementById('sopa-container');
  const chips = document.getElementById('sopa-chips');
  if(!cont || !chips) return;

  buildSopaGridGarantizado();
  renderSopa(cont);
  renderChips(chips);
})();

/* ---- Construcción GARANTIZADA: primero coloca todas las palabras, luego rellena ---- */
function buildSopaGridGarantizado(){
  const abc  = 'ABCDEFGHIJKLMNOPRSTUVXYZ'; // sin W,Q,K para no confundir
  const dirs = [[0,1],[1,0],[1,1],[0,-1],[-1,0],[-1,-1],[1,-1],[-1,1]];

  // Inicializar con puntos (marcadores de vacío)
  sopaGrid = Array.from({length:SZ}, () => Array(SZ).fill(null));
  sopaPos  = {};

  // Ordenar palabras de mayor a menor para facilitar colocación
  const palabrasOrdenadas = [...PALABRAS].sort((a,b) => b.length - a.length);

  palabrasOrdenadas.forEach(word => {
    let placed = false;
    let intentos = 0;

    while(!placed && intentos < 1000){
      intentos++;
      const d = dirs[Math.floor(Math.random() * dirs.length)];
      const r = Math.floor(Math.random() * SZ);
      const c = Math.floor(Math.random() * SZ);
      const re = r + d[0] * (word.length - 1);
      const ce = c + d[1] * (word.length - 1);

      // Verificar límites
      if(re < 0 || re >= SZ || ce < 0 || ce >= SZ) continue;

      // Verificar celdas disponibles (null o misma letra)
      let ok = true;
      const cells = [];
      for(let k = 0; k < word.length; k++){
        const ri = r + d[0]*k;
        const ci = c + d[1]*k;
        if(sopaGrid[ri][ci] !== null && sopaGrid[ri][ci] !== word[k]){
          ok = false; break;
        }
        cells.push({r:ri, c:ci});
      }
      if(!ok) continue;

      // Colocar la palabra
      cells.forEach(({r:ri, c:ci}, k) => { sopaGrid[ri][ci] = word[k]; });
      sopaPos[word] = cells;
      placed = true;
    }

    if(!placed){
      // Forzar colocación horizontal en la primera fila libre
      const rowFree = Object.keys(sopaPos).length;
      const startR  = Math.min(rowFree * 2, SZ - 1);
      if(word.length <= SZ){
        const cells = [];
        for(let k = 0; k < word.length; k++){
          sopaGrid[startR][k] = word[k];
          cells.push({r:startR, c:k});
        }
        sopaPos[word] = cells;
      }
    }
  });

  // Rellenar celdas vacías con letras aleatorias (sin W para no confundir con M)
  for(let r = 0; r < SZ; r++){
    for(let c = 0; c < SZ; c++){
      if(sopaGrid[r][c] === null){
        sopaGrid[r][c] = abc[Math.floor(Math.random() * abc.length)];
      }
    }
  }
}

function renderSopa(cont){
  const gridEl = document.createElement('div');
  gridEl.className = 'sopa-grid';
  gridEl.style.gridTemplateColumns = `repeat(${SZ}, 34px)`;
  gridEl.id = 'sopa-grid';

  sopaGrid.forEach((row, r) => row.forEach((letra, c) => {
    const cell = document.createElement('div');
    cell.className = 's-cell';
    cell.textContent = letra;
    cell.dataset.r = r; cell.dataset.c = c;
    cell.addEventListener('click', () => onSopaClick(r, c));
    gridEl.appendChild(cell);
  }));
  cont.appendChild(gridEl);
}

function renderChips(chips){
  PALABRAS.forEach(p => {
    const chip = document.createElement('span');
    chip.className = 'w-chip'; chip.id = `chip-${p}`;
    chip.textContent = p;
    chips.appendChild(chip);
  });
}

function getSCell(r,c){ return document.querySelector(`#sopa-grid .s-cell[data-r="${r}"][data-c="${c}"]`); }

function onSopaClick(r,c){
  sopaClicks.push({r,c});
  const cell = getSCell(r,c);
  if(cell) cell.classList.add('hl');

  if(sopaClicks.length === 2){
    const [a,b] = sopaClicks;
    const dr    = Math.sign(b.r-a.r);
    const dc    = Math.sign(b.c-a.c);
    const steps = Math.max(Math.abs(b.r-a.r), Math.abs(b.c-a.c));
    const sel   = [];
    for(let i = 0; i <= steps; i++) sel.push({r: a.r+dr*i, c: a.c+dc*i});

    const str  = sel.map(({r,c}) => (sopaGrid[r]?.[c] || '')).join('');
    const strR = [...str].reverse().join('');
    const match = PALABRAS.find(p => (p === str || p === strR) && !sopaFound.has(p));

    if(match){
      sopaFound.add(match);
      sel.forEach(({r,c}) => {
        const el = getSCell(r,c);
        if(el){ el.classList.remove('hl'); el.classList.add('found'); }
      });
      const chip = document.getElementById(`chip-${match}`);
      if(chip) chip.classList.add('found');

      if(sopaFound.size === PALABRAS.length){
        setFB(document.getElementById('fb-sopa'), '🎉 ¡Encontraste todas las palabras! ¡Excelente!', true);
      }
    } else {
      sel.forEach(({r,c}) => {
        const el = getSCell(r,c);
        if(el && !el.classList.contains('found')) el.classList.remove('hl');
      });
    }
    sopaClicks = [];
  }
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════ */
function setFB(el, msg, ok){
  if(!el) return;
  el.textContent = msg;
  el.className = ok ? 'fb ok' : 'fb err';
}
function clearFB(id){
  const el = document.getElementById(id);
  if(el){ el.textContent=''; el.className='fb'; }
}

/* ══════════════════════════════════════════════════════════════
   EXAMEN FINAL — 1 sola oportunidad, nota 1.0–5.0
   ══════════════════════════════════════════════════════════════ */

const EXAM_KEY = 'ova_examen_completado';

const EXAM_PREGUNTAS = [
  {
    txt: '¿Cuál de las siguientes es una fuente de energía renovable?',
    opts: ['Carbón', 'Petróleo', 'Energía solar', 'Gas natural'],
    ans: 2
  },
  {
    txt: '¿Qué dispositivo convierte directamente la luz solar en electricidad?',
    opts: ['Turbina de vapor', 'Panel fotovoltaico', 'Generador diésel', 'Celda de combustible de carbón'],
    ans: 1
  },
  {
    txt: '¿Cómo funciona una turbina eólica?',
    opts: ['Quema combustible para generar calor', 'Usa el agua del mar para moverse', 'Aprovecha el viento para girar y producir electricidad', 'Capta calor del subsuelo'],
    ans: 2
  },
  {
    txt: '¿Qué tipo de energía aprovecha el calor interno de la Tierra?',
    opts: ['Mareomotriz', 'Biomasa', 'Solar', 'Geotérmica'],
    ans: 3
  },
  {
    txt: 'La energía mareomotriz se genera gracias a:',
    opts: ['El viento sobre el océano', 'El movimiento de las mareas y olas', 'La descomposición de algas marinas', 'Los rayos de sol sobre el agua'],
    ans: 1
  },
  {
    txt: '¿Cuál es la principal ventaja de las energías renovables frente a los combustibles fósiles?',
    opts: ['Son más baratas de extraer', 'No producen gases de efecto invernadero durante operación', 'Tienen mayor densidad energética', 'Son más fáciles de transportar'],
    ans: 1
  },
  {
    txt: 'La biomasa obtiene su energía de:',
    opts: ['El sol directamente', 'Materia orgánica como residuos y madera', 'El movimiento del agua en ríos', 'Diferencias de temperatura oceánica'],
    ans: 1
  },
  {
    txt: '¿Cuál de estos gases es considerado el principal responsable del calentamiento global?',
    opts: ['Oxígeno (O₂)', 'Nitrógeno (N₂)', 'Dióxido de carbono (CO₂)', 'Argón (Ar)'],
    ans: 2
  },
  {
    txt: 'La energía hidráulica aprovecha:',
    opts: ['El calor del agua', 'El flujo de ríos y embalses para mover turbinas', 'La salinidad del agua de mar', 'La evaporación del agua'],
    ans: 1
  },
  {
    txt: '¿Cuál de estas afirmaciones sobre las energías renovables es VERDADERA?',
    opts: [
      'Se agotan con el tiempo igual que el petróleo',
      'Solo funcionan en países con climas extremos',
      'Se regeneran de forma natural y son prácticamente inagotables',
      'Producen más CO₂ que los combustibles fósiles'
    ],
    ans: 2
  }
];

let examRespuestas = {};
let examRealizado  = false;

// Al cargar, verificar si ya se hizo el examen
(function initExamen(){
  const completado = sessionStorage.getItem(EXAM_KEY);
  if(completado){
    // Ya realizó el examen; mostrar resultado guardado
    const data = JSON.parse(completado);
    mostrarResultadoGuardado(data);
  }
})();

function iniciarExamen(){
  // Verificar si ya lo hizo
  if(sessionStorage.getItem(EXAM_KEY)){
    mostrarResultadoGuardado(JSON.parse(sessionStorage.getItem(EXAM_KEY)));
    return;
  }
  // Mostrar modal de confirmación
  document.getElementById('exam-modal-overlay').style.display = 'flex';
}

function cancelarExamen(){
  document.getElementById('exam-modal-overlay').style.display = 'none';
}

function confirmarExamen(){
  document.getElementById('exam-modal-overlay').style.display = 'none';
  document.getElementById('exam-inicio').style.display = 'none';
  renderExamen();
  document.getElementById('exam-preguntas').style.display = 'block';
  examRealizado = true;
}

function renderExamen(){
  const lista = document.getElementById('exam-preguntas-lista');
  if(!lista) return;
  lista.innerHTML = '';

  EXAM_PREGUNTAS.forEach((p, i) => {
    const item = document.createElement('div');
    item.className = 'exam-pregunta-item';
    item.innerHTML = `
      <div class="exam-pregunta-num">PREGUNTA ${i+1} / ${EXAM_PREGUNTAS.length}</div>
      <div class="exam-pregunta-txt">${p.txt}</div>
      <div class="exam-opciones" id="opciones-${i}">
        ${p.opts.map((op, j) => `
          <label class="exam-opcion" id="op-${i}-${j}" onclick="seleccionarOpcion(${i},${j})">
            <input type="radio" name="preg-${i}" value="${j}"/>
            <span class="exam-opcion-dot"></span>
            <span>${op}</span>
          </label>
        `).join('')}
      </div>`;
    lista.appendChild(item);
  });
  actualizarProgreso();
}

function seleccionarOpcion(pregIdx, opIdx){
  // Deselect all options for this question
  const cont = document.getElementById(`opciones-${pregIdx}`);
  if(!cont) return;
  cont.querySelectorAll('.exam-opcion').forEach(el => el.classList.remove('selected'));
  const sel = document.getElementById(`op-${pregIdx}-${opIdx}`);
  if(sel) sel.classList.add('selected');
  examRespuestas[pregIdx] = opIdx;
  actualizarProgreso();
}

function actualizarProgreso(){
  const respondidas = Object.keys(examRespuestas).length;
  const total = EXAM_PREGUNTAS.length;
  const pct = Math.round((respondidas / total) * 100);
  const fill = document.getElementById('exam-prog-fill');
  const txt  = document.getElementById('exam-prog-txt');
  if(fill) fill.style.width = pct + '%';
  if(txt)  txt.textContent  = `${respondidas} / ${total} respondidas`;
}

function entregarExamen(){
  // Verificar que todas estén respondidas
  if(Object.keys(examRespuestas).length < EXAM_PREGUNTAS.length){
    const fb = document.getElementById('fb-exam-entregar');
    if(fb){
      fb.textContent = '⚠️ Debes responder todas las preguntas antes de entregar.';
      fb.className = 'fb err';
    }
    return;
  }

  // Calcular puntaje
  let correctas = 0;
  EXAM_PREGUNTAS.forEach((p, i) => {
    if(examRespuestas[i] === p.ans) correctas++;
  });

  // Convertir a escala 1.0 – 5.0
  // 0 correctas = 1.0, 10 correctas = 5.0
  const nota = (1 + (correctas / EXAM_PREGUNTAS.length) * 4).toFixed(1);
  const data = { nota, correctas, total: EXAM_PREGUNTAS.length };

  // Guardar en sessionStorage (1 sola oportunidad)
  sessionStorage.setItem(EXAM_KEY, JSON.stringify(data));

  // Ocultar preguntas, mostrar resultado
  document.getElementById('exam-preguntas').style.display = 'none';
  mostrarResultado(data);
}

function mostrarResultado(data){
  document.getElementById('exam-resultado').style.display = 'block';
  document.getElementById('exam-res-nota').textContent = data.nota;
  document.getElementById('exam-res-detalle').textContent =
    `${data.correctas} de ${data.total} preguntas correctas`;

  const notaNum = parseFloat(data.nota);
  let icon, msg, color;
  if(notaNum >= 4.5){
    icon='🏆'; msg='¡Excelente! Dominas perfectamente el tema de energías renovables.'; color='var(--verde-neo)';
  } else if(notaNum >= 4.0){
    icon='🌟'; msg='¡Muy bien! Tienes un sólido conocimiento sobre energías renovables.'; color='var(--verde)';
  } else if(notaNum >= 3.0){
    icon='✅'; msg='Aprobaste. Revisa el contenido para reforzar tus conocimientos.'; color='var(--amarillo)';
  } else if(notaNum >= 2.0){
    icon='📚'; msg='No aprobaste. Te recomendamos repasar el video y las actividades.'; color='var(--naranja)';
  } else {
    icon='😔'; msg='Necesitas repasar el contenido del OVA con más detalle.'; color='#ff5050';
  }

  document.getElementById('exam-res-icon').textContent = icon;
  const msgEl = document.getElementById('exam-res-msg');
  if(msgEl){ msgEl.textContent = msg; msgEl.style.color = color; }
}

function mostrarResultadoGuardado(data){
  document.getElementById('exam-inicio').style.display = 'none';
  const infoDiv = document.createElement('div');
  infoDiv.innerHTML = `<p style="color:var(--gris);font-size:.88rem;margin-bottom:1rem;">Ya realizaste este examen. Aquí está tu resultado:</p>`;
  const resultDiv = document.getElementById('exam-resultado');
  if(resultDiv) resultDiv.parentNode.insertBefore(infoDiv, resultDiv);
  mostrarResultado(data);
}
