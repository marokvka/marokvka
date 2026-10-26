document.addEventListener('DOMContentLoaded', function() {
    const CORRECT_PASSWORD = 'admin777';

    const authGate = document.getElementById('auth-gate');
    const protectedContent = document.getElementById('protected-content');
    const authForm = document.getElementById('auth-form');
    const authPasswordInput = document.getElementById('auth-password');
    
    const feedbackContainer = document.getElementById('feedback-container');
    const purchaseContainer = document.getElementById('purchase-container');

    // Карта соответствия: Название товара -> Путь к его картинке из вашей верстки
    const productImages = {
        'Винтовой компрессор': 'src/img/DRF_IVR_tile_2.png',
        'Поршневой компрессор': 'src/img/Rectangle28.png',
        'Безмасляный компрессор': 'src/img/Rectangle292.png',
        'Решения для обработки воздуха': 'src/img/ADS_Adsorption_Dryers.png',
        'Управление воздухом': 'src/img/ICONS+box.png',
        'Масловлагоотделители KONTREC SEP': 'src/img/ALLE-KON-S.png',
        'Запасные части': 'src/img/Zap-Chasti_01-300x2171.png',
        'Винтовые блоки': 'src/img/Vintovye-bloki_01-1024x7631.png'
    };

    // Заглушка, если товар не распознан или это обычная форма обратной связи
    const defaultImage = 'src/img/ceccato-logo.png'; 

    function checkAuth() {
        const isAuth = sessionStorage.getItem('is_admin_authenticated');
        if (isAuth === 'true') {
            authGate.classList.add('u-hidden');
            protectedContent.classList.remove('u-hidden');
            renderAll();
        } else {
            authGate.classList.remove('u-hidden');
            protectedContent.classList.add('u-hidden');
        }
    }

    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (authPasswordInput.value === CORRECT_PASSWORD) {
            sessionStorage.setItem('is_admin_authenticated', 'true');
            checkAuth();
        } else {
            authPasswordInput.style.borderColor = 'red';
            alert('Неверный пароль!');
            authPasswordInput.value = '';
        }
    });

    const tabButtons = document.querySelectorAll('.tab-nav__btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            tabButtons.forEach(btn => btn.classList.remove('tab-nav__btn--active'));
            button.classList.add('tab-nav__btn--active');

            tabContents.forEach(content => {
                if (content.id === `tab-${targetTab}`) {
                    content.classList.remove('u-hidden');
                } else {
                    content.classList.add('u-hidden');
                }
            });
        });
    });

    // Функция поиска картинки по тексту сообщения/заказа
    function getProductImage(messageText) {
        // Ищем совпадение названия товара в строке сообщения заказа
        for (const key in productImages) {
            if (messageText.includes(key)) {
                return productImages[key];
            }
        }
        return defaultImage;
    }

    function renderList(storageKey, containerElement, isPurchase = false) {
        const listData = JSON.parse(localStorage.getItem(storageKey)) || [];

        if (listData.length === 0) {
            containerElement.innerHTML = `
                <div class="no-data-msg">
                    <p>Список ${isPurchase ? 'покупок' : 'обращений'} пуст.</p>
                </div>
            `;
            return;
        }

        containerElement.innerHTML = listData.reverse().map(item => {
            // Определяем картинку для текущей карточки
            const imgSrc = isPurchase ? getProductImage(item.message) : defaultImage;

            return `
                <div class="feedback-card ${isPurchase ? 'feedback-card--purchase' : ''}" data-id="${item.id}">
                    <div class="feedback-card__header">
                        <h3 class="feedback-card__title">${escapeHtml(item.name)}</h3>
                        <span class="feedback-card__date">${item.createdAt}</span>
                    </div>
                    <div class="feedback-card__body">
                        <!-- Добавлен блок с адаптивной картинкой товара -->
                        <div class="feedback-card__img-preview">
                            <img src="${imgSrc}" alt="Превью оборудования" onerror="this.src='${defaultImage}'">
                        </div>
                        <p class="feedback-card__item"><strong>Телефон:</strong> ${escapeHtml(item.phone)}</p>
                        <p class="feedback-card__item feedback-card__message">
                            <strong>${isPurchase ? 'Детали заказа:' : 'Вопрос:'}</strong><br>
                            ${escapeHtml(item.message)}
                        </p>
                    </div>
                    <div class="feedback-card__actions">
                        <button class="feedback-card__delete-btn" data-action="delete" data-key="${storageKey}">Удалить</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderAll() {
        renderList('feedback_list', feedbackContainer, false);
        renderList('purchase_list', purchaseContainer, true);
    }

    document.addEventListener('click', function(event) {
        if (event.target.dataset.action === 'delete') {
            const storageKey = event.target.dataset.key;
            const cardElement = event.target.closest('.feedback-card');
            const cardId = parseInt(cardElement.dataset.id, 10);

            if (confirm('Вы уверены, что хотите удалить эту запись?')) {
                let listData = JSON.parse(localStorage.getItem(storageKey)) || [];
                listData = listData.filter(item => item.id !== cardId);
                localStorage.setItem(storageKey, JSON.stringify(listData));
                renderAll();
            }
        }
    });

    function escapeHtml(text) {
        if (!text) return '';
        return text.toString()
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    checkAuth();
});
