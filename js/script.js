let tabCountries = null;
let tabFavorites = null;

let allCountries = [];
let favoriteCountries = [];

let countCountries = 0;
let countFavorites = 0;

let totalPopulationList = 0;
let totalPopulationFavorites = 0;

let numberFormat = null;

window.addEventListener('load', () =>{
    tabCountries = document.querySelector('.tab-paises');
    tabFavorites = document.querySelector('.tab-favorites');
    countCountries = document.querySelector('.paises h2 span');
    countFavorites = document.querySelector('.favorit h2 span');

    totalPopulationList = document.querySelector('.paises h3 span');
    totalPopulationFavorites = document.querySelector('.favorit h3 span');

    numberFormat = Intl.NumberFormat('pt-BR')

    fetchCountries();
});

async function fetchCountries(){
    const res = await fetch('https://restcountries.eu/rest/v2/all');
    const json = await res.json();

    allCountries = json.map(country => {
        const {numericCode, translations, population, flag } = country;
        return {
            name: translations.br,
            population,
            flag,
            id: numericCode ,
            formattedPopulation : formatNumber(population)
        };
    });

    render();
}

function render(){
    renderCountryList();
    renderFavorites();
    renderSummary();

    handleCountryButtons();

}

function renderCountryList(){
    let contriesHTML = "<div>";

    allCountries.forEach(country => {
        const {id, name, flag, formattedPopulation } = country;
        
        const countryHTML =`
        <div class='county'>
            <div>
                <input id="${id}" type="button" value="+">
            </div>
            <div>
                <img src="${flag}" alt"${name}">
            </div>
            <div>
                <ul>
                    <li>${name}</li>
                    <li>${formattedPopulation}</li>
                </ul>
            </div>
        </div>  
        `;

        contriesHTML += countryHTML
    })

    contriesHTML += "</div>"

    tabCountries.innerHTML = contriesHTML
}

function renderFavorites(){
    let favoriteHTML = '<div>'
    favoriteCountries.forEach(country => {
        const {id, name, formattedPopulation, flag } = country;

        const FavoritecountryHTML =`
        <div class='county'>
            <div>
                <input id="${id}" class="btn-favorite" type="button" value="-">
            </div>
            <div>
                <img src="${flag}" alt"${name}">
            </div>
            <div>
                <ul>
                    <li>${name}</li>
                    <li>${formattedPopulation}</li>
                </ul>
            </div>
        </div>  
        `;

        favoriteHTML += FavoritecountryHTML;
    });

    tabFavorites.innerHTML =  favoriteHTML 

}
function renderSummary(){
    countCountries.textContent = allCountries.length;
    countFavorites.textContent = favoriteCountries.length;

    const totalPopulation = allCountries.reduce((accumulator, current) => {
        return accumulator + current.population;
    }, 0);

    const totalFavorites = favoriteCountries.reduce((accumulator, current) => {
        return accumulator + current.population;
    }, 0);

    totalPopulationList.textContent = formatNumber(totalPopulation);
    totalPopulationFavorites.textContent = formatNumber(totalFavorites);
}

function handleCountryButtons(){
    const countryButtons = Array.from(tabCountries.querySelectorAll('input'));
    const favoriteButtons = Array.from(tabFavorites.querySelectorAll('input'));
    
    countryButtons.forEach(button => {
        button.addEventListener('click', () => addToFavorrites(button.id));
    });

    favoriteButtons.forEach(button => {
        button.addEventListener('click', () => removeToFavorrites(button.id));
    });
}


function addToFavorrites(id){
    //find busca o elemento
    const countryToAdd = allCountries.find(button => button.id === id);
    favoriteCountries = [...favoriteCountries, countryToAdd];

    //sort usado para ordenar
    favoriteCountries.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    allCountries = allCountries.filter(country => country.id !== id);

    render();
}

function removeToFavorrites(id){
    //find busca o elemento
    const countryToRemove = favoriteCountries.find(button => button.id === id);
    allCountries = [...allCountries, countryToRemove];

    //sort usado para ordenar
    allCountries.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    favoriteCountries = favoriteCountries.filter(country => country.id !== id);

    render();
}

function formatNumber(number){
    return numberFormat.format(number)
}