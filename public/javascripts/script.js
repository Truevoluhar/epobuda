let sort = document.querySelector('.sort-button');
let filter = document.querySelector('.filter-button');

sort.addEventListener("click", () => {
  let sortCont = document.querySelector(".sorting-container");

  if (sortCont.classList.contains('hidden')) {
    sortCont.classList.remove('hidden');
    sortCont.classList.add('flex');
    document.querySelector('.sortiraj-flex').classList.remove('hidden');
    document.querySelector('.sortiraj-flex').classList.add('flex');
  } else {
    sortCont.classList.remove('flex');
    sortCont.classList.add('hidden');
    document.querySelector('.sortiraj-flex').classList.remove('flex');
    document.querySelector('.sortiraj-flex').classList.add('hidden');
  }
});

filter.addEventListener("click", () => {
  let filterCont = document.querySelector(".filter-container");

  if (filterCont.classList.contains('hidden')) {
    filterCont.classList.remove('hidden');
    filterCont.classList.add('flex');
    document.querySelector('.filtriraj-flex').classList.remove('hidden');
    document.querySelector('.filtriraj-flex').classList.add('flex');
  } else {
    filterCont.classList.remove('flex');
    filterCont.classList.add('hidden');
    document.querySelector('.filtriraj-flex').classList.remove('flex');
    document.querySelector('.filtriraj-flex').classList.add('hidden');
  }
});