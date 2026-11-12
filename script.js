// PythonClass: обработка пользовательских событий и обновление элементов страницы.

// 1. Переключение светлой и тёмной темы.
const themeButton = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

function updateThemeButton() {
  const isDark = document.body.classList.contains('dark-theme');
  themeIcon.textContent = isDark ? '☀' : '☾';
  themeButton.setAttribute('aria-pressed', String(isDark));
  themeButton.setAttribute('aria-label', isDark ? 'Включить светлую тему' : 'Включить тёмную тему');
}

themeButton.addEventListener('click', function () {
  document.body.classList.toggle('dark-theme');
  updateThemeButton();
});

// 2. Данные конструкций Python и отображение карточек.
// Объекты содержат заголовок, текст, пример и поисковые теги каждой конструкции.
const initialArticles = [
  {
    id: 1, operator: 'and', className: 'operation-and', sign: 'x=', code: 'VAR',
    title: 'Переменные', subtitle: 'Хранение данных', formula: 'x = 10',
    text: 'Переменная хранит значение: число, строку или список. Создаётся присваиванием: имя = значение. Можно менять в любой момент. Python сам определяет тип данных.',
    example: 'age = 14  # Возраст ученика\nname = "Аня"  # Имя в кавычках',
    tags: '#переменные #variables #присваивание #данные #хранение'
  },
  {
    id: 2, operator: 'or', className: 'operation-or', sign: 'for', code: 'LOOP',
    title: 'Цикл for', subtitle: 'Повтор по элементам', formula: 'for i in range(5)',
    text: 'Цикл for проходит по списку или диапазону. range(n) создаёт числа от 0 до n-1. Отступ показывает тело цикла. Используй, когда знаешь число повторов.',
    example: 'for i in range(3):\n    print(i)  # Выведет 0, 1, 2',
    tags: '#цикл #for #range #повтор #итерация #список'
  },
  {
    id: 3, operator: 'not', className: 'operation-not', sign: 'if', code: 'IF',
    title: 'Условие if', subtitle: 'Проверка условий', formula: 'if x > 0:',
    text: 'Условие проверяет истинность выражения. Если True — выполняется блок после двоеточия. else — для случая False. elif — для дополнительных проверок.',
    example: 'if age >= 18:\n    print("Взрослый")\nelse:\n    print("Ребёнок")',
    tags: '#условие #if #else #elif #проверка #сравнение'
  },
  {
    id: 4, operator: 'xor', className: 'operation-xor', sign: '[ ]', code: 'LIST',
    title: 'Списки', subtitle: 'Коллекции элементов', formula: 'nums = [1, 2, 3]',
    text: 'Список хранит несколько элементов в порядке. Доступ по индексу: nums[0] — первый элемент. Можно добавлять .append(), удалять .remove() и менять элементы.',
    example: 'fruits = ["яблоко", "банан"]\nfruits.append("апельсин")',
    tags: '#список #list #массив #коллекция #индекс #append'
  },
  {
    id: 5, operator: 'implies', className: 'operation-implies', sign: 'def', code: 'FUNC',
    title: 'Функции', subtitle: 'Блоки кода', formula: 'def hello():',
    text: 'Функция — именованный блок кода, который можно вызывать много раз. def создаёт функцию. Параметры передаются в скобках. return возвращает результат.',
    example: 'def sum(a, b):\n    return a + b\nprint(sum(5, 3))',
    tags: '#функции #def #return #параметры #вызов #код'
  },
  {
    id: 6, operator: 'equiv', className: 'operation-equiv', sign: 'while', code: 'WHILE',
    title: 'Цикл while', subtitle: 'Повтор по условию', formula: 'while x < 10:',
    text: 'Цикл while повторяется, пока условие истинно. Будь осторожен: бесконечный цикл зависнет. Используй, когда не знаешь точное число повторов.',
    example: 'count = 0\nwhile count < 3:\n    print(count)\n    count += 1',
    tags: '#цикл #while #условие #повтор #бесконечный'
  }
];

const postsContainer = document.querySelector('#postsContainer');
const searchInput = document.querySelector('#searchInput');
const searchCount = document.querySelector('#search-count');
const noResults = document.querySelector('#no-results');
const articleLikes = {}; // Счётчики сохраняются при повторной отрисовке после поиска.

