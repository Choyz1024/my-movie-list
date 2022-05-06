// API URLs
const baseURL = 'https://movie-list.alphacamp.io'
const indexURL = baseURL + '/api/v1/movies/'
const posterURL = baseURL + '/posters/'

// data

const movies = []

// elements

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

// functions

const renderMovieList = (data) => {
  let rawHTML = ``
  data.forEach((item) => {
    rawHTML += `
        <div class="col-sm-3">
            <div class="mb-2">
                <div class="card">
                    <img
                        src="${posterURL + item.image}"
                        class="card-img-top"
                        alt="..."
                    />
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                    </div>
                    <div class="card-footer">
                        <button
                            class="btn btn-primary btn-show-movie"
                            data-bs-toggle="modal"
                            data-bs-target="#movie-modal"
                            data-id="${item.id}"
                        >
                            More
                        </button>
                        <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                    </div>
                </div>
            </div>
        </div>
        `
  })
  dataPanel.innerHTML = rawHTML
}

const showMovieModal = (id) => {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  modalTitle.textContent = ''
  modalDate.textContent = ''
  modalDescription.textContent = ''
  modalImage.innerHTML = ``
  axios
    .get(indexURL + id)
    .then((res) => {
      const data = res.data.results
      modalTitle.textContent = data.title
      modalDate.textContent = 'Release date: ' + data.release_date
      modalDescription.textContent = data.description
      modalImage.innerHTML = `
            <img src="${posterURL + data.image}" alt="movie-poster" class="img-fluid">
            `
    })
    .catch((err) => {
      console.log(err)
    })
}

const addToFavorite = (id) => {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  console.log(list)
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}
// start here

dataPanel.addEventListener('click', (e) => {
  if (e.target.matches('.btn-show-movie')) {
    showMovieModal(Number(e.target.dataset.id))
  } else if (e.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(e.target.dataset.id))
  }
})

searchForm.addEventListener('click', (e) => {
  e.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  if (e.target.matches('.btn')) {
    const filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))
    if (filteredMovies.length === 0) {
      return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
    }
    renderMovieList(filteredMovies)
  }
})

axios
  .get(indexURL)
  .then((response) => {
    movies.push(...response.data.results)
    renderMovieList(movies)
  })
  .catch((err) => console.log(err))
