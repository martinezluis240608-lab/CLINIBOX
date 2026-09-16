/**
 * ==============================================================================
 * CLINIBOX – PASEO VIRTUAL 360° PARA PACIENTES
 * Lógica en JavaScript puro (Vanilla JS) sin librerías externas.
 * 
 * Este archivo controla:
 * 1. La navegación entre las 7 etapas del recorrido.
 * 2. La actualización de la barra de progreso y el indicador HUD.
 * 3. Las ventanas emergentes (Modales) de Farmacia, Receta y Consultorio.
 * 4. El acceso al portal del paciente desde el recorrido virtual.
 * 5. Efectos sonoros interactivos utilizando la Web Audio API nativa.
 * 6. Soporte de teclado (Flechas ← y →, tecla Esc).
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 1. CONFIGURACIÓN Y ESTADO GLOBAL DEL RECORRIDO
// ------------------------------------------------------------------------------

/**
 * Array descriptivo con los nombres y badges de las 7 estaciones principales.
 */
const TOUR_STAGES = [
  { id: "stage-0", title: "Bienvenida", badge: "Paso 1 de 7 • Bienvenida" },
  { id: "stage-1", title: "Centro Médico", badge: "Paso 2 de 7 • Atención y Acceso" },
  { id: "stage-2", title: "Recepción", badge: "Paso 3 de 7 • Módulo de Turnos" },
  { id: "stage-3", title: "Sala de Espera", badge: "Paso 4 de 7 • Sala Confortable" },
  { id: "stage-4", title: "Farmacia", badge: "Paso 5 de 7 • Dispensario de Fármacos" },
  { id: "stage-5", title: "Consultorio", badge: "Paso 6 de 7 • Examen Clínico" },
  { id: "stage-6", title: "Fin del Paseo", badge: "Paso 7 de 7 • Conclusión" }
];

// Variable que almacena el índice de la estación activa actual (0 a 6)
let currentStepIndex = 0;

// Estado de efectos de sonido (activado/desactivado)
let soundEffectsEnabled = true;

// Variable de contexto para la Web Audio API (efectos de sonido sintetizados)
let audioCtx = null;

// ------------------------------------------------------------------------------
// 2. REFERENCIAS A ELEMENTOS DEL DOM (DOCUMENT OBJECT MODEL)
// ------------------------------------------------------------------------------

// Elementos HUD superior e inferior
const hudLocationText = document.getElementById("hudLocationText");
const navStepCounter = document.getElementById("navStepCounter");
const navStepName = document.getElementById("navStepName");
const progressFill = document.getElementById("progressFill");
const stepNodes = document.querySelectorAll(".step-node");
const tourProgressContainer = document.getElementById("tourProgressContainer");
const hudBottomNav = document.getElementById("hudBottomNav");

// Botones de navegación y portales de bienvenida
const btnPrevStep = document.getElementById("btnPrevStep");
const btnNextStep = document.getElementById("btnNextStep");
const btnGoToLogin = document.getElementById("btnGoToLogin");
const btnSoundToggle = document.getElementById("btnSoundToggle");
const soundLabel = document.getElementById("soundLabel");

// Portal interactivo principal de la pantalla de bienvenida
const portalMain = document.getElementById("portalMain");
const btnExploreClinic = document.getElementById("btnExploreClinic");

// Botones de apertura de modales
const btnOpenPharmacyModal = document.getElementById("btnOpenPharmacyModal");
const btnOpenPrescriptionModal = document.getElementById("btnOpenPrescriptionModal");
const btnDoctorModal = document.getElementById("btnDoctorModal");
const btnDashViewPrescription = document.getElementById("btnDashViewPrescription");
const btnHelp = document.getElementById("btnHelp");
const btnForgotPassword = document.getElementById("btnForgotPassword");
const btnTogglePassword = document.getElementById("btnTogglePassword");

// ------------------------------------------------------------------------------
// 3. FUNCIONES DE NAVEGACIÓN ENTRE ESCENARIOS
// ------------------------------------------------------------------------------

/**
 * Cambia la vista activa hacia una estación específica del recorrido.
 * @param {number} newStep - El índice (0 a 6) de la estación destino.
 */
