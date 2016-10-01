const TMDB_API_KEY = '25324c2fff9c736c1ec97b80cfadcad0';

function isMovie() {
	const tag = document.querySelector('meta[property="og:type"]');
	return tag && tag.content === 'video.movie';
}

function getImdbId() {
	const tag = document.querySelector('meta[property="pageId"]');
	return tag && tag.content;
}

function findTmdbByImdbId(imdbId) {
	return fetch(`https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&language=en-US&external_source=imdb_id`)
	.then((resp) => resp.json())
	.then((data) => {
		if (data.movie_results.length) {
			return data.movie_results[0].id;
		}
		throw new Error('movie_results from TMDB was empty');
	})
	.catch((err) => {
		console.error('Could not get TMDB id from IMDB id. Reason:', err);
	});
}

const imdbId = getImdbId();

if (isMovie() && imdbId) {
	const find = findTmdbByImdbId(imdbId);
	find.then((tmdbId) => {
		const titleReviewBar = document.querySelector('.titleReviewBar');

		// The Metacritic text in the review bar is a tiny bit too long, so we make it a bit shorter.
		const metacriticText = metacritic.querySelector('.titleReviewBarSubItem .subText');
		if (metacriticText) {
			metacriticText.innerHTML = metacriticText.innerHTML.replace('From', '');
		}

		const divider = document.createElement('div');
		divider.classList.add('divider')
		titleReviewBar.appendChild(divider);

		const button = document.createElement('a');
		button.classList.add('titleReviewBarItem');
		button.href = `https://movieo.me/movies/${tmdbId}`;
		button.title = 'Open movie in Movieo.';
		const img = document.createElement('img');
		img.src = chrome.extension.getURL('img/32.png');
		button.appendChild(img);
		titleReviewBar.appendChild(button)
	});
}
