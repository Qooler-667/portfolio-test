const themeBtn = document.querySelector(".header__themes");
const body = document.body;

// 1. Функция для установки темы
const setTheme = (theme) => {
  if (theme === "white") {
    body.classList.add("white");
    localStorage.setItem("theme", "white");
  } else {
    body.classList.remove("white");
    localStorage.setItem("theme", "dark");
  }
};

// 2. Проверка сохраненной темы при загрузке (чтобы не было "прыжка" цветов)
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
}

// 3. Обработчик клика
themeBtn.addEventListener("click", () => {
  // Если класс 'white' есть — удаляем (станет dark), если нет — добавляем
  const newTheme = body.classList.contains("white") ? "dark" : "white";
  setTheme(newTheme);
});
// -----------------------------------
// Находим кнопку по классу
const langBtn = document.querySelector(".header__language");

// Проверяем, что кнопка существует, чтобы не было ошибки в консоли
if (langBtn) {
  langBtn.onclick = () => {
    langBtn.classList.toggle("is-en");

    // По желанию: выводим в консоль текущий язык для проверки
    const currentLang = langBtn.classList.contains("is-en") ? "EN" : "RU";
    console.log("Active language:", currentLang);
  };
}

// -----------------------------------
const burgerBtn = document.querySelector(".burger-btn");
const closeBtn = document.querySelector(".burger-exit");
const menuWrapper = document.querySelector(".burger-wrapper");
const burgerLinks = document.querySelectorAll(".burger__link");

// Общая функция для закрытия меню
const closeMenu = () => {
  menuWrapper.classList.remove("active");
  document.body.style.overflow = "";
};

// Открытие меню
burgerBtn.addEventListener("click", () => {
  menuWrapper.classList.add("active");
  document.body.style.overflow = "hidden";
});

// Закрытие по клику на кнопку выхода
closeBtn.addEventListener("click", closeMenu);

// Закрытие по клику на фон
menuWrapper.addEventListener("click", (e) => {
  if (e.target === menuWrapper) {
    closeMenu();
  }
});

// Закрытие по клику на любую ссылку в меню
burgerLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// -----------------------------------
const arrowBtn = document.querySelector(".arrow-icon");

window.addEventListener("scroll", () => {
  // Если прокрутили больше 300px, добавляем класс 'show'
  if (window.scrollY > 300) {
    arrowBtn.classList.add("show");
  } else {
    arrowBtn.classList.remove("show");
  }
});

// -----------------------------------

const menuLinks = document.querySelectorAll(".header__menu-link");

menuLinks.forEach((link) => {
  link.addEventListener("click", function () {
    // Удаляем active у того, у кого он сейчас есть
    document
      .querySelector(".header__menu-link.activeLink")
      ?.classList.remove("activeLink");

    // Добавляем active текущей ссылке
    this.classList.add("activeLink");
  });
});
