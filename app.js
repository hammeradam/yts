document.getElementById('search').addEventListener('keyup', async function() {
    window.page = 1;
    const data = await getMoovieData(this.value, 8, 1);

    appenMoovieCards(data, document.querySelector('.result-wrapper'), true);
    
});

document.addEventListener('scroll', async function() {
    // scrolled to bottom
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        const data = await getMoovieData(document.getElementById('search').value, 8, ++window.page);

        appenMoovieCards(data, document.querySelector('.result-wrapper'));
    }
});

async function getMoovieData(searchTerm = '',limit = 8, page = 1) {
    const response = await fetch(`https://yts.mx/api/v2/list_movies.json?limit=${limit}&page=${page}&query_term=${encodeURI(searchTerm)}`);
    return response.json();
}

function appenMoovieCards(data, conatiner, clearContainer = false) {
    if (data.data.movie_count) {
        if (clearContainer) {
            conatiner.innerHTML = '';
        }

        if (data.data.movies) {
            data.data.movies.forEach(movie => {
                // Create card wrapper
                const wrapper = document.createElement('div');
                wrapper.classList.add('col-12', 'col-md-6', 'col-lg-3')

                // Create movie card
                const card = document.createElement('div');
                card.classList.add('movie-card');
                
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

                // Add download links
                movie.torrents.forEach(torrent => {
                    const link = document.createElement('a');
                    link.innerHTML = `${torrent.quality} ${torrent.type}`;
                    link.href = torrent.url;
                    link.classList.add('download-link')
                    textWrapper.appendChild(link);
                });

                // Add subtitle link
                const subtitleLink = document.createElement('a');
                subtitleLink.innerHTML = 'Subtitle';
                subtitleLink.href = `https://www.yifysubtitles.com/movie-imdb/${movie.imdb_code}/`
                subtitleLink.target = '__blank';
                subtitleLink.classList.add('subtitle-link');
                textWrapper.appendChild(subtitleLink);

                card.appendChild(textWrapper);
                // Append to DOM
                wrapper.appendChild(card);
                conatiner.appendChild(wrapper);
            });
        }
    }
}

function matchHeight() {
    //Grab divs with the class name 'match-height'
    var getDivs = document.getElementsByClassName('match-height');

    //Find out how my divs there are with the class 'match-height' 
    var arrayLength = getDivs.length;
    var heights = [];

    //Create a loop that iterates through the getDivs variable and pushes the heights of the divs into an empty array
    for (var i = 0; i < arrayLength; i++) {
        heights.push(getDivs[i].offsetHeight);
    }

        //Find the largest of the divs
    function getHighest() {
        return Math.max(...heights);
    }

    //Set a variable equal to the tallest div
    var tallest = getHighest();

    //Iterate through getDivs and set all their height style equal to the tallest variable
    for (var i = 0; i < getDivs.length; i++) {
        getDivs[i].style.height = tallest + "px";
    }
}
