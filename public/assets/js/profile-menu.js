const profilePublicBase = new URL('../../', document.currentScript.src);

class CliniboxProfileMenu extends HTMLElement {
    connectedCallback() {
        if (this.firstElementChild) return;

        this.innerHTML = `
            <details class="profile-menu">
                <summary>
                    <span class="profile-menu-mark" aria-hidden="true">
                        <svg viewBox="0 0 32 32" fill="none"><path d="M16 5v22M5 16h22" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>
                    </span>
                    <span class="profile-menu-name"><strong>CliniBox</strong><small></small></span>
                    <span class="profile-menu-chevron" aria-hidden="true"></span>
                </summary>
                <div class="profile-menu-options">
                    <a data-home>Ir al inicio</a>
                    <a data-profile>Mi perfil</a>
                    <form method="post"><button type="submit">Cerrar sesión</button></form>
                </div>
            </details>`;

        const menu = this.querySelector('details');
        const summary = this.querySelector('summary');
        const form = this.querySelector('form');
        summary.setAttribute('aria-label', 'CliniBox, mi cuenta');
        this.querySelector('small').textContent = this.dataset.label;
        this.querySelector('[data-home]').href = new URL('../', profilePublicBase);
        const profile = this.querySelector('[data-profile]');
        if (this.dataset.profile) {
            profile.href = new URL(this.dataset.profile, profilePublicBase);
        } else {
            profile.hidden = true;
        }
        form.action = new URL('logout', profilePublicBase);
        if (this.hasAttribute('data-guest')) {
            form.hidden = true;
            profile.hidden = false;
            profile.href = new URL('login', profilePublicBase);
            profile.textContent = 'Iniciar sesión';
        }

        document.addEventListener('click', (event) => {
            if (!this.contains(event.target)) menu.open = false;
        });
        menu.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape' || !menu.open) return;
            menu.open = false;
            summary.focus();
        });
    }
}

customElements.define('clinibox-profile-menu', CliniboxProfileMenu);
