const body = document.querySelector('body');
const movies = document.querySelector('.movies');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalAverage = document.querySelector('.modal__average');
const modalGenres = document.querySelector('.modal__genres');
const modalCloseImg = document.querySelector('.modal__close');
const btnTheme = document.querySelector('.btn-theme');
const input = document.querySelector('.input');

const modalOpen = (allMovieClasses) => {
    allMovieClasses.forEach((movie) => {
        movie.addEventListener('click', () => {
            modal.classList.remove('hidden');

            fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/' + movie.id + '?language=pt-BR').then((res) => {
                const promise = res.json();

                promise.then((modalMovie) => {
                    modalTitle.textContent = modalMovie.title;
                    modalImg.src = modalMovie.backdrop_path;
                    modalDescription.textContent = modalMovie.overview;
                    modalAverage.textContent = modalMovie.vote_average;

                    for (let i = 0; i < modalMovie.genres.length; i++) {
                        const movieGenre = document.createElement('span');
                        movieGenre.classList.add('modal__genre');
                        movieGenre.textContent = modalMovie.genres[i].name;
                        modalGenres.append(movieGenre);
                    }
                });
            });

            function closeModal() {
                modalCloseImg.addEventListener('click', () => {
                    modal.classList.add('hidden');
                    modalTitle.textContent = '';
                    modalImg.src = '';
                    modalDescription.textContent = '';
                    modalAverage.textContent = '';
                    modalGenres.innerHTML = '';
                });

                modal.addEventListener('click', () => {
                    modal.classList.add('hidden');
                    modalTitle.textContent = '';
                    modalImg.src = '';
                    modalDescription.textContent = '';
                    modalAverage.textContent = '';
                    modalGenres.innerHTML = '';
                });
            }

            closeModal();
        });
    });
}

const carousel = (movieSelected, i) => {
    const movie = document.createElement('div');
    movie.classList.add('movie');
    movie.id = movieSelected[i].id;
    movie.style.backgroundImage = `url(${movieSelected[i].poster_path})`;

    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie__info');

    const movieTitle = document.createElement('span');
    movieTitle.classList.add('movie__title');
    movieTitle.textContent = movieSelected[i].title;

    const movieRating = document.createElement('span');
    movieRating.classList.add('movie__rating');
    movieRating.textContent = movieSelected[i].vote_average;

    const img = document.createElement('img');
    img.src = "./assets/estrela.svg";
    img.alt = "estrela";

    movieRating.append(img);
    movieInfo.append(movieTitle, movieRating);
    movie.append(movieInfo);
    movies.append(movie);

    const allMovieClasses = document.querySelectorAll('.movie');
    modalOpen(allMovieClasses);
}

const moviesCarousel = () => {
    fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then((res) => {
        const promise = res.json();

        promise.then((dayMovies) => {
            const pages = [];

            for (let i = 0; i < dayMovies.results.length; i = i + 5) {
                pages.push(dayMovies.results.slice(i, i + 5));
            }

            allPages = pages;
            numberOfPages = 3;
            currentPageNumber = 0;

            if (!getHighlightMovieInfo) {
                const highlightMovieId = dayMovies.results[0].id;
                highlightMovie(highlightMovieId);
                getHighlightMovieInfo = true;
            }

            for (let i = 0; i < 5; i++) {
                carousel(allPages[currentPageNumber], i);
            }

            btnNext.addEventListener('click', () => {
                movies.innerHTML = '';
                currentPageNumber++;

                if (currentPageNumber > numberOfPages) {
                    currentPageNumber = 0;
                }

                for (let i = 0; i < allPages[currentPageNumber].length; i++) {
                    carousel(allPages[currentPageNumber], i);
                }
            });

            btnPrev.addEventListener('click', () => {
                movies.innerHTML = '';
                currentPageNumber--;

                if (currentPageNumber < 0) {
                    currentPageNumber = numberOfPages;
                }

                for (let i = 0; i < allPages[currentPageNumber].length; i++) {
                    carousel(allPages[currentPageNumber], i);
                }
            });
        });
    });
}

const searchMovie = () => {
    input.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;

        if (!input.value) {
            movies.innerHTML = '';
            btnNext.classList.remove('hidden');
            btnPrev.classList.remove('hidden');

            moviesCarousel();

            return;
        }

        currentPageNumber = 0;

        movies.innerHTML = '';
        const query = input.value;
        input.value = '';

        const search = 'https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=' + query;

        fetch(search).then((res) => {
            const promise = res.json();

            promise.then((movieSearched) => {
                if (movieSearched.results.length === Number(0)) {
                    movies.innerHTML = '';
                    //btnNext.classList.remove('hidden');
                    //btnPrev.classList.remove('hidden');

                    moviesCarousel();

                    return;
                }

                const pages = [];

                for (let i = 0; i < movieSearched.results.length; i = i + 5) {
                    pages.push(movieSearched.results.slice(i, i + 5));
                }

                allPages = pages;
                numberOfPages = (movieSearched.results.length % 5) === 0 ? (movieSearched.results.length / 5) - 1 : (movieSearched.results.length / 5);

                const count = movieSearched.results.length < 5 ? movieSearched.results.length : 5;

                for (let i = 0; i < count; i++) {
                    carousel(allPages[currentPageNumber], i);
                }

                //btnNext.classList.add('hidden');
                //btnPrev.classList.add('hidden');
            });
        });
    });
}

