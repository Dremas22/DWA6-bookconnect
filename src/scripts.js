import { authors, genres, books, BOOKS_PER_PAGE } from './data.js'

/**
 * This variable holds a array of books
 * @type {string} matches 
 */

let matches = books;
let page = 1;
let range = [0, 36];

if (!books && !Array.isArray(books)) throw new Error('Source required')
if (!range && range.length < 2) throw new Error('Range must be an array with two numbers')

//--CREATE PREVIEW FUNCTION---// 

/**
 * THE AUTHOR PARAMETER VARIABLE WILL BE ACCESSING AUTHORS OBJECT VALUES
 * ID PARAMETER WILL BE USED AS AN OBJECT KEY TO ACCESS ARRAY BOOKS WHICH HAS NESTED ARRAY OBJECTS.
 * TITLE PARAMETER THAT WILL ACCESS ARRAY BOOKS BY BOOK NAME
 */

const listItems = document.querySelector('[data-list-items]')
function createPreview({ author, id, image, title }) {

    const preview = document.createElement('button');
    preview.classList.add('preview');
    preview.setAttribute('data-preview', id)

    preview.innerHTML = `<img class="preview__image" src=${image} alt=${title}>
    <div class="preview__content">
    <h3 class="preview__title">${title}</h3>
    <div class="preview__author">${author}</div>
    </div>`

    return preview
}

let extracted = books.slice(0, 36)
let fragment = document.createDocumentFragment();
for (const { author, image, title, id } of extracted) {
    const fragment = document.createDocumentFragment()

    let preview = createPreview({
        author,
        id,
        image,
        title
    })
    fragment.appendChild(preview)

}


const elements = books.slice(0, 36).map(({ author, id, image, title }) => {
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);
    element.innerHTML = `
      <img class="preview__image" src="${image}" />
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>
    `;
    return element;
});

listItems.append(...elements);


/**
 * CREATING FRAGMENTS THAT CONTAINING DOCUMENT OBJECT ELEMENTS FOR OBJECT GENRE AND OBJECT AUTHOR
 */

const searchGenre = document.querySelector('[data-search-genres]');
searchGenre.innerHTML = `
  <option value="any">All Genres</option>
  ${Object.entries(genres).map(([id, name]) => `<option value="${id}">${name}</option>`).join('')}
`;

const searchAuthors = document.querySelector('[data-search-authors]');
searchAuthors.innerHTML = `
  <option value="any">All Authors</option>
  ${Object.entries(authors).map(([id, name]) => `<option value="${id}">${name}</option>`).join('')}
`;


/**
 * THESE ARE LISTENER FUNCTIONS FOR DOM ELEMENTS
 */

const cancelSearch = document.querySelector('[data-search-cancel]')
cancelSearch.addEventListener('click', () => {

    document.querySelector('[data-search-overlay]').open = false
})

const cancelSett = document.querySelector('[data-settings-cancel]');
cancelSett.addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
});

const closeList = document.querySelector('[data-list-close]')
closeList.addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false;
})

const settForm = document.querySelector('[data-header-settings]');
settForm.addEventListener('click', (e) => {
    e.preventDefault()
    document.querySelector('[data-settings-overlay]').open = true
});

const searchData = document.querySelector('[data-header-search]');
searchData.addEventListener('click', () => {

    document.querySelector('[data-search-overlay]').open = true
    document.querySelector('[data-search-title]').focus();

});

//--=CONTROLS SCROLLING BOOKS PAGES ---//

const listBtn = document.querySelector('[data-list-button]')
listBtn.innerText = `Show more: ${(books.length - BOOKS_PER_PAGE)}`

listBtn.innerHTML = /* html */[
    `<span>Show more</span>,
    <span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>`
]

/**
 * LISTENER FUNCTION FOR THAT INCREASES NUMBER OF BOOKS TO BE SCROLLED BASED ON WHAT THE USER WANTS VIEW
 */

listBtn.addEventListener('click', () => {
    const startIndex = page * BOOKS_PER_PAGE;
    const endIndex = (page + 1) * BOOKS_PER_PAGE;
    const fragment = document.createDocumentFragment();

    for (let i = startIndex; i < endIndex && i < matches.length; i++) {
        const book = matches[i];
        const { author, image, title, id } = book;

        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id);

        element.innerHTML = `
        <img class="preview__image" src="${image}">
        <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
        </div>
      `;
        fragment.appendChild(element);
    }
    listItems.appendChild(fragment);

    page += 1;

    const remaining = matches.length - endIndex;
    listBtn.disabled = endIndex >= matches.length;
    listBtn.textContent = `Show more (${remaining})`;
});

/**
 * THE SEARCH LISTENER FUNCTION FOR SEARCHING BOOKS BY AUHTOR, GENRE OR ALL SELECTION
 */


const searchForm = document.querySelector('[data-search-form]');
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(searchForm);
  const filters = Object.fromEntries(formData);

  const filteredMatches = matches.filter(({ title, author, genres }) => {
    const titleMatch = filters.title.trim() === '' || title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch = filters.author === 'any' || author === filters.author;
    const genreMatch = filters.genre === 'any' || genres.includes(filters.genre);
    return titleMatch && authorMatch && genreMatch;
  });

  const listMessage = document.querySelector('[data-list-message]');
  listMessage.classList.toggle('list__message_show', filteredMatches.length < 1);

  listItems.innerHTML = '';

  const fragment = document.createDocumentFragment();
  filteredMatches.forEach(({ author, image, title, id }) => {
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);
    element.innerHTML = `
      <img class="preview__image" src="${image}">
      <div class="preview__info">
        <h3 class="preview__title">${title}</h3>
        <div class="preview__author">${authors[author]}</div>
      </div>
    `;
    fragment.appendChild(element);
  });

  listItems.appendChild(fragment);

  searchForm.open = false;
  listBtn.disabled = true;
});

//---PREIVIEWING A BOOK WHEN CLICKING ON A BOOK'S IMAGE BUTTON-----//

listItems.addEventListener('click', (event) => {
    const active = books.find(book => book.id === event.target.dataset.preview);
  
    if (!active) return;
  
    const activeList = document.querySelector('[data-list-active]');
    const listBlur = document.querySelector('[data-list-blur]');
    const imageList = document.querySelector('[data-list-image]');
    const titleList = document.querySelector('[data-list-title]');
    const subtitle = document.querySelector('[data-list-subtitle]');
    const description = document.querySelector('[data-list-description]');
  
    activeList.open = true;
    listBlur.style.background = `url(${active.image})`;
    imageList.src = active.image;
    titleList.textContent = active.title;
    subtitle.innerHTML = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
    description.textContent = active.description;
  });

/**
 * CHANGING THE BACKGROUND THEME AND TEXT COLOR OF THE OVERALL PAGE
 */

const colors = {
    day: {
      dark: '10, 10, 20',
      light: '255, 255, 255',
    },
    night: {
      dark: '255, 255, 255',
      light: '10, 10, 20',
    },
  };
  
  const themeSett = document.querySelector('[data-settings-theme]');
  const formSettings = document.querySelector('[data-settings-overlay]');
  
  function applyTheme(theme) {
    const { dark, light } = colors[theme];
    document.documentElement.style.setProperty('--color-dark', dark);
    document.documentElement.style.setProperty('--color-light', light);
  }
  
  // Apply initial theme
  applyTheme(themeSett.value);
  
  // Apply selected theme on form submit
  formSettings.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const result = Object.fromEntries(formData);
    applyTheme(result.theme);
    formSettings.open = false;
  });
  




