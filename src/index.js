import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

let searchName = '';

input.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch() {
  searchName = input.value.trim();

  fetchCountries(searchName).then(renderCountryCard).catch(onFetchError);
}

function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name', {
    position: 'center-top',
  });
}

function renderCountryCard(country) {
  const countryCard = country
    .map(
      ({ flags, name, capital, population, languages }) => `<img src="${
        flags.svg
      }" alt="${flags.alt}" width="25" />
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

// function renderCountriesList(countries) {
//   const countriesList = countries
//     .map(
//       ({ flags, name }) =>
//         `<li>
//         <img src="${flags.svg}" alt="Country flag" />
//         <p>${name.official}</p>
//       </li>`
//     )
//     .join('');

//   countryList.innerHTML = countriesList;
// }