function renderArticles(articlesArray) {
  // Очищаем контейнер перед перерисовкой карточек.
  postsContainer.innerHTML = '';

  articlesArray.forEach(function (article) {
    const likes = articleLikes[article.id] || 0;
    const articleHtml = `
      <article class="operation-card ${article.className}" data-operator="${article.operator}">
        <div class="operation-top">
          <span class="operation-symbol" aria-hidden="true">${article.sign}</span>
          <span class="operation-code">${article.code}</span>
        </div>
        <h3>${article.title} <span>${article.subtitle}</span></h3>
        <p class="article-text short" id="article-text-${article.id}">${article.text}</p>
        <button class="read-more-btn" type="button" aria-controls="article-text-${article.id}" aria-expanded="false">Читать далее ↓</button>
        <div class="formula">${article.formula}</div>
        <div class="operation-example"><span>ПРИМЕР</span><p>${article.example}</p></div>
        <footer class="operation-footer">
          <span class="operation-tags">${article.tags}</span>
          <button class="like-btn" type="button" data-id="${article.id}" aria-label="Лайк: ${article.title}">
            ♥ Лайк (<span class="like-count">${likes}</span>)
          </button>
        </footer>
      </article>`;
    postsContainer.insertAdjacentHTML('beforeend', articleHtml);
  });

  // Подключаем обработчики к новым карточкам.
  const likeButtons = postsContainer.querySelectorAll('.like-btn');
  likeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const articleId = button.dataset.id;
      articleLikes[articleId] = (articleLikes[articleId] || 0) + 1;
      button.querySelector('.like-count').textContent = String(articleLikes[articleId]);
      button.classList.add('is-liked');
    });
  });

  const readMoreButtons = postsContainer.querySelectorAll('.read-more-btn');
  readMoreButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      // Меняем CSS-класс short для сворачивания текста.
      const textBlock = button.previousElementSibling;
      textBlock.classList.toggle('short');
      const isShort = textBlock.classList.contains('short');
      button.textContent = isShort ? 'Читать далее ↓' : 'Свернуть ↑';
      button.setAttribute('aria-expanded', String(!isShort));
    });
  });

  searchCount.textContent = 'Показано: ' + articlesArray.length + ' из ' + initialArticles.length;
  noResults.hidden = articlesArray.length !== 0;
}

// Живой поиск по названию, тексту, примеру и тегам.
searchInput.addEventListener('input', function (event) {
  const searchText = event.target.value.toLowerCase().trim();
  // Точный поиск ключевых слов
  const exactOperators = { 'переменные': 'and', 'цикл': 'or', 'условие': 'not', 'список': 'xor', 'функция': 'implies', 'while': 'equiv' };
  const filteredArticles = initialArticles.filter(function (article) {
    if (exactOperators[searchText]) {
      return article.operator === exactOperators[searchText];
    }
    const inTitle = article.title.toLowerCase().includes(searchText);
    const inText = article.text.toLowerCase().includes(searchText) || article.example.toLowerCase().includes(searchText);
    const inTags = article.tags.toLowerCase().includes(searchText) || article.subtitle.toLowerCase().includes(searchText);
    return inTitle || inText || inTags;
  });
  renderArticles(filteredArticles);
});

renderArticles(initialArticles);

// 3. Python калькулятор и таблица значений.
const operatorSelect = document.querySelector('#operator-select');
const buttonA = document.querySelector('#value-a');
const buttonB = document.querySelector('#value-b');
const variableB = document.querySelector('#variable-b');
const expressionElement = document.querySelector('#result-expression');
const resultElement = document.querySelector('#result-value');
const resultBox = document.querySelector('.result-box');
const explanationElement = document.querySelector('#result-explanation');
const resultHeading = document.querySelector('#result-heading');
const bHeading = document.querySelector('#b-heading');
const tableBody = document.querySelector('#truth-table-body');
const resetTrainerButton = document.querySelector('#reset-trainer');

let valueA = 10;
let valueB = 5;

const operationSettings = {
  and: { sign: '+', explanation: 'Сложение: складываем два числа и получаем их сумму.' },
  or: { sign: '−', explanation: 'Вычитание: отнимаем второе число от первого.' },
  not: { sign: '×', explanation: 'Умножение: перемножаем два числа. Переменная y тоже нужна.' },
  xor: { sign: '/', explanation: 'Деление: делим первое число на второе (целая часть).' },
  implies: { sign: '**', explanation: 'Степень: возводим первое число в степень второго.' },
  equiv: { sign: '%', explanation: 'Остаток: находим остаток от деления первого на второе.' }
};

