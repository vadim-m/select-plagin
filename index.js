import { Select } from "./select/select";
import "./select/style.scss";

// передаем в констурктор класса 2 параметра - селектор элемента и объект разлиных настроек
const select = new Select("#select", {
  // опции, которые мы передаем для конструктора Select
  placeholder: "Выберите элемент:",
  // selectedId: "2", // элемент по умолчанию, просто как доп фишка
  data: [
    { id: "1", value: "React" },
    { id: "2", value: "Vue" },
    { id: "3", value: "Angular" },
    { id: "4", value: "Next" },
    { id: "5", value: "Nest" },
    { id: "6", value: "JS" },
  ],
});

window.s = select;
