import { authors, genres, books, BOOKS_PER_PAGE } from './data.js'

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

fragment = document.createDocumentFragment()
extracted = books.slice(0, 36)
for (const { author, id, image, title } of extracted) {

    const element = document.createElement('button')
    element.classList = 'preview'
    element.setAttribute('data-preview', id)
    element.innerHTML = /* html */ `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `
    fragment.appendChild(element)
}
listItems.appendChild(fragment)

/**
 * CREATING FRAGMENTS THAT COTAIN DOCUMENT OBJECT ELEMENTS FOR OBJECT GENRE AND OBJECT AUTHOR
 */

const genresFrag = document.createDocumentFragment();
let element = document.createElement('option');
element.value = 'any';
element.innerText = 'All Genres';
genresFrag.appendChild(element);
for (const [id, name] of Object.entries(genres)) {
    element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    genresFrag.appendChild(element);
}
const searchGenre = document.querySelector('[data-search-genres]');
searchGenre.appendChild(genresFrag);

const authorsFrag = document.createDocumentFragment();
let elementA = document.createElement('option');
elementA.value = 'any';
elementA.innerText = 'All Authors';
authorsFrag.appendChild(elementA);
for (const [id, name] of Object.entries(authors)) {
    elementA = document.createElement('option');
    elementA.value = id;
    elementA.innerText = name;
    authorsFrag.appendChild(elementA);
}
const searchAuthors = document.querySelector('[data-search-authors]');
searchAuthors.appendChild(authorsFrag);

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

const searchForm = document.querySelector('[data-search-form]')
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(searchForm);
    const filters = Object.fromEntries(formData);
    const result = [];

    for (let i = 0; i < matches.length; i++) {
        const book = matches[i];

        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);

        if (titleMatch && authorMatch && genreMatch) {
            result.push(book);
        }
    }

    const listMessage = document.querySelector('[data-list-message]');

    if (result.length < 1) {
        listMessage.classList.add('list__message_show');
        listItems.innerHTML = '';
    } else {
        listMessage.classList.remove('list__message_show');
        listItems.innerHTML = '';

        const fragment = document.createDocumentFragment();

        for (const book of result) {
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
    }

    searchForm.open = false;
    listBtn.disabled = true

});

//---PREIVIEWING A BOOK WHEN CLICKING ON A BOOK'S IMAGE BUTTON-----//

listItems.addEventListener('click', (event) => {

    const pathArray = Array.from(event.path || event.composedPath());
    const activeList = document.querySelector('[data-list-active]');
    const listBlur = document.querySelector('[data-list-blur]');
    const imageList = document.querySelector('[data-list-image]');
    const titleList = document.querySelector('[data-list-title]');
    const subtitle = document.querySelector('[data-list-subtitle]');
    let description = document.querySelector('[data-list-description]');

    let active;
    for (const node of pathArray) {
        if (active) {
            break;
        }
        const previewId = node?.dataset?.preview;

        for (const singleBook of books) {
            if (singleBook.id === previewId) active = singleBook;

        }
    }

    if (!active) return;

    activeList.open = true;
    listBlur.style.background = `url(${active.image})`
    imageList.setAttribute('src', active.image)
    titleList.innerHTML = active.title;
    subtitle.innerHTML = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
    description.innerHTML = active.description;

})

/**
 * CHANGING THE BACKGROUND THEME AND TEXT COLOR OF THE OVERALL PAGE
 */

const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
}

const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
}

//-------------------APPLY INITIAL THEME---------------------//

const themeSett = document.querySelector('[data-settings-theme]');
const formSettings = document.querySelector('[data-settings-overlay]');

if (themeSett.value === 'night') {
    document.documentElement.style.setProperty('--color-dark', night.dark);
    document.documentElement.style.setProperty('--color-light', night.light);
} else {
    document.documentElement.style.setProperty('--color-dark', day.dark);
    document.documentElement.style.setProperty('--color-light', day.light);
}

//--- Apply selected theme on form submit-----//

formSettings.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const result = Object.fromEntries(formData);
    if (result.theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', night.dark);
        document.documentElement.style.setProperty('--color-light', night.light);
    } else {
        document.documentElement.style.setProperty('--color-dark', day.dark);
        document.documentElement.style.setProperty('--color-light', day.light);
    }
    formSettings.open = false;
});