function calculate(operator, a, b) {
  switch (operator) {
    case 'and': return a + b;
    case 'or': return a - b;
    case 'not': return a * b;
    case 'xor': return Math.floor(a / b);
    case 'implies': return Math.pow(a, b);
    case 'equiv': return a % b;
    default: return 0;
  }
}

function updateBitButton(button, value) {
  button.querySelector('strong').textContent = String(value);
  button.classList.toggle('is-zero', value === 5);
  button.setAttribute('aria-pressed', String(value === 10));
}

function updateTrainer() {
  const operator = operatorSelect.value;
  const settings = operationSettings[operator];
  const unary = false; // Все операции используют два числа
  const result = calculate(operator, valueA, valueB);

  updateBitButton(buttonA, valueA);
  updateBitButton(buttonB, valueB);
  variableB.classList.toggle('is-inactive', unary);
  buttonB.disabled = unary;
  buttonB.setAttribute('aria-label', 'Изменить значение y');

  expressionElement.textContent = 'x ' + settings.sign + ' y';
  resultElement.textContent = String(result);
  resultBox.classList.toggle('is-true', result > 10);
  explanationElement.textContent = settings.explanation;
  resultHeading.textContent = 'x ' + settings.sign + ' y';
  bHeading.hidden = unary;

  tableBody.innerHTML = '';
  const combinations = [[5, 5], [5, 10], [10, 5], [10, 10]];
  combinations.forEach(function (pair) {
    const a = pair[0];
    const b = pair[1];
    const output = calculate(operator, a, b);
    const row = document.createElement('tr');
    if (a === valueA && b === valueB) row.classList.add('active-row');

    const aCell = document.createElement('td');
    aCell.textContent = String(a);
    row.appendChild(aCell);

    const bCell = document.createElement('td');
    bCell.textContent = String(b);
    row.appendChild(bCell);

    const resultCell = document.createElement('td');
    resultCell.textContent = String(output);
    if (output > 10) resultCell.classList.add('truth-one');
    row.appendChild(resultCell);
    tableBody.appendChild(row);
  });
}

buttonA.addEventListener('click', function () {
  valueA = valueA === 10 ? 5 : 10;
  updateTrainer();
});
buttonB.addEventListener('click', function () {
  valueB = valueB === 5 ? 10 : 5;
  updateTrainer();
});
operatorSelect.addEventListener('change', updateTrainer);
resetTrainerButton.addEventListener('click', function () {
  valueA = 10;
  valueB = 5;
  operatorSelect.value = 'and';
  updateTrainer();
});
updateTrainer();

// 4. Проверочный тест по Python.
const questions = [
  { question: 'Чему равно 10 + 5 в Python?', options: ['15', '105', '10 + 5'], correct: 0, explanation: 'Оператор + складывает числа: 10 + 5 = 15.' },
  { question: 'Как создать переменную с именем age и значением 14?', options: ['age == 14', 'age = 14', 'var age = 14'], correct: 1, explanation: 'Используй = для присваивания: имя = значение.' },
  { question: 'Что выведет print(type(3.14))?', options: ['int', 'float', 'str'], correct: 1, explanation: 'Число 3.14 — это дробное число, тип float.' },
  { question: 'Какой цикл используется для точного числа повторов?', options: ['while', 'for', 'if'], correct: 1, explanation: 'Цикл for проходит по списку или диапазону range().' },
  { question: 'Что делает функция range(3)?', options: ['Создаёт [0, 1, 2]', 'Создаёт [1, 2, 3]', 'Повторяет 3 раза'], correct: 0, explanation: 'range(n) создаёт числа от 0 до n-1: range(3) → 0, 1, 2.' },
  { question: 'Как обозначается блок кода в Python?', options: ['Фигурными скобками {}', 'Отступами', 'Словом begin/end'], correct: 1, explanation: 'Python использует отступы (обычно 4 пробела) для блоков.' },
  { question: 'Что напишет print("Привет" + "Мир")?', options: ['ПриветМир', 'Привет Мир', 'Ошибка'], correct: 0, explanation: 'Оператор + склеивает строки без пробела.' },
  { question: 'Как начать комментарий в Python?', options: ['//', '/*', '#'], correct: 2, explanation: 'Комментарий в Python начинается с символа #.' }
];

