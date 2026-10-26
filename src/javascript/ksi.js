document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.nav__link');
    const tabContents = document.querySelectorAll('.hero-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');

              
                tabButtons.forEach(btn => btn.classList.remove('nav__link--active'));
                button.classList.add('nav__link--active');

              
                tabContents.forEach(content => {
                    content.classList.remove('hero-content--active');
                });

                const activeContent = document.getElementById(`tab-${targetTab}`);
                if (activeContent) {
                    activeContent.classList.add('hero-content--active');
                }
            });
        });
    }
});