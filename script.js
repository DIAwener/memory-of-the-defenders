// боже, на эту парашу ушло часа 4
// с письмами разобрался вроде

let currentLetter = null; // текущее письмо, а то теряется
let filters = { year: '', front: '', militaryBranch: '' };

const letters = [
    {
        id: '1',
        authorName: 'Иван Петрович Соколов',
        authorInfo: 'Рядовой, 150-я стрелковая дивизия, 1943',
        year: 1942,
        front: 'Западный фронт',
        militaryBranch: 'Пехота',
        letterText: 'Дорогая Катюша!\n\nПишу тебе с передовой. Здесь очень холодно, но мы держимся. Немцы не пройдут, мы их остановим. Береги себя и нашу дочку Машеньку.\n\nЦелую крепко.\nТвой Ваня'
    },
    {
        id: '2',
        authorName: 'Александр Николаевич Волков',
        authorInfo: 'Лейтенант, командир танкового взвода, Герой Советского Союза',
        year: 1943,
        front: 'Курская дуга',
        militaryBranch: 'Танковые войска',
        letterText: 'Мама!\n\nНе волнуйся за меня. Наш экипаж прошёл уже сотни километров. Танк наш подбили, но мы все живы, получили новую машину. Скоро будет большое сражение.\n\nВерю, что вернусь домой с победой.\nТвой сын'
    },
    {
        id: '3',
        authorName: 'Мария Ивановна Козлова',
        authorInfo: 'Медсестра, 34-й медсанбат, награждена медалью',
        year: 1944,
        front: 'Белорусский фронт',
        militaryBranch: 'Медицинская служба',
        letterText: 'Милая мамочка!\n\nРаботы очень много, но я справляюсь. Сегодня спасли троих раненых бойцов. Когда вижу их улыбки, понимаю, что делаю важное дело.\n\nВойна скоро кончится, я это чувствую.\nЖди меня.\nТвоя Маша'
    },
    {
        id: '4',
        authorName: 'Сергей Дмитриевич Морозов',
        authorInfo: 'Старший сержант, снайпер, 62-я армия',
        year: 1942,
        front: 'Сталинградский фронт',
        militaryBranch: 'Пехота',
        letterText: 'Родные мои!\n\nДержим оборону в городе. За каждый дом идут бои. Наша позиция на заводе. Немцы близко, но мы не отступим.\n\nСталинград не сдадим.\nЭто я вам обещаю.'
    },
    {
        id: '5',
        authorName: 'Пётр Васильевич Леонов',
        authorInfo: 'Капитан, лётчик-истребитель, 16-й авиаполк',
        year: 1943,
        front: 'Центральный фронт',
        militaryBranch: 'Авиация',
        letterText: 'Любимая Лена!\n\nВчера сбил свой десятый самолёт противника. Командир представил к награде. Каждый раз, поднимаясь в небо, думаю о тебе и нашем сыне.\n\nВаши фотографии всегда со мной.\nПетя'
    }
];

let responses = [];

// инициализация
function init() {
    // грузим ответы
    responses = JSON.parse(localStorage.getItem('responses') || '[]');
    // заполняем фильтры
    populateFilters();
    // показываем случайное письмо
    getRandomLetter();
    
    console.log('init вызван, писем:', letters.length); // дебаг
}

// отображение письма
function displayLetter() {
    console.log('displayLetter вызван, currentLetter:', currentLetter); // дебаг
    
    if (!currentLetter) {
        console.error('currentLetter пустой!');
        return;
    }
    
    // заполняем данные
    document.getElementById('letterAuthor').textContent = currentLetter.authorName;
    document.getElementById('letterText').textContent = currentLetter.letterText;
    document.getElementById('letterInfo').textContent = currentLetter.authorInfo;

    // мета-информация
    const meta = `
        <div>${currentLetter.year} год</div>
        <div>${currentLetter.front}</div>
        <div>${currentLetter.militaryBranch}</div>
    `;
    document.getElementById('letterMeta').innerHTML = meta;
    
    // показываем карточку - исправлено!
    document.getElementById('letterCard').classList.remove('hidden');
    
    // показываем ответы если есть
    displayResponses();
    
    console.log('Письмо отображено:', currentLetter.authorName);
}