const questionScreen = document.querySelector('#quiz-question-screen');
const resultScreen = document.querySelector('#quiz-result-screen');
const questionTitle = document.querySelector('#quiz-question');
const answerList = document.querySelector('#quiz-answers');
const quizCounter = document.querySelector('#quiz-counter');
const quizProgress = document.querySelector('.quiz-progress');
const quizProgressBar = document.querySelector('#quiz-progress-bar');
const quizFeedback = document.querySelector('#quiz-feedback');
const quizCheck = document.querySelector('#quiz-check');
const quizNext = document.querySelector('#quiz-next');
const quizScoreLabel = document.querySelector('#quiz-score');
const quizMessage = document.querySelector('#quiz-message');
const quizRestart = document.querySelector('#quiz-restart');

let questionIndex = 0;
let score = 0;
let selectedAnswer = -1;
let answerChecked = false;

function updateQuizProgress(value) {
  quizProgressBar.style.width = String(value / questions.length * 100) + '%';
  quizProgress.setAttribute('aria-valuenow', String(value));
}

function showQuestion() {
  const item = questions[questionIndex];
  selectedAnswer = -1;
  answerChecked = false;
  quizCounter.textContent = 'Вопрос ' + (questionIndex + 1) + ' из ' + questions.length;
  questionTitle.textContent = item.question;
  answerList.innerHTML = '';
  quizFeedback.hidden = true;
  quizFeedback.classList.remove('is-error');
  quizCheck.hidden = false;
  quizCheck.disabled = true;
  quizNext.hidden = true;
  updateQuizProgress(questionIndex);

  item.options.forEach(function (option, index) {
    const optionButton = document.createElement('button');
    optionButton.type = 'button';
    optionButton.className = 'answer-option';
    optionButton.setAttribute('aria-pressed', 'false');

    const letter = document.createElement('span');
    letter.className = 'answer-letter';
    letter.textContent = ['А', 'Б', 'В', 'Г'][index];
    const text = document.createElement('span');
    text.textContent = option;
    optionButton.appendChild(letter);
    optionButton.appendChild(text);

    optionButton.addEventListener('click', function () {
      if (answerChecked) return;
      selectedAnswer = index;
      answerList.querySelectorAll('.answer-option').forEach(function (button, buttonIndex) {
        button.classList.toggle('is-selected', buttonIndex === index);
        button.setAttribute('aria-pressed', String(buttonIndex === index));
      });
      quizCheck.disabled = false;
    });
    answerList.appendChild(optionButton);
  });
}

quizCheck.addEventListener('click', function () {
  if (selectedAnswer === -1 || answerChecked) return;
  answerChecked = true;
  const item = questions[questionIndex];
  const isCorrect = selectedAnswer === item.correct;
  if (isCorrect) score++;

  answerList.querySelectorAll('.answer-option').forEach(function (button, index) {
    button.disabled = true;
    if (index === item.correct) button.classList.add('is-correct');
    if (index === selectedAnswer && !isCorrect) button.classList.add('is-wrong');
  });
  quizFeedback.textContent = (isCorrect ? 'Верно! ' : 'Пока не совсем. ') + item.explanation;
  quizFeedback.classList.toggle('is-error', !isCorrect);
  quizFeedback.hidden = false;
  quizCheck.hidden = true;
  quizNext.hidden = false;
  quizNext.textContent = questionIndex === questions.length - 1 ? 'Показать результат →' : 'Следующий вопрос →';
  updateQuizProgress(questionIndex + 1);
});

quizNext.addEventListener('click', function () {
  if (!answerChecked) return;
  questionIndex++;
  if (questionIndex < questions.length) {
    showQuestion();
  } else {
    questionScreen.hidden = true;
    resultScreen.hidden = false;
    quizCounter.textContent = 'Тест завершён';
    quizScoreLabel.textContent = String(score);
    quizMessage.textContent = score === 8 ? 'Отлично! Ты уверенно разбираешься в логических операциях.' :
      score >= 5 ? 'Хороший результат! Повтори сложные моменты в тренажёре.' :
      'Попробуй ещё раз: изучи карточки и поэкспериментируй с таблицами.';
  }
});

quizRestart.addEventListener('click', function () {
  questionIndex = 0;
  score = 0;
  resultScreen.hidden = true;
  questionScreen.hidden = false;
  showQuestion();
});

showQuestion();
