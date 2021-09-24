const customInput = document.querySelector(".custom-search-input");
const lastSearched = document.querySelector(".last-searched");
const listItem = document.querySelectorAll(".list-group-item");
const listGroup = document.querySelector(".list-group");
customInput.addEventListener("focusin", () => {
  lastSearched.style.display = "block";
});
// customInput.addEventListener("focusout", () => {
//     lastSearched.style.display = "none"
// })
// listItem.forEach(item => {
//     listItem.addEventListener("mouseover", () => {
//         console.log("mouse over list item")
//     })
// })
// listGroup.addEventListener("mouseover", () => {
//     lastSearched.style.display = "block";
// })
const buildURLList = () => {
  listGroup.innerHTML = "";
  const arr = JSON.parse(localStorage.getItem("last-searched"));
  // console.log(typeof arr, arr)
  arr.forEach((item) => {
    listGroup.innerHTML += `
            <li class="list-group-item d-flex align-content-center justify-content-between rounded-pill mb-1 border-0">
                <span>${item}</span>
                <span class="bi bi-x remove-button" onclick="removeListItem(event)"></span>
            </li>
        `;
  });
};
if (localStorage.getItem("last-searched")) buildURLList();
