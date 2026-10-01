(() => {
    const hospital = document.getElementById("hospital");
    const doorArea = document.getElementById("doorArea");
    const entrance = document.querySelector(".entrance");

    if (!hospital || !doorArea || !entrance) return;

    let doorsOpen = false;
    let audioContext = null;
    let pendingSound = null;
    let pendingSelectionSound = false;

    const playMotorSound = (direction) => {
        if (!audioContext || audioContext.state !== "running") {
            pendingSound = direction;
            return;
        }

        const start = audioContext.currentTime;
        const oscillator = audioContext.createOscillator();
        const overtone = audioContext.createOscillator();
        const filter = audioContext.createBiquadFilter();
        const gain = audioContext.createGain();

        oscillator.type = "sine";
        overtone.type = "triangle";
        const opening = direction === "open";
        oscillator.frequency.setValueAtTime(opening ? 92 : 142, start);
        oscillator.frequency.exponentialRampToValueAtTime(opening ? 142 : 92, start + 0.72);
        overtone.frequency.setValueAtTime(opening ? 184 : 284, start);
        overtone.frequency.exponentialRampToValueAtTime(opening ? 284 : 184, start + 0.72);
        filter.type = "lowpass";
        filter.frequency.value = 460;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.08, start + 0.11);
        gain.gain.setValueAtTime(0.08, start + 0.43);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.76);

        oscillator.connect(filter);
        overtone.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(start);
        overtone.start(start);
        oscillator.stop(start + 0.78);
        overtone.stop(start + 0.78);
        pendingSound = null;
    };

    const playSelectionSound = () => {
        if (!audioContext || audioContext.state !== "running") {
            pendingSelectionSound = true;
            return;
        }

        const start = audioContext.currentTime;
        const duration = 0.055;
        const frameCount = Math.ceil(audioContext.sampleRate * duration);
        const buffer = audioContext.createBuffer(1, frameCount, audioContext.sampleRate);
        const samples = buffer.getChannelData(0);
        const source = audioContext.createBufferSource();
        const filter = audioContext.createBiquadFilter();
        const gain = audioContext.createGain();

        for (let frame = 0; frame < frameCount; frame += 1) {
            const fade = 1 - frame / frameCount;
            samples[frame] = (Math.random() * 2 - 1) * fade * fade;
        }

        source.buffer = buffer;
        filter.type = "highpass";
        filter.frequency.value = 1350;
        filter.Q.value = 0.7;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.1, start + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);
        source.start(start);
        source.stop(start + duration);
        pendingSelectionSound = false;
    };

    const enableAudio = () => {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        audioContext ||= new AudioContextClass();
        if (audioContext.state === "suspended") {
            audioContext.resume().then(() => {
                if (pendingSound) playMotorSound(pendingSound);
                if (pendingSelectionSound) playSelectionSound();
            }).catch(() => {});
        } else {
            if (pendingSound) playMotorSound(pendingSound);
            if (pendingSelectionSound) playSelectionSound();
        }
    };

    const setDoors = (open) => {
        if (doorsOpen === open) return;
        doorsOpen = open;
        doorArea.classList.toggle("is-open", open);
        hospital.classList.toggle("doors-open", open);
        playMotorSound(open ? "open" : "close");
    };

    hospital.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "touch") setDoors(true);
    });

    hospital.addEventListener("pointerleave", (event) => {
        if (event.pointerType !== "touch") setDoors(false);
    });

    hospital.addEventListener("pointerdown", (event) => {
        enableAudio();
    }, { passive: true });

    hospital.addEventListener("click", (event) => {
        const link = event.target.closest(".quick-button");
        if (!link) return;

        event.preventDefault();
        enableAudio();
        playSelectionSound();
        window.setTimeout(() => window.location.assign(link.href), 180);
    });

    entrance.addEventListener("pointerdown", (event) => {
        if (event.pointerType !== "touch" || event.target.closest("a, button")) return;
        setDoors(!doorsOpen);
    });

    hospital.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        if (event.target.closest("a, button")) return;
        event.preventDefault();
        enableAudio();
        setDoors(!doorsOpen);
    });
})();
