const frases_random = [
    "☀︎",
    "⋆☀︎.",
    "꩜",
    "⏾",
    "ּ ֶָ֢.",
    "❀",
    "⋆☀︎",
    "✺"
]

// Segunda lista (5 frases de prueba)
// Segunda lista (todas las frases)
const frases_random_2 = [
    "¿Recuerdas cuando prometiste que no me dejarías volver a estar solo?",
    "Tu lado de la cama sigue frío.",
    "Mis manos todavía buscan las tuyas cuando duermo.",
    "Olvídame. Bórrame. (Por favor no lo hagas).",
    "Odio que ahora solo hablemos de matemáticas.",
    "Hice café para dos esta mañana por inercia... tuve que tirar el tuyo.",
    "Mi rutina es: Despertar, extrañarte, verte, extrañarte más, dormir.",
    "La casa está demasiado silenciosa cuando no te ríes.",
    "Me duele ver que usas la taza gris, no la que te regalé.",
    "Nadie más tiene la paciencia de curar a alguien tan roto como yo.",
    "Tus manos son lo único cálido en este invierno eterno.",
    "Eres el único usuario con privilegios de administrador en mi vida.",
    "No quiero a nadie más, porque nadie más es tú."
];

const matrix_html = document.getElementById("matrix") // obtenemos el div de nuestro html
const duracionCaida = 8 * 1000; // Aumentado a 8 segundos para que caiga más lento
const gap = 1000 // Aumentado a 1 segundo entre cada caída

// Segunda caída: más espaciada en tiempo
const duracionCaida2 = 9 * 1000;
const gap2 = 2800;

// Array de colores incluyendo un rojo claro
const colores = [
    '#ff6b6b', // rojo claro
    '#4ecdc4', // turquesa
    '#45b7d1', // azul claro
    '#96ceb4', // verde menta
    '#ffeead', // amarillo claro
    '#ff9999', // rosa claro
    '#9b59b6', // morado
    '#3498db'  // azul
];

// Color fijo para las frases (amarillo más intenso)
const colorFrases = "#ffe24a";

// Color fijo para la segunda lista (rojo suave)
const colorFrases2 = "#d65a6f";

// Como generamos un drop¡

function drop(text, xPos){
    const element = document.createElement("div");
    element.className = "drop";
    element.textContent = text;
    element.setAttribute("data-text", text);
    element.style.left = xPos + "px";
    element.style.animationDuration = duracionCaida + "ms";
    // Color fijo
    element.style.setProperty("--c", colorFrases);
    matrix_html.append(element);

    // Limpiar el elemento después de la animación
    element.addEventListener("animationend", () => {
        element.remove();
    });

    // Limpiar el elemento si la página está en segundo plano
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            element.remove();
        }
    });
}

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

let col2Index = 0;
function nextXPos2() {
    const cols = frases_random_2.length;
    const colW = window.innerWidth / (cols + 1);
    const jitter = (Math.random() * 60) - 30;
    const x = (colW * (col2Index + 1)) + jitter;
    col2Index = (col2Index + 1) % cols;
    return clamp(x, 20, window.innerWidth - 20);
}

function drop2(text, xPos){
    const element = document.createElement("div");
    element.className = "drop2";
    element.style.left = xPos + "px";
    element.style.animationDuration = duracionCaida2 + "ms";

    const span = document.createElement("span");
    span.textContent = text;
    element.append(span);

    element.style.setProperty("--c", colorFrases2);
    matrix_html.append(element);

    element.addEventListener("animationend", () => element.remove());

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            element.remove();
        }
    });
}

function cascadaOrdenada(){
    frases_random.forEach((txt, i) => {
        setTimeout(() => {
           const x = (window.innerWidth / (frases_random.length + 1)) * (i + 1);
           drop(txt, x);
        }, i * gap);
    });
}

function cascadaRandom(){
    const max = frases_random.length;
    /*for (let i = 0; i < 20; i++){
        setTimeout(() => {
            const txt = frases_random[Math.floor(Math.random() * max)]
            const x = Math.random() * window.innerWidth;
            drop(txt, x);
        }, i * (gap/2));
    }*/
    const txt = frases_random[Math.floor(Math.random() * max)];
    const x = Math.random() * window.innerWidth;
    drop(txt, x);
}

function cascadaRandom2(){
    const max = frases_random_2.length;
    const txt = frases_random_2[Math.floor(Math.random() * max)];
    const x = nextXPos2();
    drop2(txt, x);
}

function explode (x, y){
    for(let i = 0; i < 10; i++){
        const lbl = document.createElement("div");
        lbl.className = "explode";
        lbl.textContent = "♡";
        lbl.style.left = x + "px";
        lbl.style.top = y + "px";

        const dx = (Math.random() - 0.5) * 300 + "px";
        const dy = (Math.random() - 0.5)* 300 + "px";
        lbl.style.setProperty("--dx", dx);
        lbl.style.setProperty("--dy", dy);
        document.body.append(lbl);

        lbl.addEventListener("animationend", () => lbl.remove());
    }
}

// 6. Iniciar todo
window.addEventListener("load", () => {
    // Limpiar cualquier elemento existente al cargar
    matrix_html.innerHTML = '';
    
    // Iniciar la cascada ordenada una vez
    cascadaOrdenada();
    
    // Iniciar la cascada aleatoria infinita con un intervalo más largo
    setInterval(() => {
        // Limpiar elementos antiguos si hay demasiados (neon)
        const drops = document.getElementsByClassName('drop');
        while (drops.length > 20) drops[0].remove();
        cascadaRandom();
    }, gap);

    // Segunda cascada: más espaciada y separada
    setInterval(() => {
        const drops2 = document.getElementsByClassName('drop2');
        while (drops2.length > 10) drops2[0].remove();
        cascadaRandom2();
    }, gap2);

    // Inicializar carta v2 (si existe en el DOM)
    initCartaV2();

    // Iniciar audio desde el inicio (con fallback si el navegador bloquea autoplay)
    initBgAudio();

    // Botón para cerrar la carta
    initCloseLetterBtn();

    // Botón ACEPTAR (escena final)
    initAcceptBtn();
});
  
