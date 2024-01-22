let favorites = document.getElementsByTagName('tr')
let noFavorites = document.getElementById('no-favorites')

if (favorites.length === 0) {
  noFavorites.style.display = 'flex'
} else {
  noFavorites.style.display = 'none'
}
