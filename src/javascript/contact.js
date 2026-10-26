document.addEventListener('DOMContentLoaded', () => {
    const contactsForm = document.querySelector('.contacts-page-form');

    if (contactsForm) {
        contactsForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Отменяем стандартную отправку на сервер

            // 1. Собираем данные из полей формы в один объект
            const newRequest = {
                id: Date.now(), // Уникальный ID заявки по таймстампу
                date: new Date().toLocaleString('ru-RU'), // Дата и время отправки
                name: document.getElementById('c-name').value.trim(),
                phone: document.getElementById('c-phone').value.trim(),
                email: document.getElementById('c-email').value.trim(),
                message: document.getElementById('c-msg').value.trim()
            };

            // 2. Достаем старые заявки из localStorage. Если их нет, создаем пустой массив []
            let existingRequests = [];
            const savedData = localStorage.getItem('contacts_requests');
            
            if (savedData) {
                try {
                    existingRequests = JSON.parse(savedData);
                    // Проверяем, что в памяти действительно массив, на случай сбоев
                    if (!Array.isArray(existingRequests)) {
                        existingRequests = [];
                    }
                } catch (error) {
                    console.error('Ошибка чтения из localStorage, создаем чистый массив:', error);
                    existingRequests = [];
                }
            }

            // 3. Добавляем новую заявку в массив (push добавляет в конец)
            existingRequests.push(newRequest);

            // 4. Сохраняем обновленный массив обратно в localStorage, превратив его в строку
            localStorage.setItem('contacts_requests', JSON.stringify(existingRequests));

            // 5. Уведомляем пользователя и очищаем форму
            alert('Спасибо! Ваша заявка успешно сохранена в базу данных.');
            contactsForm.reset();

            // При желании можно редиректнуть на главную, как раньше:
            // window.location.href = 'index.html';
        });
    }
});