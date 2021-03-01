document.getElementById('search').addEventListener('keyup', async function() {
    window.page = 1;
    const data = await getMovieData(this.value, 8, 1);

    appendMovieCards(data, document.querySelector('.result-wrapper'), true);
    
});

document.addEventListener('scroll', async function() {
    // scrolled to bottom
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        const data = await getMovieData(document.getElementById('search').value, 8, ++window.page);

        appendMovieCards(data, document.querySelector('.result-wrapper'));
    }
});

async function getMovieData(searchTerm = '', limit = 8, page = 1, order = 'download_count') {
    const response = await fetch(`https://yts.mx/api/v2/list_movies.json?limit=${limit}&page=${page}&query_term=${encodeURI(searchTerm)}&sort_by=${order}`);
    return response.json();
}

async function getMovieDetails(id) {
    const response = await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}&with_images=true&with_cast=true`);
    return response.json();
}

function appendMovieCards(data, container, clearContainer = false) {
    if (data.data.movie_count) {
        if (clearContainer) {
            container.innerHTML = '';
        }

        if (data.data.movies) {
            data.data.movies.forEach(movie => {
                // Create card wrapper
                const wrapper = document.createElement('div');
                wrapper.classList.add('col-12', 'col-md-6', 'col-lg-3');

                // Create movie card
                const card = document.createElement('div');
                card.setAttribute('data-yts_id', movie.id);
                card.classList.add('movie-card', 'z');
                addCardClickListener(card);

                // Add cover image
                const img = document.createElement('img');
                img.src = movie.medium_cover_image;
                card.appendChild(img);

                // Add text wrapper
                const textWrapper = document.createElement('div');
                textWrapper.classList.add('text-wrapper', 'match-height');


                // Add title
                const title = document.createElement('a');
                title.innerHTML = movie.title;
                title.target = '__blank';
                title.classList.add('title');
                title.href = `https://www.imdb.com/title/${movie.imdb_code}/`;
                textWrapper.appendChild(title);

                // Add download button
                const button = document.createElement('button');
                button.innerHTML = 'Download';
                button.classList.add('btn', 'btn-primary', 'download-button');
                addDownloadButtonClickListener(button);

                // Add download link wrapper
                const linkWrapper = document.createElement('div');
                linkWrapper.classList.add('link-wrapper');
                const linkWrapperClose = document.createElement('div');
                linkWrapperClose.classList.add('link-wrapper__close');
                linkWrapperClose.innerHTML = '&times';
                addDownloadWrapperCloseClickListener(linkWrapperClose);
                linkWrapper.appendChild(linkWrapperClose);

                // Add download links
                movie.torrents.forEach(torrent => {
                    const link = document.createElement('a');
                    link.innerHTML = `${torrent.quality} ${torrent.type}`;
                    link.href = torrent.url;
                    link.classList.add('download-link');
                    linkWrapper.appendChild(link);
                    // textWrapper.appendChild(link);
                });

                // Add subtitle link
                // const subtitleLink = document.createElement('a');
                // subtitleLink.innerHTML = 'Subtitle';
                // subtitleLink.href = `https://www.yifysubtitles.com/movie-imdb/${movie.imdb_code}/`;
                // subtitleLink.target = '__blank';
                // subtitleLink.classList.add('subtitle-link');
                // textWrapper.appendChild(subtitleLink);

                card.appendChild(textWrapper);
                card.appendChild(button);
                card.appendChild(linkWrapper);
                // Append to DOM
                wrapper.appendChild(card);
                container.appendChild(wrapper);
                matchHeight();
            });
        }
    }
}

