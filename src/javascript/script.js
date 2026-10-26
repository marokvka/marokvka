document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tabs__btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Удаляем активный класс со всех кнопок
            tabButtons.forEach(btn => btn.classList.remove('tabs__btn--active'));
            // 2. Скрываем все панели с контентом
            tabPanels.forEach(panel => panel.classList.remove('tab-panel--active'));

            // 3. Добавляем активный класс текущей кнопке
            button.classList.add('tabs__btn--active');
            
            // 4. Находим связанную панель по data-атрибуту и показываем её
            const targetTab = button.getAttribute('data-tab');
            const targetPanel = document.getElementById(targetTab);
            
            if (targetPanel) {
                targetPanel.classList.add('tab-panel--active');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.nav__link');
    const tabContents = document.querySelectorAll('.hero-content');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');

                // 1. Снимаем активный класс со всех кнопок и красим нужную
                tabButtons.forEach(btn => btn.classList.remove('nav__link--active'));
                button.classList.add('nav__link--active');

                // 2. Прячем старый контент и показываем новый
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
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('purchase-form');
    const productInput = document.getElementById('order-product');
    const nameInput = document.getElementById('order-name');
    const phoneInput = document.getElementById('order-phone');
    const messageInput = document.getElementById('order-message');

    // 1. Считываем название компрессора или оборудования из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('product');

    if (productName) {
        productInput.value = decodeURIComponent(productName);
    } else {
        productInput.value = 'Оборудование из каталога'; // Заглушка, если перешли без параметра
    }

    if (orderForm) {
        // Живая маска для ввода телефона (+7 (XXX) XXX-XX-XX)
        phoneInput.addEventListener('input', function (e) {
            let input = e.target.value.replace(/\D/g, '');
            if (input.startsWith('7') || input.startsWith('8')) input = input.substring(1);
            input = input.substring(0, 10);
            let formatted = '+7 ';
            if (input.length > 0) formatted += '(' + input.substring(0, 3);
            if (input.length >= 3) formatted += ') ' + input.substring(3, 6);
            if (input.length >= 6) formatted += '-' + input.substring(6, 8);
            if (input.length >= 8) formatted += '-' + input.substring(8, 10);
            e.target.value = input.length === 0 ? '' : formatted;
        });

        // Обработка отправки формы заказа
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const nameValue = nameInput.value.trim();
            const phoneValue = phoneInput.value.trim();
            const messageValue = messageInput.value.trim();
            const selectedProduct = productInput.value;

            nameInput.style.borderColor = '';
            phoneInput.style.borderColor = '';

            let hasError = false;

            // Валидация имени
            const nameRegex = /^[A-Za-zА-Яа-яЁё\s\-]{2,50}$/;
            if (!nameRegex.test(nameValue)) {
                nameInput.style.borderColor = 'red';
                alert('Пожалуйста, введите корректное имя (без цифр, минимум 2 символа)');
                hasError = true;
            }

            // Валидация телефона по длине маски
            if (phoneValue.length < 18) {
                phoneInput.style.borderColor = 'red';
                alert('Пожалуйста, введите номер телефона полностью');
                hasError = true;
            }

            if (hasError) return;

            // Формируем структуру объекта для таба "Заявки на покупку"
            const newPurchaseOrder = {
                id: Date.now(),
                name: nameValue,
                phone: phoneValue,
                message: `Заказ товара: "${selectedProduct}"\nКомментарий: ${messageValue || 'нет'}`,
                createdAt: new Date().toLocaleString('ru-RU')
            };

            // Сохраняем строго в purchase_list без перезаписи старых заказов
            const savedPurchases = JSON.parse(localStorage.getItem('purchase_list')) || [];
            savedPurchases.push(newPurchaseOrder);
            localStorage.setItem('purchase_list', JSON.stringify(savedPurchases));

            // Сброс формы и уведомление
            orderForm.reset();
            alert(`Заказ на "${selectedProduct}" успешно оформлен! Наш специалист свяжется с вами.`);
            
            // Возвращаем дефолтное значение readonly-полю после очистки формы
            productInput.value = selectedProduct;
        });
    }
});
