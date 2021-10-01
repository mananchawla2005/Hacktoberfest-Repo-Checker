const removeListItem = (event) => {
  console.log("removing element");
  // Changing Local Storage
  let arr = JSON.parse(localStorage.getItem("last-searched"));
  console.log(arr);
  const stringToBeRemoved = event.target.previousElementSibling.innerHTML;
  if (arr.includes(stringToBeRemoved)) {
    arr = arr.filter(filterItem);
    function filterItem(item) {
      return item != stringToBeRemoved;
    }
    console.log(arr);
    localStorage.setItem("last-searched", JSON.stringify(arr));
  }
  event.target.parentElement.remove();
};

const addToInput = (event) => {
  event.stopPropagation();
  if (event.target.classList.contains("list-group-item")) {
    // console.log(event.target.children[0].innerHTML)
    document.querySelector(".custom-search-input").value =
      event.target.children[0].innerHTML;
  } else {
    // console.log(event.target.innerHTML)
    document.querySelector(".custom-search-input").value =
      event.target.innerHTML;
  }
};