function goToStep(newStep) {
  // Aseguramos que el índice se encuentre dentro de los límites válidos
  if (newStep < 0) newStep = 0;
  if (newStep > TOUR_STAGES.length - 1) newStep = TOUR_STAGES.length - 1;

  currentStepIndex = newStep;

  const introVisible = currentStepIndex === 0;
  const headerOverlay = document.querySelector(".vr-hud-overlay");
  const systemHeader = document.querySelector(".hud-header");

  if (systemHeader) {
    systemHeader.style.display = introVisible ? "none" : "flex";
  }
  if (tourProgressContainer) {
    tourProgressContainer.style.display = introVisible ? "none" : "block";
  }
  if (hudBottomNav) {
    hudBottomNav.style.display = introVisible ? "none" : "flex";
  }
  if (headerOverlay) {
    headerOverlay.style.display = introVisible ? "none" : "block";
  }

  // Ocultamos todos los stages, incluida la pantalla de login.
  document.querySelectorAll(".tour-stage").forEach(stage => {
    stage.classList.remove("active");
  });

  // Mostramos el escenario seleccionado
  const targetStage = document.getElementById(TOUR_STAGES[currentStepIndex].id);
  if (targetStage) {
    targetStage.classList.add("active");
  }

  // Reproducimos un tono suave de transición de cámara VR
  playFeedbackTone(380, "sine", 0.08);

  // Actualizamos toda la interfaz de progreso y etiquetas
  updateProgressUI();
}

/**
 * Avanza a la siguiente estación.
 */
function nextStep() {
  if (currentStepIndex < TOUR_STAGES.length - 1) {
    goToStep(currentStepIndex + 1);
  } else {
    // Si ya estamos en la última estación (Paso 7), avanzar lleva al login
    showLoginScreen();
  }
}

/**
 * Regresa a la estación anterior.
 */
function prevStep() {
  if (currentStepIndex > 0) {
    goToStep(currentStepIndex - 1);
  }
}

/**
 * Vuelve al inicio del recorrido (Estación 1: Bienvenida).
 */
function goHome() {
  goToStep(0);
}

// ------------------------------------------------------------------------------
// 4. ACTUALIZACIÓN VISUAL DE LA BARRA DE PROGRESO Y HUD
// ------------------------------------------------------------------------------

/**
 * Refresca la barra de progreso, números, botones deshabilitados y títulos del HUD.
 */
function updateProgressUI() {
  const currentStageInfo = TOUR_STAGES[currentStepIndex];

  // 1. Actualizar textos en el HUD superior e inferior
  if (hudLocationText) {
    hudLocationText.textContent = currentStepIndex === 1 || currentStepIndex === 6
      ? currentStageInfo.title
      : `${currentStepIndex + 1}. ${currentStageInfo.title}`;
  }
  if (navStepCounter) {
    navStepCounter.textContent = currentStepIndex === 1 || currentStepIndex === 6
      ? ""
      : `Paso ${currentStepIndex + 1} de ${TOUR_STAGES.length}`;
  }
  if (navStepName) {
    navStepName.textContent = currentStageInfo.title;
  }

  // 2. Calcular y aplicar porcentaje a la barra de llenado
  const progressPercent = (currentStepIndex / (TOUR_STAGES.length - 1)) * 100;
  if (progressFill) {
    progressFill.style.width = `${progressPercent}%`;
  }

  // 3. Actualizar estados visuales de los nodos numerados (1 al 7)
  stepNodes.forEach((node, index) => {
    node.classList.remove("active", "completed");
    if (index === currentStepIndex) {
      node.classList.add("active");
    } else if (index < currentStepIndex) {
      node.classList.add("completed");
    }
  });

  // 4. Configurar botones de avanzar y retroceder
  if (btnPrevStep) {
    btnPrevStep.disabled = currentStepIndex === 0;
  }

  if (btnNextStep) {
    if (currentStepIndex === TOUR_STAGES.length - 1) {
      btnNextStep.innerHTML = `<span class="label">Ingresar</span> <span class="arrow">🔐</span>`;
    } else {
      btnNextStep.innerHTML = `<span class="label">Avanzar</span> <span class="arrow">→</span>`;
    }
  }
}

// ------------------------------------------------------------------------------
// 5. PANTALLA DE INICIO DE SESIÓN
// ------------------------------------------------------------------------------

