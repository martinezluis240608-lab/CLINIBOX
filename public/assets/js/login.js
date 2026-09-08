document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       SELECCIÓN DE ROL
    ====================================== */

    const roleButtons =
        document.querySelectorAll(".role-button");

    const roleInput =
        document.getElementById("rol");


    roleButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            roleButtons.forEach(function (item) {

                item.classList.remove("active");

            });


            button.classList.add("active");


            roleInput.value =
                button.dataset.role;

            // En el acceso demo el rol funciona como entrada rápida al panel.
            if (button.dataset.quickLogin === "true") {
                loginForm.requestSubmit();
            }

        });

    });


    /* =====================================
       MOSTRAR / OCULTAR CONTRASEÑA
    ====================================== */

    const password =
        document.getElementById("password");

    const passwordToggle =
        document.getElementById("passwordToggle");


    passwordToggle.addEventListener(
        "click",
        function () {

            if (password.type === "password") {

                password.type = "text";

                passwordToggle.textContent = "◉";

            } else {

                password.type = "password";

                passwordToggle.textContent = "◉";
            }

        }
    );


    /* =====================================
       MODO OSCURO
    ====================================== */

    const themeButton =
        document.getElementById("themeButton");


    themeButton.addEventListener(
        "click",
        function () {

            document.body.classList.toggle("dark");

        }
    );


    /* =====================================
       FORMULARIO
       
       TEMPORALMENTE SOLO VISUAL
    ====================================== */

    const loginForm =
        document.getElementById("loginForm");

    const loginMessage =
        document.getElementById("loginMessage");


    loginForm.addEventListener(
        "submit",
        function (event) {
            const rol =
                document.getElementById("rol").value;

            if (!rol) {
                event.preventDefault();
                loginMessage.textContent = "Selecciona un rol para continuar.";
                loginMessage.classList.add("show");
                return;
            }

            // El navegador envía el formulario al controlador PHP.
            loginMessage.classList.remove("show");

        }
    );

});
