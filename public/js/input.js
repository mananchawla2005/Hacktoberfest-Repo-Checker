const customInput = document.querySelector(".custom-search-input");
const lastSearched = document.querySelector(".last-searched");
const listItem = document.querySelectorAll(".list-group-item");
const listGroup = document.querySelector(".list-group");
customInput.addEventListener("focusin", () => {
  lastSearched.style.display = "block";
});
customInput.addEventListener("focusout", () => {
  setTimeout(() => {
    lastSearched.style.display = "none";
  }, 100);
});
const buildURLList = () => {
  listGroup.innerHTML = "";
  const arr = JSON.parse(localStorage.getItem("last-searched"));
  // console.log(typeof arr, arr)
  arr.forEach((item) => {
    listGroup.innerHTML += `
            <li class="list-group-item d-flex align-items-center justify-content-between rounded-pill mb-1 border-0" onclick="addToInput(event)">
                <p class="p-0 m-0">${item}</p>
                <p class="bi bi-x remove-button m-0 px-3" onclick="removeListItem(event)"></p>
            </li>
        `;
  });
};
if (localStorage.getItem("last-searched")) buildURLList();
