/* ================================================================
   CLINIBOX – Upgraded Bright Clinical Theme & Google Maps 3D Tour JS (v6)
   Door 1: 🛒 Tienda Médica | Door 2: 📅 Agendar Cita | Door 3: 💬 Conversar con Médico | Door 4: 📍 Clínicas Cerca
   Features: Bright Clinical Aesthetics · Mouse Drag 360° Orbit Pan · Zoom Controls
   ================================================================ */
(function () {
  "use strict";

  /* ── DOM References ────────────────────────────────────────────── */
  const canvas          = document.getElementById("clinicScene");
  const intro           = document.getElementById("tourIntro");
  const startBtn        = document.getElementById("startTour");
  const sceneTitle      = document.getElementById("sceneTitle");
  const sceneKicker     = document.getElementById("sceneKicker");
  const sceneCopy       = document.getElementById("sceneCopy");
  const sceneIndex      = document.getElementById("sceneIndex");
  const sceneActions    = document.getElementById("sceneActions");
  const progressBar     = document.getElementById("progressBar");
  const progressText    = document.getElementById("progressText");
  const currentAreaName = document.getElementById("currentAreaName");
  const hotspots        = Array.from(document.querySelectorAll(".hotspot"));
  const prevBtn         = document.getElementById("previousScene");
  const nextBtn         = document.getElementById("nextScene");
  const viewport        = document.getElementById("clinicViewport");

  // Modal elements
  const areaTabModal    = document.getElementById("areaTabModal");
  const modalAreaIcon   = document.getElementById("modalAreaIcon");
  const modalAreaTitle  = document.getElementById("modalAreaTitle");
  const modalAreaSub    = document.getElementById("modalAreaSubtitle");
  const tabBtnLogin     = document.getElementById("tabBtnLogin");
  const tabBtnContinue  = document.getElementById("tabBtnContinue");
  const panelLogin      = document.getElementById("panelLogin");
  const panelContinue   = document.getElementById("panelContinue");
  const panelLoginDesc  = document.getElementById("panelLoginDesc");
  const loginDoorKeyInput= document.getElementById("loginDoorKey");
  const gateLoginMsg    = document.getElementById("gateLoginMsg");
  const gateSubmitBtn   = document.getElementById("gateSubmitBtn");

  /* ── 4 Doors Data (Tienda Médica Renamed) ─────────────────────── */
  const doorData = {
    tienda: {
      index: 1,
      label: "Puerta 01 - Tienda Médica",
      title: "🛒 Tienda Médica & Salud",
      copy: "Catálogo completo de medicamentos, productos de salud y entregas a domicilio.",
      icon: "🛒",
      subtitle: "Tienda & Catálogo de Salud",
      next: "agendar",
      nextLabel: "Ir a Agendar Cita",
      loginDesc: "🔐 Inicia sesión para surtir tus recetas, realizar compras y recibir tu pedido.",
      previewId: "preview-tienda"
    },
    agendar: {
      index: 2,
      label: "Puerta 02 - Agendar Cita",
      title: "📅 Reserva de Citas Médicas",
      copy: "Agenda tu consulta médica presencial o virtual con especialistas certificados.",
      icon: "📅",
      subtitle: "Módulo de Agendamiento",
      next: "medico",
      nextLabel: "Ir a Hablar con Médico",
      prev: "tienda",
      loginDesc: "🔐 Inicia sesión para confirmar tu cita y recibir la confirmación instantánea.",
      previewId: "preview-agendar"
    },
    medico: {
      index: 3,
      label: "Puerta 03 - Conversar con Médico",
      title: "💬 Consulta Médica Live",
      copy: "Habla en tiempo real con un médico de guardia o realiza telemedicina.",
      icon: "💬",
      subtitle: "Telemedicina & Chat Directo",
      next: "clinicas",
      nextLabel: "Ir a Clínicas Cerca",
      prev: "agendar",
      loginDesc: "🔐 Inicia sesión para iniciar la videollamada o chat privado con tu especialista.",
      previewId: "preview-medico"
    },
    clinicas: {
      index: 4,
      label: "Puerta 04 - Clínicas Cerca",
      title: "📍 Red de Clínicas & Sucursales",
      copy: "Ubicaciones, distancias, horarios de urgencias y direcciones GPS.",
      icon: "📍",
      subtitle: "Geolocalización de Sucursales",
      prev: "medico",
      loginDesc: "🔐 Inicia sesión para guardar tus sucursales favoritas y recibir descuentos.",
      previewId: "preview-clinicas"
    }
  };

  const order = ["tienda", "agendar", "medico", "clinicas"];
  let currentDoor = "tienda";
  let started = false;

  /* ── Switch Active Door ────────────────────────────────────────── */
  function setDoor(key) {
    document.querySelectorAll(".door-card-unit").forEach(el => {
      const active = (el.dataset.door === key);
      el.classList.toggle("active", active);
    });
  }

  /* ── Update Scene Card & Progress HUD ──────────────────────────── */
  function updateCard(key) {
    const data = doorData[key];
    if (!data) return;

    sceneIndex.textContent   = String(data.index).padStart(2, "0");
    sceneKicker.textContent  = data.label;
    sceneTitle.textContent   = data.title;
    sceneCopy.textContent    = data.copy;

    if (currentAreaName) currentAreaName.textContent = data.title;

    const percent = data.index * 25;
    progressBar.style.width = percent + "%";
    progressText.textContent = data.index + " / 4 Puertas";

    hotspots.forEach(h => h.classList.toggle("active", h.dataset.door === key));

    sceneActions.innerHTML = "";

    const btnDualTab = document.createElement("button");
    btnDualTab.className = "tour-primary";
    btnDualTab.type = "button";
    btnDualTab.innerHTML = `<span>${data.icon}</span> Entrar a ${data.title} <span>→</span>`;
    btnDualTab.addEventListener("click", () => openDoorModal(key, "continue"));
    sceneActions.appendChild(btnDualTab);

    if (data.next) {
      const btnNext = document.createElement("button");
      btnNext.className = "tour-secondary";
      btnNext.type = "button";
      btnNext.innerHTML = (data.nextLabel || "Siguiente puerta") + " <span>→</span>";
      btnNext.addEventListener("click", () => setDoorScene(data.next));
      sceneActions.appendChild(btnNext);
    }
  }

  const avatarPositions = {
    tienda:   { pos: "12%", speech: "🛒 ¡Bienvenido a la Tienda Médica! Consulta productos y recetas." },
    agendar:  { pos: "37%", speech: "📅 ¡Aquí puedo agendar mi cita médica en vivo!" },
    medico:   { pos: "62%", speech: "💬 ¡Aquí puedo chatear con un doctor especialista!" },
    clinicas: { pos: "87%", speech: "📍 ¡Aquí veo las clínicas y sucursales más cercanas!" }
  };

  window.setDoorScene = function (key) {
    if (!doorData[key]) return;
    currentDoor = key;
    setDoor(key);
    updateCard(key);

    const avatarWrap = document.getElementById("hallwayAvatarWrap");
    const avatarSpeech = document.getElementById("avatarSpeech");
    const ap = avatarPositions[key];

    if (avatarWrap && ap) {
      avatarWrap.style.left = ap.pos;
      if (avatarSpeech) avatarSpeech.textContent = ap.speech;
    }

    if (window._tourSetCamera) window._tourSetCamera(key);
    if (viewport) viewport.style.display = "flex";
  };

  /* ================================================================
     UNIVERSAL PER-DOOR DUAL-TAB MODAL SYSTEM
     ================================================================ */
  window.openDoorModal = function (doorKey, defaultTab) {
    const key = doorKey || currentDoor;
    const data = doorData[key];
    if (!data) return;

    modalAreaIcon.textContent  = data.icon;
    modalAreaTitle.textContent = data.title;
    modalAreaSub.textContent   = data.subtitle;

    panelLoginDesc.textContent = data.loginDesc;
    if (loginDoorKeyInput) loginDoorKeyInput.value = key;

    document.querySelectorAll(".door-preview-container").forEach(p => p.style.display = "none");
    const targetPreview = document.getElementById(data.previewId);
    if (targetPreview) targetPreview.style.display = "flex";

    const btnNextDoor = document.getElementById("btnNextDoor");
    if (btnNextDoor) {
      if (data.next) {
        btnNextDoor.style.display = "flex";
        btnNextDoor.innerHTML = `➡️ Avanzar a ${doorData[data.next].title} <span>→</span>`;
      } else {
        btnNextDoor.style.display = "none";
      }
    }

    if (gateLoginMsg) {
      gateLoginMsg.className = "login-message";
      gateLoginMsg.textContent = "";
    }

    switchModalTab(defaultTab || "continue");

    if (areaTabModal) {
      areaTabModal.classList.add("is-visible");
      areaTabModal.setAttribute("aria-hidden", "false");
    }
  };

  window.closeDoorModal = function () {
    if (areaTabModal) {
      areaTabModal.classList.remove("is-visible");
      areaTabModal.setAttribute("aria-hidden", "true");
    }
  };

  window.switchModalTab = function (tabName) {
    const isLogin = (tabName === "login");
    tabBtnLogin.classList.toggle("active", isLogin);
    tabBtnContinue.classList.toggle("active", !isLogin);
    panelLogin.classList.toggle("active", isLogin);
    panelContinue.classList.toggle("active", !isLogin);
  };

  window.advanceToNextDoor = function () {
    closeDoorModal();
    const data = doorData[currentDoor];
    if (data && data.next) {
      setDoorScene(data.next);
    }
  };

  /* ── Interactive Feature Handlers ──────────────────────────────── */
  window.filterMedicines = function (query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll(".med-card-item").forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? "flex" : "none";
    });
  };

  window.handleAppointmentSubmit = function (e) {
    e.preventDefault();
    const spec = document.getElementById("appSpecialty").value;
    const doc  = document.getElementById("appDoctor").value;
    const date = document.getElementById("appDate").value;
    const time = document.getElementById("appTime").value;

    showElementTooltip(`✅ Cita pre-reservada: ${spec} con ${doc} el ${date} a las ${time}. Inicia sesión para confirmar.`);
  };

  window.sendChatMessage = function () {
    const input = document.getElementById("chatInput");
    const container = document.getElementById("chatMessages");
    if (!input || !container || !input.value.trim()) return;

    const val = input.value.trim();

    const uMsg = document.createElement("div");
    uMsg.className = "chat-msg user";
    uMsg.innerHTML = `<span>${val}</span>`;
    container.appendChild(uMsg);

    input.value = "";
    container.scrollTop = container.scrollHeight;

    setTimeout(() => {
      const dMsg = document.createElement("div");
      dMsg.className = "chat-msg doc";
      dMsg.innerHTML = `<span>👨‍⚕️ Gracias por tu consulta sobre "${val}". Para darte una receta médica personalizada, por favor inicia sesión o agenda una cita.</span>`;
      container.appendChild(dMsg);
      container.scrollTop = container.scrollHeight;
    }, 1000);
  };

  /* ── Login Authentication ─────────────────────────────────────── */
  window.handleAreaLogin = async function (e) {
    if (e) e.preventDefault();

    gateLoginMsg.className = "login-message";
    gateLoginMsg.textContent = "";
    gateSubmitBtn.disabled = true;
    gateSubmitBtn.innerHTML = "⏳ Verificando credenciales...";

    await new Promise(r => setTimeout(r, 750));

    gateLoginMsg.className = "login-message success";
    gateLoginMsg.textContent = "✅ Acceso concedido a tu espacio personal. Redirigiendo...";

    await new Promise(r => setTimeout(r, 600));

    try {
      window.location.href = "../dashboard/paciente";
    } catch (_) {
      window.location.href = "paciente.html";
    }
  };

  window.demoQuickLogin = function () {
    handleAreaLogin(null);
  };

  window.showElementTooltip = function (msg) {
    let toast = document.getElementById("tour-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "tour-toast";
      toast.style.cssText = "position:fixed;top:80px;right:24px;z-index:350;background:rgba(255,255,255,.94);border:1px solid #0ea5e9;color:#0f172a;padding:12px 20px;border-radius:14px;font-size:13px;box-shadow:0 10px 30px rgba(14,165,233,.25);transition:opacity .3s, transform .3s;pointer-events:none;";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
    }, 3500);
  };

  /* ── Start Tour ───────────────────────────────────────────────── */
  function startTour() {
    started = true;
    if (intro) intro.classList.add("is-hidden");
    if (viewport) viewport.style.display = "flex";
    setDoorScene("tienda");
  }

  window.startTourAndGo = function(doorKey) {
    startTour();
    setDoorScene(doorKey);
  };

  if (startBtn) startBtn.addEventListener("click", startTour);

  /* ── Hotspot & Navigation Controls ────────────────────────────── */
  hotspots.forEach(h => {
    h.addEventListener("click", () => {
      if (!started) startTour();
      setDoorScene(h.dataset.door);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (!started) startTour();
      const idx = order.indexOf(currentDoor);
      if (idx > 0) setDoorScene(order[idx - 1]);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!started) startTour();
      const idx = order.indexOf(currentDoor);
      if (idx < order.length - 1) setDoorScene(order[idx + 1]);
    });
  }

  /* ================================================================
     GOOGLE MAPS STYLE 3D ORBIT & DRAG CONTROLS (THREE.JS)
     ================================================================ */
  if (canvas && window.THREE) {
    const THREE    = window.THREE;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Bright Clinical Hospital Color Palette
    const scene3  = new THREE.Scene();
    scene3.background = new THREE.Color(0xf0f9ff);
    scene3.fog        = new THREE.Fog(0xf0f9ff, 18, 45);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, .1, 100);
    camera.position.set(0, 5, 12);

    const desiredPos = new THREE.Vector3(0, 5, 12);
    const desiredTgt = new THREE.Vector3(0, 2, -5);
    const curTgt     = new THREE.Vector3(0, 2, -5);

    const camData = {
      tienda:    { pos: [-4, 4.5, 8],  tgt: [-4, 2, -2] },
      agendar:   { pos: [4, 4.5, 4],   tgt: [4, 2, -4] },
      medico:    { pos: [-4, 4.5, -2], tgt: [-4, 2, -8] },
      clinicas:  { pos: [4, 4.5, -8],  tgt: [4, 2, -14] }
    };

    window._tourSetCamera = function(key) {
      const d = camData[key];
      if (!d) return;
      desiredPos.set(...d.pos);
      desiredTgt.set(...d.tgt);
    };

    // Google Maps Zoom & Reset functions
    window.gmapsZoomIn = function() {
      if (camera.fov > 25) {
        camera.fov -= 5;
        camera.updateProjectionMatrix();
      }
    };
    window.gmapsZoomOut = function() {
      if (camera.fov < 65) {
        camera.fov += 5;
        camera.updateProjectionMatrix();
      }
    };
    window.gmapsResetView = function() {
      camera.fov = 42;
      camera.updateProjectionMatrix();
      _tourSetCamera(currentDoor);
    };

    // Google Maps Mouse Drag 360° Orbit Interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    canvas.addEventListener("pointerdown", e => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener("pointermove", e => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      desiredPos.x += deltaX * 0.02;
      desiredPos.y -= deltaY * 0.02;

      desiredPos.y = Math.max(2, Math.min(10, desiredPos.y));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("pointerup", () => { isDragging = false; });

    // Mouse Wheel Zoom
    canvas.addEventListener("wheel", e => {
      e.preventDefault();
      if (e.deltaY < 0) gmapsZoomIn();
      else gmapsZoomOut();
    }, { passive: false });

    // Bright Clinical Lighting
    scene3.add(new THREE.HemisphereLight(0xffffff, 0xbae6fd, 2.5));
    const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
    mainLight.position.set(5, 14, 8);
    scene3.add(mainLight);

    // Luminous Hospital Geometry
    function box3(w, h, d, color, x, y, z) {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ color, roughness: .3, metalness: .1 })
      );
      m.position.set(x, y, z);
      scene3.add(m);
      return m;
    }

    // White Shiny Tiles & Hospital Walls
    box3(22, .2, 42, 0xe2e8f0, 0, -.1, -5); // Floor Base
    box3(22, .05, 42, 0xf8fafc, 0, .05, -5); // Shiny White Tile Surface
    box3(22, .2, 42, 0xe0f2fe, 0, 8, -5);   // Luminous Ceiling

    box3(.3, 8, 42, 0xecfeff, -11, 4, -5);  // Left Clinical Wall
    box3(.3, 8, 42, 0xecfeff, 11, 4, -5);   // Right Clinical Wall

    // Door Frames in Bright Neon Colors
    box3(3.2, 5.2, .4, 0x10b981, -10.8, 2.5, 4);  // Door 1 (Tienda)
    box3(3.2, 5.2, .4, 0x0ea5e9, 10.8, 2.5, 0);   // Door 2 (Citas)
    box3(3.2, 5.2, .4, 0x8b5cf6, -10.8, 2.5, -4); // Door 3 (Doctor)
    box3(3.2, 5.2, .4, 0x14b8a6, 10.8, 2.5, -8);  // Door 4 (Clínicas)

    // Ceiling Light Bars
    for (let z = 10; z >= -22; z -= 8) {
      const pLight = new THREE.PointLight(0x38bdf8, 2.2, 10);
      pLight.position.set(0, 7.5, z);
      scene3.add(pLight);
      box3(2.4, .06, .5, 0x38bdf8, 0, 7.9, z);
    }

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);

      camera.position.lerp(desiredPos, .05);
      curTgt.lerp(desiredTgt, .05);
      camera.lookAt(curTgt);

      renderer.render(scene3, camera);
    }

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
  }

  setDoor("tienda");
  updateCard("tienda");

})();