/**
 * Muestra la pantalla de inicio de sesión del paciente.
 */
function showLoginScreen() {
  window.location.assign("public/login");
}

/**
 * Alterna la visibilidad de la contraseña en el campo de texto.
 */
function togglePasswordVisibility() {
  const pwdInput = document.getElementById("loginPassword");
  if (!pwdInput) return;

  if (pwdInput.type === "password") {
    pwdInput.type = "text";
    btnTogglePassword.textContent = "🙈";
  } else {
    pwdInput.type = "password";
    btnTogglePassword.textContent = "👁️";
  }
}

// ------------------------------------------------------------------------------
// 6. GESTIÓN DE VENTANAS EMERGENTES (MODALES)
// ------------------------------------------------------------------------------

/**
 * Abre una ventana emergente específica por su ID.
 * @param {string} modalId - El ID del elemento modal en el HTML.
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("open");
    playFeedbackTone(480, "sine", 0.08);
  }
}

/**
 * Cierra una ventana emergente específica por su ID.
 * @param {string} modalId - El ID del elemento modal en el HTML.
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("open");
  }
}

/**
 * Cierra todos los modales que se encuentren abiertos actualmente.
 */
function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(modal => {
    modal.classList.remove("open");
  });
}

/**
 * Filtra los productos de la farmacia según el texto ingresado en el buscador.
 */