// случайное письмо
function getRandomLetter() {
    console.log('getRandomLetter вызван, filters:', filters);
    
    const filteredLetters = getFilteredLetters();
    console.log('Отфильтровано писем:', filteredLetters.length);
    
    // если ничего не найдено, берем все
    const available = filteredLetters.length > 0 ? filteredLetters : letters;

    if (available.length === 0) {
        console.warn('Нет доступных писем!');
        // показываем сообщение что ничего нет
        document.getElementById('noResults').classList.remove('hidden');
        document.getElementById('letterCard').classList.add('hidden');
        document.getElementById('responsesSection').classList.remove('active');
        return;
    }

    // скрываем сообщение
    document.getElementById('noResults').classList.add('hidden');
    // выбираем случайное
    const randomIndex = Math.floor(Math.random() * available.length);
    currentLetter = available[randomIndex];
    console.log('Выбрано письмо:', currentLetter.id, currentLetter.authorName);
    
    // показываем
    displayLetter();
}

// получение отфильтрованных писем
function getFilteredLetters() {
    console.log('Фильтры:', filters);
    
    return letters.filter(letter => {
        // фильтрация по году
        if (filters.year && letter.year.toString() !== filters.year) {
            console.log('Отфильтровано по году:', letter.year, '!=', filters.year);
            return false;
        }
        // фильтрация по фронту
        if (filters.front && letter.front !== filters.front) {
            console.log('Отфильтровано по фронту:', letter.front, '!=', filters.front);
            return false;
        }
        // фильтрация по роду войск
        if (filters.militaryBranch && letter.militaryBranch !== filters.militaryBranch) {
            console.log('Отфильтровано по роду войск:', letter.militaryBranch, '!=', filters.militaryBranch);
            return false;
        }
        // все ок
        console.log('Письмо прошло фильтры:', letter.id);
        return true;
    });
}

// заполнение фильтров
function populateFilters() {
    console.log('Заполняем фильтры...');
    
    // годы
    const years = [...new Set(letters.map(l => l.year))].sort();
    console.log('Доступные годы:', years);
    
    // фронты
    const fronts = [...new Set(letters.map(l => l.front))].sort();
    console.log('Доступные фронты:', fronts);
    
    // рода войск
    const branches = [...new Set(letters.map(l => l.militaryBranch))].sort();
    console.log('Доступные рода войск:', branches);

    const yearSelect = document.getElementById('yearFilter');
    yearSelect.innerHTML = '<option value="">Любой год</option>'; // очищаем
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });

    const frontSelect = document.getElementById('frontFilter');
    frontSelect.innerHTML = '<option value="">Любой фронт</option>'; // очищаем
    fronts.forEach(front => {
        const option = document.createElement('option');
        option.value = front;
        option.textContent = front;
        frontSelect.appendChild(option);
    });

    const branchSelect = document.getElementById('branchFilter');
    branchSelect.innerHTML = '<option value="">Любой род войск</option>'; // очищаем
    branches.forEach(branch => {
        const option = document.createElement('option');
        option.value = branch;
        option.textContent = branch;
        branchSelect.appendChild(option);
    });
    
    console.log('Фильтры заполнены');
}

// отображение ответов
function displayResponses() {
    if (!currentLetter) return;
    
    const letterResponses = responses.filter(r => r.letterId === currentLetter.id);
    console.log('Ответы для письма', currentLetter.id, ':', letterResponses.length);
    
    // если нет ответов, то и показывать нечего
    if (letterResponses.length === 0) {
        document.getElementById('responsesSection').classList.remove('active');
        return;
    }

    document.getElementById('responsesSection').classList.add('active');
    document.getElementById('responsesCount').textContent = letterResponses.length;

    const list = document.getElementById('responsesList');
    // рендерим ответы
    list.innerHTML = letterResponses.map(response => `
        <div class="response-item">
            <div class="response-meta">
                <span class="response-author">${response.authorName || 'Аноним'}</span>
                <span class="response-date">${new Date(response.createdAt).toLocaleDateString('ru-RU')}</span>
            </div>
            <p class="response-text">${response.responseText}</p>
        </div>
    `).join('');
}

// открытие модалки для ответа
function openResponseModal() {
    console.log('openResponseModal вызван, currentLetter:', currentLetter);
    
    if (!currentLetter) {
        alert('Сначала выберите письмо!');
        return;
    }
    
    // вроде работает, но иногда данные не подставляются
    document.getElementById('modalLetterAuthor').textContent = currentLetter.authorName;
    document.getElementById('modalLetterYear').textContent = `${currentLetter.year} год`;
    document.getElementById('responseModal').showModal(); // исправлено для <dialog>
    
    console.log('Модалка открыта');
}

