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

            event.preventDefault();


            const correo =
                document.getElementById("correo").value.trim();

            const passwordValue =
                document.getElementById("password").value.trim();

            const rol =
                document.getElementById("rol").value;


            if (
                correo === "" ||
                passwordValue === ""
            ) {

                loginMessage.textContent =
                    "Completa todos los campos.";

                loginMessage.classList.add("show");

                return;
            }


            loginMessage.classList.remove("show");


            console.log("Correo:", correo);

            console.log("Rol:", rol);

            /*
                AQUÍ POSTERIORMENTE CONECTAREMOS
                EL LOGIN CON PHP Y MYSQL.
            */

            alert(
                "Interfaz funcionando.\n\n" +
                "Rol seleccionado: " + rol
            );

        }
    );

});