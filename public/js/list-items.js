const removeListItem = (event) => {
  // Changing Local Storage
  let arr = JSON.parse(localStorage.getItem("last-searched"));
  const stringToBeRemoved = event.target.previousElementSibling.innerHTML;
  if (arr.includes(stringToBeRemoved)) {
    arr = arr.filter(filterItem);
    function filterItem(item) {
      return item != stringToBeRemoved;
    }
    localStorage.setItem("last-searched", JSON.stringify(arr));
  }
  event.target.parentElement.remove();
};

const addToInput = (event) => {
  event.stopPropagation();
  if (event.target.classList.contains("list-group-item")) {
    document.querySelector(".custom-search-input").value =
      event.target.children[0].innerHTML;
  } else {
    document.querySelector(".custom-search-input").value =
      event.target.innerHTML;
  }
};
