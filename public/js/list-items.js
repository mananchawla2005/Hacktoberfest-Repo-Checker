const removeListItem = (event) => {
    console.log("removing element")
    // Changing Local Storage
    let arr = JSON.parse(localStorage.getItem("last-searched"))
    console.log(arr)
    const stringToBeRemoved = event.target.previousElementSibling.innerHTML
    if(arr.includes(stringToBeRemoved)) {
       arr =  arr.filter(filterItem)
        function filterItem(item) {
            return item != stringToBeRemoved
        }
        console.log(arr)
        localStorage.setItem("last-searched", JSON.stringify(arr))
    }
    event.target.parentElement.remove()
}