const highlightMovie = (highlightMovieId) => {
    fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${highlightMovieId}?language=pt-BR`).then((res) => {
            const promise = res.json();

            promise.then((highlightInfo) => {
                const highlightVideoBackground = document.querySelector('.highlight__video');
                const highlightTittle = document.querySelector('.highlight__title');
                const highligthRating = document.querySelector('.highlight__rating');
                const highlightGenres = document.querySelector('.highlight__genres');
                const highlightLaunch = document.querySelector('.highlight__launch');
                const highlightDescription = document.querySelector('.highlight__description');

                let movieGenres = [];

                for (let i = 0; i < highlightInfo.genres.length; i++) {
                    movieGenres.push(highlightInfo.genres[i].name);
                }

                movieGenres = movieGenres.join(', ');

                let releaseDate = highlightInfo.release_date.split('-');
                let temp = releaseDate[0];
                releaseDate[0] = releaseDate[2];
                releaseDate[2] = temp;
                releaseDate = releaseDate.join('-');

                highlightVideoBackground.style.backgroundImage = `url(${highlightInfo.backdrop_path})`;
                highlightTittle.textContent = highlightInfo.title;
                highligthRating.textContent = highlightInfo.vote_average;
                highlightGenres.textContent = movieGenres;
                highlightLaunch.textContent = releaseDate;
                highlightDescription.textContent = highlightInfo.overview.length < 300 ? highlightInfo.overview : highlightInfo.overview.substr(0, 300) + '...';
            });
        });

    fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${highlightMovieId}/videos?language=pt-BR`).then((res) => {
        const promise = res.json();

        promise.then((highlight) => {
            const highlightVideo = document.querySelector('.highlight__video-link');

            highlightVideo.href = 'https://www.youtube.com/watch?v=' + highlight.results[0].key;
        });

    });
}

const darkTheme = () => {
    const initialTheme = localStorage.getItem('theme');
    btnTheme.setAttribute('src', initialTheme === 'light' ? './assets/light-mode.svg' : './assets/dark-mode.svg');
    body.style.setProperty('--background-color', initialTheme === 'light' ? "#FFF" : '#242424');
    body.style.setProperty('--highlight-background', initialTheme === 'light' ? "#FFF" : '#454545');
    body.style.setProperty('--color', initialTheme === 'light' ? "#000" : '#FFF');
    body.style.setProperty('--highlight-description', initialTheme === 'light' ? "#000" : '#FFF');
    body.style.setProperty('--highlight-color', initialTheme === 'light' ? "rgba(0, 0, 0, 0.7)" : 'rgba(255, 255, 255, 0.7)');
    initialTheme === 'light' ? btnTheme.classList.remove('dark__mode') : btnTheme.classList.add('dark__mode');

    btnTheme.addEventListener('click', () => {
        btnTheme.classList.toggle('dark__mode');

        if (btnTheme.classList.contains('dark__mode')) {
            btnTheme.setAttribute('src', './assets/dark-mode.svg');
        } else {
            btnTheme.setAttribute('src', './assets/light-mode.svg');
        }

        localStorage.setItem('theme', initialTheme === 'dark' ? 'light' : 'dark');

        const newBackgroundColorBody = body.style.getPropertyValue('--background-color') === '#242424' ? '#FFF' : '#242424';
        body.style.setProperty('--background-color', newBackgroundColorBody);

        const newBackgroundColorHightlightInfo = body.style.getPropertyValue('--highlight-background') === '#FFF' ? '#454545' : '#FFF';
        body.style.setProperty('--highlight-background', newBackgroundColorHightlightInfo);

        const newTextColor = body.style.getPropertyValue('--color') === '#FFF' ? '#000' : '#FFF';
        body.style.setProperty('--color', newTextColor);
        body.style.setProperty('--highlight-description', newTextColor);

        const newTextColorGenders = body.style.getPropertyValue('--highlight-color') === 'rgba(255, 255, 255, 0.7)' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)';
        body.style.setProperty('--highlight-color', newTextColorGenders);
    });
}

let allPages = [];
let numberOfPages = 0;
let currentPageNumber = 0;
let getHighlightMovieInfo = false;

moviesCarousel(currentPageNumber);
searchMovie();
darkTheme();