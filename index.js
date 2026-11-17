const movieListEl = document.querySelector(`.movies-grid`);
const showingMovieE1 = document.querySelector(`.resultsInfo`);
const placeholderHTMLE1 = document.querySelector(`.movie-card`);

let currentMovies = []; 

function getSearchTerm(searchForm, onSubmitCallback) {
    const form = document.getElementById(searchForm);
    if (!form) {
        console.error(`Form with search "${searchForm}" not found.`);
        return;
    }
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        onSubmitCallback(data);
    });
}

getSearchTerm(`searchForm`, (data) => {
    const name = Object.values(data)[0];
    const url = "https://www.omdbapi.com/?apikey=35336e95&s=";
    const fullUrl = `${url}${name}`;

    async function searchName() {
    try {
        renderSkeleton(); 
        const response = await fetch(fullUrl);
        const movieData = await response.json();

        if (movieData.Search) {
            currentMovies = movieData.Search; 
            renderMovies(currentMovies);
            showingMovieE1.innerHTML = showingHTML(name);
        } else {
            movieListEl.innerHTML = `<p>No results found for "${name}"</p>`;
        }
    } catch (error) {
        console.error('Error fetching movie data:', error);
        movieListEl.innerHTML = `<p>Failed to fetch movies. Please try again later.</p>`;
    }
}


    searchName();

    function renderMovies(movies) {
        movieListEl.innerHTML = movies.map(movie => movieHTML(movie)).join('');
    }

    function movieHTML(movie) {
        return `<div class="movie-card">
                     <img class="movie-card__img" src="${movie.Poster}" alt="" /> 
                    <h2 class="movie-card__title">${movie.Title}</h2>
                    <p class="movie-card__year">${movie.Year}</p>
                </div>`;
    }

    function showingHTML(name) {
        return `<p id="resultsInfo" class="resultsInfo"><span>Showing: </span>${name}</p>`;
    }
    function renderSkeleton() {
    const skeletonHTML = Array(5).fill().map(() => `
        <div class="movie-card movie-card--skeleton">
            <div class="movie-card__img--skeleton"></div>
            <div class="movie-card__title--skeleton"></div>
            <div class="movie-card__year--skeleton"></div>
        </div>
    `).join('');

    movieListEl.innerHTML = skeletonHTML;
}

    window.filterMovies = function(event) {
        const sortValue = event.target.value;

        let sortedMovies = [...currentMovies]; 

        if (sortValue === 'a-z') {
            sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
        } else if (sortValue === 'z-a') {
            sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
        } else if (sortValue === 'newest') {
            sortedMovies.sort((a, b) => b.Year - a.Year);
        } else if (sortValue === 'oldest') {
            sortedMovies.sort((a, b) => a.Year - b.Year);
        }

        renderMovies(sortedMovies); // Render the sorted movies
    };

    document.addEventListener(`error`, (event) => {
        if (event.target.tagName.toLowerCase() === `img`) {
            const img = event.target;
            const div = document.createElement(`div`);
            div.className = `movie-card__poster-placeholder`;
            div.textContent = img.alt || `Movie Poster Not Available`;
            img.replaceWith(div);
        }
    }, true);    
});

