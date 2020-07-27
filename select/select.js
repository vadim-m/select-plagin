// фуннкция
const getTemplate = (data = [], placeholder, selectedId) => {
  // проверяем передали мы placeholder/если нет то текст по умолчанию.
  // `??` новый оператор для проверки на != null
  let text = placeholder ?? "Текст по умолчанию.";

  // забираем items из data для последущего рендера
  const items = data.map((item) => {
    let cls = ""; //пустой класс для отметки цветом выбранного эл-та по умолчанию. далее видно в if

    // если есть элемент, у которого совпадает id с selectedId меняем ему текст и добавляем класс
    if (item.id == selectedId) {
      text = item.value;
      cls = "select__item--selected";
    }

    return `<li class="select__item ${cls}" data-type="item" data-id ="${item.id}">${item.value}</li>`;
  });

  return `
    <div class="select__backdrop" data-type="backdrop"></div>
    <div class="select__input" data-type="input">
        <span data-type="value">${text}</span>
        <i class="fa fa-chevron-down" aria-hidden="true" data-type="arrow"></i>
      </div>
      <div class="select__dropdown">
        <ul class="select__list">
          ${items.join("")}
        </ul> 
      </div>
  `;
};

// экспортируем класс Селект (class Select - объявление класса)
export class Select {
  // метод constructor для создания и инициализации объектов, созданных, с помощью класса.
  constructor(selector, options) {
    // создаем переменную $el - типа дом нода корневого элемента с id #select
    this.$el = document.querySelector(selector);
    // получаем список селекторов
    this.options = options;
    this.selectedId = options.selectedId;

    //вызываем метод для рендера разметки в корневой элемент и его настройки
    this.#render();
    this.#setup();
  }

  // метод для отрисовки шаблона html в корневой элемент. # приватный метод!
  #render() {
    const { placeholder } = this.options;
    const { data } = this.options;
    const { selectedId } = this.options;
    this.$el.classList.add("select");
    this.$el.innerHTML = getTemplate(data, placeholder, selectedId);
  }

  // метод для настройки корневого элемента. добавляем динамики
  #setup() {
    this.clickHandler = this.clickHandler.bind(this); // байнд контекста this !??!
    this.$el.addEventListener("click", this.clickHandler);
    // получаем доступ к стрелке и тексту выбранного элемента
    this.$arrow = this.$el.querySelector('[data-type="arrow"]');
    this.$value = this.$el.querySelector('[data-type="value"]');
  }

  // метод для отработки кликов по элементу
  clickHandler(event) {
    const { type } = event.target.dataset;

    // если клик попал по инпуту или тексту в нем или по стрелке то вызывем метод смены класса toggle
    if (type === "input" || type === "arrow" || type === "value") {
      this.toggle();
    } else if (type === "item") {
      const id = event.target.dataset.id;
      this.select(id);
    } else if (type === "backdrop") {
      this.toggle();
    }
  }

  // геттер для проверки наличия класса у элемента $el
  get isOpen() {
    return this.$el.classList.contains("open");
  }

  // геттер для поиска выбранного элемента
  get current() {
    return this.options.data.find((item) => item.id === this.selectedId);
  }

  // метод для логики выбора элемента из списка
  select(id) {
    this.selectedId = id;

    // сначала удаляем все классы 'select__item--selected' для других элементов
    this.$el.querySelectorAll('[data-type="item"]').forEach((item) => {
      item.classList.remove("select__item--selected");
    });

    // потом устанавливаем класс для выбранного
    this.$el
      .querySelector(`[data-id='${this.selectedId}']`)
      .classList.add("select__item--selected");

    this.$value.textContent = this.current.value;
    this.close();
  }

  // метод для открытия/закрытия дроп меню
  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  // метод для открытия dropdown
  open() {
    this.$el.classList.add("open");
    this.$arrow.classList.add("fa--rotate");
  }

  // метод для закрытия dropdown
  close() {
    this.$el.classList.remove("open");
    this.$arrow.classList.remove("fa--rotate");
  }

  // метод для удаления addEveList
  destroy() {
    this.$el.removeEventListener("click", this.clickHandler);
    this.$el.innerHTML = '';
  }
}
