/* =========================================
   CLINIBOX
   JAVASCRIPT PRINCIPAL
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* Inicializar iconos */

    lucide.createIcons();


    /* =====================================
       CARRITO
    ===================================== */

    let cartCount = 0;

    const cartCounter = document.querySelector(".cart-count");

    const addButtons = document.querySelectorAll(".add-cart");


    addButtons.forEach(button => {

        button.addEventListener("click", () => {

            cartCount++;

            cartCounter.textContent = cartCount;

            button.innerHTML = `
                <i data-lucide="check"></i>
            `;

            lucide.createIcons();

            setTimeout(() => {

                button.innerHTML = `
                    <i data-lucide="shopping-cart"></i>
                `;

                lucide.createIcons();

            }, 1200);

        });

    });


    /* =====================================
       HEADER AL HACER SCROLL
    ===================================== */

    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 30) {

            header.style.boxShadow =
                "0 5px 25px rgba(20, 70, 80, 0.08)";

        } else {

            header.style.boxShadow = "none";

        }

    });


    /* =====================================
       NAVEGACIÓN ACTIVA
    ===================================== */

    const sections = document.querySelectorAll("section[id]");

    const navLinks = document.querySelectorAll(".navigation a");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 120;

            if (window.scrollY >= sectionTop) {

                current = section.getAttribute("id");

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === `#${current}`) {

                link.classList.add("active");

            }

        });

    });

});