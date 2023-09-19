// let movie = "Spider";
// fetchMovies(movie);

const movieSearchText = document.getElementById('movie-search-text');
const searchList = document.getElementById('search-list');
const resultContainer = document.getElementById('result-container');


function findMovies(){
    let movieName = (movieSearchText.value).trim();
    //If we have entered some name, fetch and display the options, else remove the search list
    if(movieName.length > 0){
        searchList.classList.remove('hide-search-list');
        fetchMovies(movieName);
    }else{
        searchList.classList.add('hide-search-list');
    }
}

async function fetchMovies(movieName){
    const URL = `https://omdbapi.com/?s=${movieName}&page=1&apikey=82d75117`;
    const result = await fetch(`${URL}`);
    const data = await result.json();
    // console.log(data);
    if(data.Response == "True"){
        displayMovies(data.Search);
    }
}

function displayMovies(movies){
    const searchTemplate = document.getElementById('search-item-template');

    searchList.innerHTML = "";
    for(let i = 0; i < movies.length; i++){
        let movieListItem = searchTemplate.content.cloneNode(true);
        fillSearchItem(movieListItem, movies[i]);
        searchList.appendChild(movieListItem);
    }
    //Fetch the details for the searched movie, the clicks would be handled in the function.
    fetchMovieDetails();
}

function fillSearchItem(movieListItem, movie){
    const movieImage = movieListItem.querySelector("#thumbnail");
    const movieName = movieListItem.querySelector("#movie-name");
    const movieYear = movieListItem.querySelector("#movie-year");
    const movieDiv = movieListItem.getElementById('search-item');

    if(movie.Poster != "N/A"){
        movieImage.src = movie.Poster;
    }else{
        movieImage.src = "./Image_not_found.jpg";
    }
    
    movieName.innerHTML = movie.Title;
    movieYear.innerHTML = movie.Year;
    movieDiv.dataset.id = movie.imdbID;
}

function fetchMovieDetails(){
    //Get the list of movies shown in the search list.
    const movieList = searchList.querySelectorAll('.search-item');

    //We would hadle the click on any of the movie
    movieList.forEach(movie => {
        //On click remove the searched list and set the search box value to null.
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchText.value = "";
            const idURL = `https://omdbapi.com/?i=${movie.dataset.id}&page=1&apikey=82d75117`;
            const movieInfo = await fetch(idURL);
            const movieDetails = await movieInfo.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(movieDetails){
    const resultTemplate = document.getElementById('result-item-template');

    resultContainer.innerHTML = '';

    const resultItem = resultTemplate.content.cloneNode(true);
    fillResultItem(resultItem, movieDetails);
    resultContainer.appendChild(resultItem);
}

function fillResultItem(resultItem, movieDetails){
    const movieImg = resultItem.querySelector("#movie-image");
    const movieTitle = resultItem.querySelector('.movie-title');
    const movieYear = resultItem.querySelector('.year');
    const movieRated = resultItem.querySelector('.rated');
    const movieReleased = resultItem.querySelector('.released');
    const movieRun = resultItem.querySelector('.runtime');
    const movieGenre = resultItem.querySelector('.genre');
    const movieRating = resultItem.querySelector('.rating');
    const movieDirector = resultItem.querySelector('.director');
    const movieWriter = resultItem.querySelector('.writer');
    const movieActors = resultItem.querySelector('.actors');
    const moviePlot = resultItem.querySelector('.plot');
    const movieLang = resultItem.querySelector('.language');
    const movieCountry = resultItem.querySelector('.country');
    const movieAward = resultItem.querySelector('.awards');

    if(movieDetails.Poster != "N/A"){
        movieImg.src = movieDetails.Poster;
    }else{
        movieImg.src = "./Image_not_found.jpg";
    }
    // movieImg.src = movieDetails.Poster;
    movieTitle.innerHTML = movieDetails.Title;
    movieYear.innerHTML = `<b>Year:</b> ${movieDetails.Year}`;
    movieRated.innerHTML = `<b>Rated:</b>  ${movieDetails.Rated}`;
    movieReleased.innerHTML = `<b>Released:</b> ${movieDetails.Released}`;
    movieRun.innerHTML = `<b><i class="fa-solid fa-film" style="color: #f1c40f;"></i></b>&nbsp ${movieDetails.Runtime}`;
    movieGenre.innerHTML = `<b>Genre:</b> ${movieDetails.Genre}`;
    movieRating.innerHTML = `<b>IMDB Rating:</b> ${movieDetails.imdbRating}`;
    movieDirector.innerHTML = `<b>Director:</b> ${movieDetails.Director}`;
    movieWriter.innerHTML = `<b>Writer:</b> ${movieDetails.Writer}`;
    movieActors.innerHTML = `<b>Actors:</b> ${movieDetails.Actors}`;
    moviePlot.innerHTML = `<b>Plot:</b> ${movieDetails.Plot}`;
    movieLang.innerHTML = `<b>Language:</b> ${movieDetails.Language}`;
    movieCountry.innerHTML = `<b>Country:</b> ${movieDetails.Country}`;
    movieAward.innerHTML = `<b><i class="fa-solid fa-award" style="color: #f1c40f;"></i></b> &nbsp ${movieDetails.Awards}`;
}

//If we click on the window somewhere other than the search box, the search list will be removed.
window.addEventListener('click', (event) => {
    if(event.target.className != "movie-search-input"){
        searchList.classList.add('hide-search-list');
    }
});