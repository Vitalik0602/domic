const TOKEN = '7990942936:AAG1lRKSS2r1Q2_svd2L41ngtp43LBpFMeo';
const CHAT_ID = '-1002816551291';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TOKEN}`;

const messageSentSound = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', nav.classList.contains('active'));
        });
    }

    // Форма на главной странице
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formMessage = document.getElementById('formMessage');
            formMessage.textContent = 'Отправка...';

            const cottageSelect = document.getElementById('cottageSelect').value;
            const checkIn = document.getElementById('checkIn').value;
            const checkOut = document.getElementById('checkOut').value;
            const guests = document.getElementById('guests').value;
            const fullName = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;

            if (!cottageSelect || !checkIn || !checkOut || !guests || !fullName || !phone) {
                formMessage.textContent = '❌ Заполните все поля.';
                formMessage.style.animation = 'shake 0.5s';
                setTimeout(() => formMessage.style.animation = '', 500);
                return;
            }

            const message = `
🌊 *Новая бронь с главной страницы*  
Домик: ${cottageSelect}  
Дата заезда: ${checkIn}  
Дата выезда: ${checkOut}  
Гостей: ${guests}  
ФИО: ${fullName}  
Телефон: ${phone}  
Время заявки: 25.07.2025 14:46 (EDT)
            `;

            fetch(`${TELEGRAM_API_URL}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.ok) {
                        formMessage.textContent = '✅ Бронь отправлена!';
                        formMessage.style.color = 'green';
                        this.reset();
                        messageSentSound.play().catch(error => console.error('Error playing sound:', error));
                        setTimeout(() => {
                            formMessage.textContent = '';
                            formMessage.style.color = '';
                        }, 3000);
                    } else {
                        formMessage.textContent = `❌ Ошибка: ${result.description || 'Неизвестная ошибка'}`;
                        formMessage.style.color = 'red';
                    }
                })
                .catch(error => {
                    formMessage.textContent = `❌ Ошибка: ${error.message}`;
                    formMessage.style.color = 'red';
                    console.error('Ошибка:', error);
                });
        });
    }

    // Формы на страницах домиков
    const cottageForms = document.querySelectorAll('#cottageBookingForm');
    cottageForms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const formMessage = this.querySelector('#formMessage');
            formMessage.textContent = 'Отправка...';

            const checkIn = this.querySelector('#checkIn').value;
            const checkOut = this.querySelector('#checkOut').value;
            const guests = this.querySelector('#guests').value;
            const fullName = this.querySelector('#fullName').value;
            const phone = this.querySelector('#phone').value;
            const cottageName = this.closest('.car-details').querySelector('h1').textContent;

            if (!checkIn || !checkOut || !guests || !fullName || !phone) {
                formMessage.textContent = '❌ Заполните все поля.';
                formMessage.style.animation = 'shake 0.5s';
                setTimeout(() => formMessage.style.animation = '', 500);
                return;
            }

            const message = `
🌊 *Новая бронь с страницы домика*  
Домик: ${cottageName}  
Дата заезда: ${checkIn}  
Дата выезда: ${checkOut}  
Гостей: ${guests}  
ФИО: ${fullName}  
Телефон: ${phone}  
Время заявки: 25.07.2025 14:46 (EDT)
            `;

            fetch(`${TELEGRAM_API_URL}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            })
                .then(response => response.json())
                .then(result => {
                    if (result.ok) {
                        formMessage.textContent = '✅ Бронь отправлена!';
                        formMessage.style.color = 'green';
                        this.reset();
                        messageSentSound.play().catch(error => console.error('Error playing sound:', error));
                        setTimeout(() => {
                            formMessage.textContent = '';
                            formMessage.style.color = '';
                        }, 3000);
                    } else {
                        formMessage.textContent = `❌ Ошибка: ${result.description || 'Неизвестная ошибка'}`;
                        formMessage.style.color = 'red';
                    }
                })
                .catch(error => {
                    formMessage.textContent = `❌ Ошибка: ${error.message}`;
                    formMessage.style.color = 'red';
                    console.error('Ошибка:', error);
                });
        });
    });

    // Слайдер и модальное окно
    const carSlider = document.querySelector('.car-slider');
    if (carSlider) {
        const slides = document.querySelectorAll('.car-slide');
        const thumbnails = document.querySelectorAll('.car-slider-thumbnails .thumbnail');
        const indicators = document.querySelectorAll('.car-slider-indicators .indicator');
        const prevCar = document.getElementById('prevCar');
        const nextCar = document.getElementById('nextCar');
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalClose = document.querySelector('.modal-close');
        const modalPrev = document.querySelector('.modal-prev');
        const modalNext = document.querySelector('.modal-next');
        let currentIndex = 0;
        let autoSlideInterval;

        if (modal) modal.style.display = 'none';

        const updateSlider = (index) => {
            if (index >= 0 && index < slides.length) {
                carSlider.style.transform = `translateX(-${index * 100}%)`;
                slides.forEach((slide, i) => {
                    slide.setAttribute('aria-current', i === index ? 'true' : 'false');
                    slide.style.opacity = i === index ? '1' : '0';
                    slide.style.visibility = i === index ? 'visible' : 'hidden';
                });
                indicators.forEach((indicator, i) => indicator.classList.toggle('active', i === index));
                thumbnails.forEach((thumbnail, i) => thumbnail.classList.toggle('active', i === index));
                currentIndex = index;
            }
        };

        const startAutoSlide = () => {
            autoSlideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlider(currentIndex);
            }, 5000);
        };

        const stopAutoSlide = () => clearInterval(autoSlideInterval);

        if (slides.length > 0) {
            slides.forEach(slide => {
                slide.style.opacity = '0';
                slide.style.visibility = 'hidden';
            });
            slides[0].style.opacity = '1';
            slides[0].style.visibility = 'visible';
            updateSlider(0);
            startAutoSlide();
        }

        if (prevCar) prevCar.addEventListener('click', () => {
            stopAutoSlide();
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider(currentIndex);
            startAutoSlide();
        });

        if (nextCar) nextCar.addEventListener('click', () => {
            stopAutoSlide();
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider(currentIndex);
            startAutoSlide();
        });

        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                stopAutoSlide();
                updateSlider(index);
                startAutoSlide();
            });
        });

        slides.forEach((slide, index) => {
            slide.addEventListener('click', (e) => {
                const img = slide.querySelector('img');
                if (e.target === img) {
                    stopAutoSlide();
                    modalImage.src = img.src;
                    modalImage.alt = img.alt;
                    modal.style.display = 'flex';
                    modal.focus();
                    currentIndex = index;
                }
            });
        });

        if (modalClose) modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            startAutoSlide();
            if (prevCar) prevCar.focus();
        });

        if (modalPrev) modalPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            modalImage.src = slides[currentIndex].querySelector('img').src;
            modalImage.alt = slides[currentIndex].querySelector('img').alt;
        });

        if (modalNext) modalNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            modalImage.src = slides[currentIndex].querySelector('img').src;
            modalImage.alt = slides[currentIndex].querySelector('img').alt;
        });

        if (carSlider) {
            let touchStartX = 0;
            let touchEndX = 0;
            carSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoSlide();
            });

            carSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) {
                    currentIndex = (currentIndex + 1) % slides.length;
                    updateSlider(currentIndex);
                } else if (touchEndX - touchStartX > 50) {
                    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                    updateSlider(currentIndex);
                }
                startAutoSlide();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (modal && modal.style.display === 'flex') {
                if (e.key === 'ArrowLeft' && modalPrev) modalPrev.click();
                else if (e.key === 'ArrowRight' && modalNext) modalNext.click();
                else if (e.key === 'Escape' && modalClose) modalClose.click();
            }
        });

        if (modal) modal.addEventListener('click', (e) => {
            if (e.target === modal) modalClose.click();
        });

        carSlider.addEventListener('mouseenter', stopAutoSlide);
        carSlider.addEventListener('mouseleave', startAutoSlide);
    }
});