function filterPharmacyItems() {
  const searchInput = document.getElementById("pharmacySearchInput");
  const filterText = searchInput ? searchInput.value.toLowerCase() : "";
  const productCards = document.querySelectorAll(".pharmacy-product-card");

  productCards.forEach(card => {
    const cardData = card.getAttribute("data-name") || "";
    const cardTitle = card.querySelector(".prod-title")?.textContent.toLowerCase() || "";
    
    if (cardData.toLowerCase().includes(filterText) || cardTitle.includes(filterText)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

/**
 * Simula el envío de recuperación de contraseña para el paciente.
 */
function simulatePasswordRecovery() {
  const recoveryInput = document.getElementById("recoveryEmail");
  const feedback = document.getElementById("recoveryFeedback");
  
  if (!recoveryInput || !recoveryInput.value.includes("@")) {
    feedback.style.display = "block";
    feedback.style.background = "#fee2e2";
    feedback.style.color = "#b91c1c";
    feedback.textContent = "Por favor, ingresa un correo electrónico válido.";
    return;
  }

  feedback.style.display = "block";
  feedback.style.background = "#dcfce7";
  feedback.style.color = "#15803d";
  feedback.textContent = `Se ha enviado un enlace de recuperación a: ${recoveryInput.value}. Revisa tu bandeja de entrada.`;

  playFeedbackTone(600, "sine", 0.12);

  setTimeout(() => {
    closeModal("modalForgotPassword");
    feedback.style.display = "none";
  }, 3500);
}

// ------------------------------------------------------------------------------
// 7. EFECTOS DE SONIDO NATIVOS (WEB AUDIO API)
// ------------------------------------------------------------------------------

/**
 * Genera tonos sintéticos agradables y futuristas para simular audio de Realidad Virtual.
 * No requiere archivos de audio externos.
 * @param {number} freq - Frecuencia en Hertz.
 * @param {'sine'|'square'|'sawtooth'|'triangle'} type - Forma de onda acústica.
 * @param {number} duration - Duración en segundos.
 */
function playFeedbackTone(freq, type = "sine", duration = 0.1) {
  if (!soundEffectsEnabled) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!audioCtx) {
      audioCtx = new AudioContext();
    }

    // Si el contexto está suspendido por políticas del navegador, se reactiva con el clic
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Decaimiento exponencial suave para evitar chasquidos
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Si el navegador bloquea el audio, continúa la navegación en silencio sin error
    console.warn("Audio Context en reposo:", err);
  }
}

/**
 * Alterna el estado del audio entre activado y silenciado.
 */
function toggleSound() {
  soundEffectsEnabled = !soundEffectsEnabled;
  if (soundLabel) {
    soundLabel.textContent = soundEffectsEnabled ? "Audio ON" : "Silencio";
  }
  btnSoundToggle.classList.toggle("muted", !soundEffectsEnabled);
}

// ------------------------------------------------------------------------------
// 8. ASIGNACIÓN DE EVENTOS Y LISTENERS
// ------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // 1. Iniciar en la Estación 1: Bienvenida
  goToStep(0);

  // 2. Control de interactividad de la pantalla de bienvenida
  const introDoorScene = document.getElementById("introDoorScene");

  const startTour = () => {
    playFeedbackTone(520, "sine", 0.12);
    if (introDoorScene) {
      introDoorScene.classList.add("is-open");
    }
    window.setTimeout(() => {
      goToStep(1);
    }, 700);
  };

  if (introDoorScene) {
    introDoorScene.addEventListener("mouseenter", () => {
      introDoorScene.classList.add("is-open");
      playFeedbackTone(300, "sine", 0.05);
    });

    introDoorScene.addEventListener("mouseleave", () => {
      introDoorScene.classList.remove("is-open");
    });

    introDoorScene.addEventListener("click", startTour);
    introDoorScene.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        startTour();
      }
    });
  }

  // 3. Botón "Ingresar al sistema" en la estación 7 (Fin del recorrido)
  if (btnGoToLogin) {
    btnGoToLogin.addEventListener("click", () => {
      showLoginScreen();
    });
  }

  // 4. Clic directo en los nodos numerados de la barra de progreso
  stepNodes.forEach(node => {
    node.addEventListener("click", (e) => {
      const stepIndex = parseInt(node.getAttribute("data-step"), 10);
      if (!isNaN(stepIndex)) {
        goToStep(stepIndex);
      }
    });
  });

  // 5. Botones de modales interactivos
  if (btnOpenPharmacyModal) {
    btnOpenPharmacyModal.addEventListener("click", () => openModal("modalPharmacy"));
  }

  if (btnOpenPrescriptionModal) {
    btnOpenPrescriptionModal.addEventListener("click", () => openModal("modalPrescription"));
  }

  if (btnDoctorModal) {
    btnDoctorModal.addEventListener("click", () => openModal("modalDoctor"));
  }

  if (btnDashViewPrescription) {
    btnDashViewPrescription.addEventListener("click", () => openModal("modalPrescription"));
  }

  if (btnHelp) {
    btnHelp.addEventListener("click", () => openModal("modalHelp"));
  }

  if (btnForgotPassword) {
    btnForgotPassword.addEventListener("click", () => openModal("modalForgotPassword"));
  }

  if (btnTogglePassword) {
    btnTogglePassword.addEventListener("click", togglePasswordVisibility);
  }

  if (btnSoundToggle) {
    btnSoundToggle.addEventListener("click", toggleSound);
  }

  // 6. Cerrar modales haciendo clic en el fondo difuminado (overlay)
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  // 7. Navegación mediante el teclado para mayor comodidad
  document.addEventListener("keydown", (e) => {
    // Si hay un modal abierto y se presiona 'Escape', cerrarlo
    if (e.key === "Escape") {
      closeAllModals();
      return;
    }

    // No interceptar flechas si el usuario está escribiendo en un input
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
      return;
    }

    if (e.key === "ArrowRight") {
      nextStep();
    } else if (e.key === "ArrowLeft") {
      prevStep();
    }
  });

  // 8. Rotación automática de tips saludables en la pantalla de la sala de espera
  initHealthTipsSlider();
});

/**
 * Rota periódicamente consejos de salud en la pantalla de la Sala de Espera.
 */
function initHealthTipsSlider() {
  const tips = [
    "💧 Recuerda beber suficiente agua y mantener hábitos saludables diariamente.",
    "🍎 Una dieta equilibrada con frutas y verduras refuerza tu sistema inmunitario.",
    "🚶 Camina al menos 30 minutos al día para cuidar tu corazón y articulaciones.",
    "😴 Descansar de 7 a 8 horas por noche regenera tus células y reduce el estrés.",
    "🩺 Las revisiones preventivas anuales salvan vidas: consulta a tu médico."
  ];

  let currentTipIndex = 0;
  const tipElement = document.getElementById("healthTipText");

  if (tipElement) {
    setInterval(() => {
      currentTipIndex = (currentTipIndex + 1) % tips.length;
      tipElement.style.opacity = "0";
      setTimeout(() => {
        tipElement.textContent = tips[currentTipIndex];
        tipElement.style.opacity = "1";
      }, 300);
    }, 4500);
  }
}
