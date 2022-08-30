import './sass/index.scss';
import { fetchImages } from './fetch';
import { renderGallery } from './render';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
let simpleLightBox;

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const addBtn = document.querySelector('.btn-load-more');

let query = '';
let page = 1;
const perPage = 40;

searchForm.addEventListener('submit', onSearchForm);
addBtn.addEventListener('click', onLoadMoreBtn);

function onSearchForm(e) {
  e.preventDefault();
  page = 1;
  query = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  addBtn.classList.add('is-hidden');

  if (query === '') {
    emptyQuery();
    return;
  }

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        noImg();
      } else {
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        responseMessage(data);

        if (data.totalHits > perPage) {
          addBtn.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error));
}

function onLoadMoreBtn() {
  page += 1;
  simpleLightBox.destroy();

  fetchImages(query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits);

      const totalPages = Math.ceil(data.totalHits / perPage);

      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      if (page === totalPages) {
        addBtn.classList.add('is-hidden');
        endOfGalary();
      }
    })
    .catch(error => console.log(error));
}

function noImg() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function responseMessage(data) {
  Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function emptyQuery() {
  Notify.info(
    'The search string cannot be empty. Please specify your search query.'
  );
}

function endOfGalary() {
  Notify.warning("We're sorry, but you've reached the end of search results.");
}
