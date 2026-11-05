document.querySelectorAll('[data-confirm]').forEach((element) => {
    element.addEventListener('click', (event) => {
        if (!window.confirm(element.dataset.confirm)) {
            event.preventDefault();
        }
    });
});

document.querySelectorAll('[data-demo-action]').forEach((element) => {
    element.addEventListener('click', () => {
        const message = element.dataset.demoAction;
        window.alert(message);
    });
});
