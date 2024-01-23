import { GitHubUser } from './GitHubUser.js'

// classe que vai conter a lógica dos dados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    GitHubUser.search('emanueltavecia').then((user) =>
      console.log(`Made by ${user.name}. GitHub: ${user.login}`)
    )
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    this.verifyIfHasFavorites()
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username)
      if (userExists) {
        throw new Error('Usuário já cadastrado')
      }

      const user = await GitHubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    )
    this.entries = filteredEntries
    this.update()
    this.verifyIfHasFavorites()
    this.save()
  }

  verifyIfHasFavorites() {
    const noFavorites = this.root.querySelector('#no-favorites')
    if (this.entries.length === 0) {
      noFavorites.style.display = 'flex'
    } else {
      noFavorites.style.display = 'none'
    }
  }
}

// classe que vai renderizar o html
export class FavoriteView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector('header button')
    addButton.onclick = (event) => {
      event.preventDefault()
      const input = this.root.querySelector('header input')
      this.add(input.value)
      input.value = ''
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach((user) => {
      const row = this.createRow()

      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja remover esse favorito?')

        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
      this.verifyIfHasFavorites()
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
        <td class="user">
          <img
            src="https://github.com/emanueltavecia.png"
            alt="Imagem de emanueltavecia"
          />
          <a href="https://github.com/emanueltavecia" target="_blank">
            <p>Emanuel Tavecia</p>
            <span>emanueltavecia</span>
          </a>
        </td>
        <td class="repositories">0</td>
        <td class="followers">0</td>
        <td class="action"><button class="remove">Remove</button></td>
      `
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }
}
