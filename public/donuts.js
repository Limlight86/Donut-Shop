const main = document.querySelector('main')

let donuts = []

if(!localStorage.getItem("voterId")){
  localStorage.setItem("voterId", String(Math.random()))
}

const voterId = localStorage.getItem("voterId")

const voteForDonut = async (event) => {
  const theButtonThatGotClicked = event.currentTarget
  const theClosestDonut = theButtonThatGotClicked.closest(".donut")
  const donutId = theClosestDonut.dataset.donut
  const url = `/votes`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ voter:voterId, donut:donutId }),
  });
}

const renderDonut = (donut) => {
  const html =`
    <div class="donut" data-donut=${donut.id}>      
      <img src=${donut.image} alt=${donut.name} />
      <h2 class="vote-count">0</h2>
      <button>${donut.name}</button>
    </div>
  `
  const fragment = document.createRange().createContextualFragment(html) 
  const button = fragment.querySelector("button")
  button.addEventListener("click", voteForDonut)
  return fragment
}

const fetchDonuts = async () => {
  const response = await fetch("https://donut-of-the-day.herokuapp.com/donuts")
  const result = await response.json()
  donuts = result
  const fragments =  donuts.map(renderDonut)
  main.innerHTML= ""
  main.prepend(...fragments)
}

fetchDonuts()