// 7. Click listener
document.body.addEventListener("click", e => {
    // No explotar si estamos interactuando con la carta
    if (e.target.closest("#letterRoot")) return;
    explode(e.clientX, e.clientY);
});

function initCartaV2() {
    const envoltura = document.querySelector("#letterRoot .envoltura-sobre");
    const carta = document.querySelector("#letterRoot .carta");
    if (!envoltura || !carta) return;

    document.addEventListener("click", (e) => {
        // Solo manejar clicks dentro de la carta
        if (!e.target.closest("#letterRoot")) return;

        if (e.target.matches(".sobre") ||
            e.target.matches(".solapa-derecha") ||
            e.target.matches(".solapa-izquierda") ||
            e.target.matches(".corazon")) {
            envoltura.classList.toggle("abierto");
        } else if (e.target.matches(".sobre *")) {
            if (!carta.classList.contains("abierta")) {
                carta.classList.add("mostrar-carta");

                setTimeout(() => {
                    carta.classList.remove("mostrar-carta");
                    carta.classList.add("abierta");
                }, 500);
                envoltura.classList.add("desactivar-sobre");
            }
        }
    });
}

function initBgAudio() {
    const audio = document.getElementById("bgAudio");
    if (!audio) return;

    // Archivo dentro de /static (se codifica para soportar espacios/caracteres especiales)
    const audioFile = "I wanna be yours instrumental But it's the best part (1 hour )!.mp3";
    audio.src = "static/" + encodeURIComponent(audioFile);

    // Cargar, pero NO reproducir hasta tocar la carta
    audio.load();

    const letterRoot = document.getElementById("letterRoot");
    if (!letterRoot) return;

    let started = false;
    const startOnce = async () => {
        if (started) return;
        started = true;
        try { audio.currentTime = 0; } catch {}
        try { await audio.play(); } catch {}
    };

    // En móvil/desktop: tocar/click en la carta inicia la música
    letterRoot.addEventListener("pointerdown", startOnce, { once: true, capture: true });
    letterRoot.addEventListener("click", startOnce, { once: true, capture: true });
    letterRoot.addEventListener("keydown", startOnce, { once: true, capture: true });
}

function initCloseLetterBtn() {
    const btn = document.getElementById("closeLetterBtn");
    const letterRoot = document.getElementById("letterRoot");
    if (!btn || !letterRoot) return;

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        growCartaStep();
    });
}

function growCartaStep() {
    const letterRoot = document.getElementById("letterRoot");
    const carta = document.querySelector("#letterRoot .carta");
    const btn = document.getElementById("closeLetterBtn");
    if (!letterRoot || !carta || !btn) return;

    // Si ya llegó a fullscreen, no hacer nada (botón debería estar oculto)
    if (letterRoot.classList.contains("fullscreen")) return;

    // Tamaño actual (ya incluye el zoom aplicado)
    const rect = letterRoot.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // ¿Cuánto falta para cubrir el viewport?
    const factorToFill = Math.max(vw / rect.width, vh / rect.height);

    // Tomamos el "doble" como paso, pero si con menos alcanza el viewport, usamos ese último paso.
    const stepFactor = Math.min(2, factorToFill);

    const currentZoom = parseFloat(getComputedStyle(letterRoot).getPropertyValue("--zoom")) || 1;
    const nextZoom = currentZoom * stepFactor;

    // Animación suave vía CSS transition (transform del letterRoot)
    letterRoot.style.setProperty("--zoom", String(nextZoom));

    // Si este paso ya llena el viewport, fijamos modo fullscreen y escondemos el botón
    if (factorToFill <= 2.001) {
        window.setTimeout(() => {
            enterFullscreenCarta();
        }, 280);
    }
}

function enterFullscreenCarta() {
    const letterRoot = document.getElementById("letterRoot");
    const carta = document.querySelector("#letterRoot .carta");
    const btn = document.getElementById("closeLetterBtn");
    if (!letterRoot || !carta || !btn) return;

    carta.classList.add("fullscreen");
    letterRoot.classList.add("fullscreen");

    // Ocultar y desactivar el botón definitivamente
    btn.hidden = true;
    btn.disabled = true;
    btn.tabIndex = -1;
    btn.setAttribute("aria-hidden", "true");
}

function initAcceptBtn() {
    const btn = document.getElementById("acceptBtn");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        runAcceptScene();
    });
}

function runAcceptScene() {
    const letterRoot = document.getElementById("letterRoot");
    if (letterRoot) {
        // Quitar carta/sobre y dejar solo el fondo
        letterRoot.remove();
    }

    // Crear overlay con corazón gigante y mensaje
    const scene = document.createElement("div");
    scene.id = "acceptScene";

    const heart = document.createElement("div");
    heart.className = "giant-heart";
    heart.textContent = "♡";

    const msg = document.createElement("h1");
    msg.textContent = "te amo zane";

    scene.append(heart, msg);
    document.body.append(scene);

    // Durante 2 segundos, aplicar explode repetidamente
    const start = performance.now();
    const interval = window.setInterval(() => {
        const now = performance.now();
        if (now - start >= 2000) {
            window.clearInterval(interval);
            scene.classList.add("show-message");
            return;
        }
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        explode(x, y);
    }, 140);
}