const tbody = document.querySelector('tbody')
const favoritesElements = document.getElementsByTagName('tr')
const noFavorites = document.getElementById('no-favorites')
const favButton = document.querySelector('.input-wrapper button')
const input = document.querySelector('.input-wrapper input')

let favorites = []

verifyIfHasFavorites()

function verifyIfHasFavorites() {
  if (favorites.length === 0) {
    noFavorites.style.display = 'flex'
  } else {
    noFavorites.style.display = 'none'
  }
}

favButton.addEventListener('click', (event) => {
  event.preventDefault()
  if (input.value === '') return
  if (favorites.find((user) => user.login === input.value)) {
    alert('Usuário já adicionado')
    return
  }
  getGitHubUser(input.value)
  input.value = ''
})

function getGitHubUser(username) {
  fetch(`https://api.github.com/users/${username}`)
    .then((data) => data.json())
    .then((data) => createFavoriteRow(data))
}

function createFavoriteRow(user) {
  const userElement = document.createElement('tr')
  const { login, name, public_repos, followers } = user

  const rowModel = `
      <td class="user">
        <img
          src="https://github.com/${login}.png"
          alt="Imagem de ${name}"
        />
        <a target="_blank" href="https://github.com/${login}">
          <p>${name}</p>
          <span>/${login}</span>
        </a>
      </td>
      <td class="repositories">${public_repos}</td>
      <td class="followers">${followers}</td>
      <td class="action"><button>Remover</button></td>
    `
  userElement.innerHTML = rowModel
  tbody.append(userElement)
  favorites = [...favorites, user]
  verifyIfHasFavorites()
}
