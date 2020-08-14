const main = document.querySelector('main')

let donuts = []
let votes = []

if(!localStorage.getItem("voterId")){
  localStorage.setItem("voterId", String(Math.random()))
}

const voterId = localStorage.getItem("voterId")

const fetchVotes = async () => {
  const url = `/votes`;
  const response = await fetch(url)
  const result = await response.json()
  votes = result
}

const fetchDonuts = async () => {
  const response = await fetch("https://donut-of-the-day.herokuapp.com/donuts")
  const result = await response.json()
  donuts = result
  await fetchVotes()
  const fragments =  donuts.map(renderDonut)
  main.innerHTML= ""
  main.prepend(...fragments)
}

const voteForDonut = async (event) => {
  const theButtonThatGotClicked = event.currentTarget
  const theClosestDonut = theButtonThatGotClicked.closest(".donut")
  const donutId = theClosestDonut.dataset.donut
  const url = `/votes`;
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ voter:voterId, donut:donutId }),
  });
  await fetchVotes()
  const fragments =  donuts.map(renderDonut)
  main.innerHTML= ""
  main.prepend(...fragments)
}

const renderDonut = (donut) => {
  const count = (votes.find(vote => vote.donut === donut.id) || {count:0})
  const html =`
    <div class="donut" data-donut=${donut.id}>      
      <img src=${donut.image} alt=${donut.name} />
      <h2 class="vote-count">${count.count}</h2>
      <button>${donut.name}</button>
    </div>
  `
  const fragment = document.createRange().createContextualFragment(html) 
  const button = fragment.querySelector("button")
  button.addEventListener("click", voteForDonut)
  return fragment
}

fetchDonuts()