// обновление фильтров
function applyFilters() {
    console.log('applyFilters вызван');
    
    // читаем значения фильтров
    filters.year = document.getElementById('yearFilter').value;
    filters.front = document.getElementById('frontFilter').value;
    filters.militaryBranch = document.getElementById('branchFilter').value;
    
    console.log('Новые фильтры:', filters);

    const filteredLetters = getFilteredLetters();
    console.log('Найдено писем:', filteredLetters.length);
    
    if (filteredLetters.length === 0) {
        // ничего не нашли
        document.getElementById('noResults').classList.remove('hidden');
        document.getElementById('letterCard').classList.add('hidden');
        document.getElementById('responsesSection').classList.remove('active');
    } else {
        // показываем что-то
        getRandomLetter();
    }
}

// отправка ответа
function submitResponse(event) {
    event.preventDefault();
    console.log('submitResponse вызван');

    const responseText = document.getElementById('responseText').value.trim();
    const authorName = document.getElementById('responseAuthor').value.trim();

    if (!responseText) {
        alert('Введите текст ответа!');
        return;
    }

    // создаем новый ответ
    const newResponse = {
        id: Date.now().toString(),
        letterId: currentLetter.id,
        responseText: responseText,
        authorName: authorName || undefined,
        createdAt: new Date().toISOString()
    };

    console.log('Новый ответ:', newResponse);
    
    // добавляем
    responses.push(newResponse);
    // сохраняем в локалсторадж
    localStorage.setItem('responses', JSON.stringify(responses));

    // закрываем модалку
    closeResponseModal();
    // показываем ответы
    displayResponses();
    
    alert('Ответ отправлен!');
}

// переключение фильтров
function toggleFilters() {
    const filtersDiv = document.getElementById('filters');
    filtersDiv.classList.toggle('active');
    console.log('Фильтры переключены, состояние:', filtersDiv.classList.contains('active'));
}

// сброс фильтров
function resetFilters() {
    console.log('Сброс фильтров');
    
    // сбрасываем
    filters = { year: '', front: '', militaryBranch: '' };
    // сбрасываем селекты
    document.getElementById('yearFilter').value = '';
    document.getElementById('frontFilter').value = '';
    document.getElementById('branchFilter').value = '';
    // показываем случайное письмо
    getRandomLetter();
}

// закрытие модалки
function closeResponseModal() {
    const modal = document.getElementById('responseModal');
    if (modal) {
        modal.close(); // исправлено для <dialog>
    }
    
    // очищаем форму
    document.getElementById('responseAuthor').value = '';
    document.getElementById('responseText').value = '';
    
    console.log('Модалка закрыта');
}

// обработчики событий для кнопок
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, навешиваем обработчики');
    
    // случайное письмо
    const randomBtn = document.querySelector('[data-action="random-letter"]');
    if (randomBtn) {
        randomBtn.addEventListener('click', getRandomLetter);
        console.log('Обработчик на кнопке случайного письма');
    }
    
    // переключение фильтров
    const toggleBtn = document.querySelector('[data-action="toggle-filters"]');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleFilters);
        console.log('Обработчик на кнопке фильтров');
    }
    
    // сброс фильтров
    const resetBtn = document.querySelector('[data-action="reset-filters"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
        console.log('Обработчик на кнопке сброса');
    }
    
    // открытие модалки ответа
    const openModalBtn = document.querySelector('[data-action="open-response"]');
    if (openModalBtn) {
        openModalBtn.addEventListener('click', openResponseModal);
        console.log('Обработчик на кнопке ответа');
    }
    
    // закрытие модалки
    const closeModalBtn = document.querySelector('[data-action="close-modal"]');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeResponseModal);
        console.log('Обработчик на кнопке закрытия модалки');
    }
    
    // форма ответа
    const responseForm = document.getElementById('responseForm');
    if (responseForm) {
        responseForm.addEventListener('submit', submitResponse);
        console.log('Обработчик на форме ответа');
    }
    
    // фильтры
    document.getElementById('yearFilter')?.addEventListener('change', applyFilters);
    document.getElementById('frontFilter')?.addEventListener('change', applyFilters);
    document.getElementById('branchFilter')?.addEventListener('change', applyFilters);
    
    // инициализация
    init();
    
    console.log('Все обработчики навешены');
});

// еще кое-что добавил
// костыль для модалки
const modal = document.getElementById('responseModal');
if (modal) {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeResponseModal();
        }
    });
}

// конец файла, теперь должно работать...
// ФИЛЬТРЫ НЕ РОБЯТ