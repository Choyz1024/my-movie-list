// API URLs
const baseURL = 'https://movie-list.alphacamp.io'
const indexURL = baseURL + '/api/v1/movies/'
const posterURL = baseURL + '/posters/'

// data

const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

// elements

const dataPanel = document.querySelector('#data-panel')

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

// start here

dataPanel.addEventListener('click', (e) => {
  if (e.target.matches('.btn-show-movie')) {
    showMovieModal(e.target.dataset.id)
  } else if (e.target.matches('.btn-add-favorite')) {
    addToFavorite(e.target.dataset.id)
  }
})

renderMovieList(movies)