function addCardClickListener(card) {
    card.addEventListener('click', async function (e) {
        if (
            !e.target.classList.contains('download-link') &&
            !e.target.classList.contains('title') &&
            !e.target.classList.contains('download-button') &&
            !e.target.classList.contains('link-wrapper__close')
        ) {
            const movieData = await getMovieDetails(card.getAttribute('data-yts_id'));
            console.log(movieData);
            const modal = document.getElementById('detail_modal');
            document.querySelector('.detail_modal__title').innerHTML = movieData.data.movie.title;
            document.querySelector('.detail_modal__year').innerHTML = movieData.data.movie.year;
            document.querySelector('.detail_modal__description').innerHTML = movieData.data.movie.description_full;
            document.querySelector('.detail_modal__rating').innerHTML = movieData.data.movie.rating + '/10';
            document.querySelector('.detail_modal__image').setAttribute('src', movieData.data.movie.medium_cover_image);

            const genreWrapper = document.querySelector('.detail_modal__genre-wrapper');
            genreWrapper.innerHTML = '';
            movieData.data.movie.genres.forEach(function(genre) {
                const genreNode = document.createElement('span');
                genreNode.innerHTML = genre;
                genreWrapper.appendChild(genreNode);
            });

            const castWrapper = document.querySelector('.detail_modal__cast-wrapper');
            castWrapper.innerHTML = '';
            const castTitle = document.createElement('h5');
            castTitle.innerHTML = 'Cast:';
            castWrapper.appendChild(castTitle);
            movieData.data.movie.cast.forEach(function(cast) {
                const castNode = document.createElement('p');
                castNode.innerHTML = cast.name;
                castWrapper.appendChild(castNode);
            });

            const linkWrapper = document.querySelector('.detail_modal__link-wrapper');
            linkWrapper.innerHTML = '';
            const linkTitle = document.createElement('h5');
            linkTitle.innerHTML = 'Download:';
            linkWrapper.appendChild(linkTitle);
            movieData.data.movie.torrents.forEach(function(torrent) {
                const linkNode = document.createElement('a');
                linkNode.setAttribute('href', torrent.url);
                linkNode.innerHTML = `${torrent.quality} ${torrent.type} ${torrent.size}`;
                linkWrapper.appendChild(linkNode);
            });

            modal.classList.add('show');
            document.querySelector('.overlay').classList.add('show');
            document.querySelector('body').classList.add('overflow-hidden');
        }
    });
}

function addDownloadButtonClickListener(button) {
    button.addEventListener('click', function () {
        this.parentNode.querySelector('.link-wrapper').classList.add('show');
    });
}

function addDownloadWrapperCloseClickListener(button) {
    button.addEventListener('click', function () {
        this.parentNode.classList.remove('show');
    });
}

document.querySelector('.detail_modal__close').addEventListener('click', function () {
    document.getElementById('detail_modal').classList.remove('show');
    document.querySelector('.overlay').classList.remove('show');
    document.querySelector('body').classList.remove('overflow-hidden');
});

document.querySelector('.overlay').addEventListener('click', function () {
    document.getElementById('detail_modal').classList.remove('show');
    document.querySelector('.overlay').classList.remove('show');
    document.querySelector('body').classList.remove('overflow-hidden');
});

function matchHeight() {
    //Grab divs with the class name 'match-height'
    const getDivs = document.getElementsByClassName('match-height');

    //Find out how my divs there are with the class 'match-height' 
    const heights = [];

    //Create a loop that iterates through the getDivs variable and pushes the heights of the divs into an empty array
    for (let i = 0; i < getDivs.length; i++) {
        heights.push(getDivs[i].offsetHeight);
    }

    //Find the largest of the divs
    function getHighest() {
        return Math.max(...heights);
    }

    //Set a variable equal to the tallest div
    const tallest = getHighest();

    //Iterate through getDivs and set all their height style equal to the tallest variable
    for (let i = 0; i < getDivs.length; i++) {
        getDivs[i].style.height = tallest + "px";
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    window.page = 1;
    const data = await getMovieData('', 8, 1);

    appendMovieCards(data, document.querySelector('.result-wrapper'), true);
});
