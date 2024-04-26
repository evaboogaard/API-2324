import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';
import fetch from 'node-fetch';

const engine = new Liquid({
  extname: '.liquid',
});

const baseUrl = 'https://api.themoviedb.org/3';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlMmMwMTUyM2MwZDI4MDkwM2YxNWVjOWJiN2EyYTA2MyIsInN1YiI6IjY2MGJkYWQ1MTQ5NTY1MDE3ZGJiMTYzYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3ODaT0udaIUcj9ClqusoZI7pHxRJmxprbC_GI4fzON4'
  }
};
const apiKey = process.env.MOVIEDB_TOKEN;
const apiUrl = `${baseUrl}/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&sort_by=vote_count.desc&with_genres=878&without_companies=420`;
const app = new App();

app.use(logger()).use('/', sirv('dist/assets')).listen(3000);

app.get('/', async (req, res) => {
  try {
    let movies;
    movies = await getMovies(apiUrl);

    return res.send(
      renderTemplate('views/index.liquid', { title: 'Galaxy Gaze', movies }),
    );
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  }
});

const getMovies = async (url) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    const sciFiMovies = data.results.filter(movie => movie.genre_ids.includes(878));
    const first10Movies = sciFiMovies.slice(0, 10);

    console.log(first10Movies.map(movie => movie.title));

    return first10Movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterImg: movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : null,
      language: movie.original_language,
      genres: mapGenres(movie.genre_ids),
      releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : null
    }));
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

const mapGenres = (genreIds) => {
  const genreMap = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };

  return genreIds.map(id => {
    const genreText = genreMap[id];
    if (!genreText) {
      console.warn(`Genre ID ${id} heeft geen overeenkomstige tekstuele genre`);
      return '';
    }
    return `<span>${genreText}</span>`;
  }).join(', ');
};


app.get('/:id', async (req, res) => {
  try {
    const movieId = req.params.id;

    const [
      movieResponse,
      imagesResponse,
      creditsResponse,
      similarResponse
    ] = await Promise.all([
      fetch(`${baseUrl}/movie/${movieId}?language=en-US`, options),
      fetch(`${baseUrl}/movie/${movieId}/images`, options),
      fetch(`${baseUrl}/movie/${movieId}/credits`, options),
      fetch(`${baseUrl}/movie/${movieId}/similar`, options)
    ]);

    const [
      movieData,
      imagesData,
      creditsData,
      similarData
    ] = await Promise.all([
      movieResponse.json(),
      imagesResponse.json(),
      creditsResponse.json(),
      similarResponse.json()
    ]);

    const movieWithImages = {
      ...movieData,
      images: imagesData.backdrops,
      credits: creditsData,
      similar: similarData
    };

    res.send(
      renderTemplate('views/detail.liquid', {
        title: 'Movie Detail',
        movie: movieWithImages
      })
    );
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data,
  };

  return engine.renderFileSync(template, templateData);
};

