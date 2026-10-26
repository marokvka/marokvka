document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('purchase-form');
    const productInput = document.getElementById('order-product');
    const nameInput = document.getElementById('order-name');
    const phoneInput = document.getElementById('order-phone');
    const messageInput = document.getElementById('order-message');

  
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('product');

    if (productInput) {
        if (productName) {
            try {
             
                productInput.value = decodeURIComponent(productName.trim());
                console.log('Товар успешно подставлен:', productInput.value);
            } catch (error) {
              
                productInput.value = productName;
                console.error('Ошибка декодирования URL:', error);
            }
        } else {
          
            productInput.value = 'Оборудование из каталога';
            console.warn('Параметр "product" не найден в адресной строке URL.');
        }
    } else {
        console.error('Критическая ошибка: Элемент инпута с id="order-product" не найден на странице!');
    }

   
    if (orderForm) {
       
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

       
        orderForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const nameValue = nameInput.value.trim();
            const phoneValue = phoneInput.value.trim();
            const messageValue = messageInput.value.trim();
            const selectedProduct = productInput.value;

            nameInput.style.borderColor = '';
            phoneInput.style.borderColor = '';

            let hasError = false;

        
            const nameRegex = /^[A-Za-zА-Яа-яЁё\s\-]{2,50}$/;
            if (!nameRegex.test(nameValue)) {
                nameInput.style.borderColor = 'red';
                alert('Пожалуйста, введите корректное имя (без цифр, минимум 2 символа)');
                hasError = true;
            }

       
            if (phoneValue.length < 18) {
                phoneInput.style.borderColor = 'red';
                alert('Пожалуйста, введите номер телефона полностью');
                hasError = true;
            }

            if (hasError) return;

            const newPurchaseOrder = {
                id: Date.now(),
                name: nameValue,
                phone: phoneValue,
                message: `Заказ товара: "${selectedProduct}"\nКомментарий: ${messageValue || 'нет'}`,
                createdAt: new Date().toLocaleString('ru-RU')
            };

       
            const savedPurchases = JSON.parse(localStorage.getItem('purchase_list')) || [];
            savedPurchases.push(newPurchaseOrder);
            localStorage.setItem('purchase_list', JSON.stringify(savedPurchases));

           
            orderForm.reset();
            alert(`Заказ на "${selectedProduct}" успешно оформлен!`);
      
            productInput.value = selectedProduct;
        });
    }
});