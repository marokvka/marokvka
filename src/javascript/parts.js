// Файл: js/parts.js

document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.parts-hero__img-wrapper');
    const partsButton = document.querySelector('.parts-hero__btn');

    // Легкий интерактив: картинки немного приподнимаются при наведении
    galleryItems.forEach(item => {
        item.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-5px)';
            item.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
            item.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.05)';
        });
    });

    if (partsButton) {
        partsButton.addEventListener('click', (e) => {
            console.log('Запрос каталога номеров деталей (part №) отправлен.');
        });
    }
});