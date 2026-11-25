(() => {
    const root = document.documentElement;
    const storageKey = 'clinibox:profile-scale';
    const minimum = 65;
    const maximum = 150;
    let size = 100;

    const menu = document.createElement('details');
    menu.className = 'page-size-control';
    menu.innerHTML = `
        <summary aria-label="Ajustar tamaño de la página">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        </summary>
        <div class="page-size-panel" aria-label="Tamaño de la página" role="group">
            <button type="button" data-size="down">Reducir <span aria-hidden="true">−</span></button>
            <button type="button" data-size="up">Aumentar <span aria-hidden="true">+</span></button>
            <button type="button" data-size="reset">Restablecer <span aria-hidden="true">↺</span></button>
            <output aria-live="polite"></output>
        </div>`;
    document.body.append(menu);

    const summary = menu.querySelector('summary');
    const smaller = menu.querySelector('[data-size="down"]');
    const larger = menu.querySelector('[data-size="up"]');
    const output = menu.querySelector('output');
    const apply = (value) => {
        size = Math.max(minimum, Math.min(maximum, Math.round(value)));
        root.style.zoom = String(size / 100);
        menu.style.zoom = String(100 / size);
        smaller.disabled = size === minimum;
        larger.disabled = size === maximum;
        output.value = `Tamaño actual: ${size}%`;
    };

    let initial = 100;
    try {
        const shared = Number(localStorage.getItem(storageKey));
        const previousStore = Number(localStorage.getItem('cliniboxStoreZoomV3')) * 100;
        initial = shared || previousStore || 100;
    } catch {
        // El control se puede usar aunque el navegador bloquee el almacenamiento.
    }
    apply(Number.isFinite(initial) ? initial : 100);

    menu.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-size]');
        if (!button) return;
        apply({ down: size - 10, up: size + 10, reset: 100 }[button.dataset.size]);
        if (button.disabled) summary.focus();
        try {
            localStorage.setItem(storageKey, String(size));
        } catch {
            // El tamaño permanece activo durante esta visita.
        }
    });

    document.addEventListener('click', (event) => {
        if (!menu.contains(event.target)) menu.open = false;
    });
    menu.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !menu.open) return;
        event.preventDefault();
        menu.open = false;
        summary.focus();
    });
})();
