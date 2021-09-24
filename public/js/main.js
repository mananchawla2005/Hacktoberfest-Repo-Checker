const themeTogglerButton = document.querySelector(".theme-toggler-button");
const themeTogglerIcon = document.querySelector(".theme-toggler-icon");
const theme = localStorage.getItem("theme");
if (theme) {
  // console.log("current theme is",theme)
  if (theme === "dark") {
    toggleClasses();
  }
}
themeTogglerButton.addEventListener("click", () => {
  toggleClasses();
});

function saveToLocalStorage(value) {
  localStorage.setItem("theme", value);
}
function toggleClasses() {
  const body = document.body;
  const searchButton = document.querySelector(".custom-search-button");
  const heroLogo = document.querySelector(".hacktoberfest-logo");
  const navLinks = document.querySelectorAll(".custom-link");
  const navbar = document.querySelector(".custom-nav");
  const modalContent = document.querySelector(".modal-content");
  const modalCloseButton = document.querySelector(".btn-close");
  modalContent.classList.toggle("bg-light");
  modalContent.classList.toggle("bg-dark");
  modalCloseButton.classList.toggle("theme-light-orange");
  modalCloseButton.classList.toggle("theme-dark-green");
  body.classList.toggle("bg-light");
  body.classList.toggle("bg-dark");
  searchButton.classList.toggle("theme-light-orange");
  searchButton.classList.toggle("theme-dark-green");
  navLinks.forEach((navLink) => {
    navLink.classList.toggle("theme-light-orange-link");
    navLink.classList.toggle("theme-dark-green-link");
  });
  themeTogglerButton.classList.toggle("theme-light-green");
  themeTogglerButton.classList.toggle("theme-dark-orange");
  navbar.classList.toggle("bg-light");
  navbar.classList.toggle("bg-dark");
  let currentTheme = heroLogo.dataset.theme;
  if (currentTheme === "light") {
    heroLogo.dataset.theme = "dark";
    heroLogo.src = "logoDark.svg";
  } else {
    heroLogo.dataset.theme = "light";
    heroLogo.src = "logoLight.svg";
  }
  currentTheme = heroLogo.dataset.theme;
  // console.log(currentTheme)
  saveToLocalStorage(currentTheme);
}


// Preloader
setTimeout(() => {
  document.querySelector(".preloader").classList.toggle("d-block")
  document.querySelector(".preloader").classList.toggle("d-none")
},1500)