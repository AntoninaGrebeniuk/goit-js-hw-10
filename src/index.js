import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

let searchName = '';

function onInputSearch() {
  searchName = input.value.trim();

  if (searchName === '') {
    clearAll();
    return;
  }

  fetchCountries(searchName)
    .then(country => {
      if (country.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.',
          {
            position: 'center-top',
          }
        );
        clearAll();
      } else if (country.length > 2 && country.length < 10) {
        clearAll();
        renderCountriesList(country);
      } else if (country.length === 1) {
        clearAll();
        renderCountryCard(country);
      }
    })
    .catch(onFetchError);
}

function onFetchError(error) {
  clearAll();
  Notiflix.Notify.failure('Oops, there is no country with that name', {
    position: 'center-top',
  });
}

function renderCountryCard(country) {
  const countryCard = country
    .map(
      ({ flags, name, capital, population, languages }) => `<img src="${
        flags.svg
      }" alt="${flags.alt}" width="50" />
  <h2>${name.official}</h2>
  <ul>
    <li>
      <p><b>Capital:</b> ${capital}</p>
    </li>
    <li>
      <p><b>Population:</b> ${population}</p>
    </li>
    <li>
      <p><b>Languages:</b> ${Object.values(languages)} </p>
    </li>
  </ul>`
    )
    .join('');

  countryInfo.innerHTML = countryCard;
}

function renderCountriesList(countries) {
  const countriesList = countries
    .map(
      ({ flags, name }) =>
        `<li class="country-list__item">
        <img src="${flags.svg}" alt="${flags.alt}" width="40" height="30" />
        <p class="country-list__text">${name.official}</p>
      </li>`
    )
    .join('');

  countryList.innerHTML = countriesList;
}

function clearAll() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
