const feedbackForm = document.querySelector('.feedback-page-form');
const nameInput = document.getElementById('page-name');
const phoneInput = document.getElementById('page-phone');

if (feedbackForm) {
    // --- 1. ЖИВАЯ МАСКА ДЛЯ ПОЛЯ ТЕЛЕФОНА ---
    // Автоматически форматирует ввод в вид +7 (XXX) XXX-XX-XX
    phoneInput.addEventListener('input', function (e) {
        let input = e.target.value.replace(/\D/g, ''); // Удаляем всё, кроме цифр
        
        // Если первая цифра 7 или 8, убираем её для корректной работы маски
        if (input.startsWith('7') || input.startsWith('8')) {
            input = input.substring(1);
        }
        
        // Обрезаем длину до 10 цифр (без учёта +7)
        input = input.substring(0, 10);
        
        let formatted = '+7 ';
        if (input.length > 0) {
            formatted += '(' + input.substring(0, 3);
        }
        if (input.length >= 3) {
            formatted += ') ' + input.substring(3, 6);
        }
        if (input.length >= 6) {
            formatted += '-' + input.substring(6, 8);
        }
        if (input.length >= 8) {
            formatted += '-' + input.substring(8, 10);
        }
        
        e.target.value = input.length === 0 ? '' : formatted;
    });

    // --- 2. ВАЛИДАЦИЯ ПРИ ОТПРАВКЕ ФОРМЫ ---
    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Стопаем отправку

        const nameValue = nameInput.value.trim();
        const phoneValue = phoneInput.value.trim();
        const messageValue = document.getElementById('page-message').value.trim();

        // Сбрасываем старые стили ошибок перед проверкой
        nameInput.style.borderColor = '';
        phoneInput.style.borderColor = '';

        let hasError = false;

        // Валидация имени (не менее 2 символов, только буквы и пробелы)
        const nameRegex = /^[A-Za-zА-Яа-яЁё\s\-]{2,50}$/;
        if (!nameRegex.test(nameValue)) {
            nameInput.style.borderColor = 'red';
            alert('Пожалуйста, введите корректное имя (минимум 2 символа, без цифр)');
            hasError = true;
        }

        // Валидация телефона (проверяем полную длину маски: +7 (999) 000-00-00 = 18 символов)
        if (phoneValue.length < 18) {
            phoneInput.style.borderColor = 'red';
            alert('Пожалуйста, введите номер телефона полностью в формате +7 (999) 000-00-00');
            hasError = true;
        }

        // Если нашли ошибку — прерываем выполнение кода и не сохраняем
        if (hasError) {
            return;
        }

        // --- 3. СОХРАНЕНИЕ В LOCALSTORAGE (если всё валидно) ---
        const newFeedbackItem = {
            id: Date.now(),
            name: nameValue,
            phone: phoneValue,
            message: messageValue || 'Сообщение отсутствует',
            createdAt: new Date().toLocaleString('ru-RU')
        };

        const savedFeedbacksList = JSON.parse(localStorage.getItem('feedback_list')) || [];
        savedFeedbacksList.push(newFeedbackItem);
        localStorage.setItem('feedback_list', JSON.stringify(savedFeedbacksList));

        // Очищаем форму и радуем пользователя
        feedbackForm.reset();
        alert('Заявка успешно валидирована и сохранена!');
    });
}