const form = document.getElementById("repo-checker-form")
form.addEventListener("submit", event => {
    event.preventDefault();
    const URL = document.querySelector(".custom-search-input").value
    console.log(URL)
    fetchDataFromApi(URL);
})

const fetchDataFromApi = (URL) => {
    const finalURL = `/api?url=${URL}`
    fetch(finalURL)
    .then(res => res.json())
    .then(res => {
        modalDetails(res)
        toggleModal()
    })
    .catch(err => console.log(err))
}
const toggleModal = () => {
    const modal = document.getElementById("custom-modal")
    modal.classList.toggle("d-block")
}

const modalDetails = (data) => {
    const result = document.getElementById("modal-result")
    result.innerHTML = `This repository is <span class="fw-bold theme-light-orange-link">${data.isEligible ? "eligible" : "not eligible"}</span> for Hactoberfest 2021`
}
document.querySelector(".btn-close").addEventListener("click", toggleModal)