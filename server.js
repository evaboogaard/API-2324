import 'dotenv/config';
import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';
import fetch from 'node-fetch';
import fs from 'node:fs';

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
const apiKey = process.env.MOVIEDB_TOKEN; // API-sleutel uit .env-bestand
const apiUrl = `${baseUrl}/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&sort_by=vote_count.desc&with_genres=878`;
const app = new App();

app.use(logger()).use('/', sirv('dist/assets')).listen(3000);

// const modeUrls = {
//   'trending': `${baseUrl}/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc&with_genres=878`,
//   'classic': `${baseUrl}/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&sort_by=vote_count.desc&with_genres=878`,
//   'obscure': `${baseUrl}/discover/movie?api_key=${apiKey}&include_adult=false&include_video=false&language=en-US&page=100&sort_by=vote_count.desc&with_genres=878`
// };


app.get('/', async (req, res) => {
  try {
    let movies;
    // const selectedMode = req.query.mode || 'trending'; // standaard modus

    // Als de geselecteerde modus overeenkomt met een geldige URL, haal dan films op met die URL
    // if (modeUrls[selectedMode]) {
    //   movies = await getMovies(modeUrls[selectedMode]);
    // } else {
      // Als de modus niet geldig is, haal films op met de standaard URL
      movies = await getMovies(apiUrl);
    // }

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

    // Hier kun je de gewenste bewerkingen uitvoeren op de verkregen filmgegevens
    const sciFiMovies = data.results.filter(movie => movie.genre_ids.includes(878));

    console.log('Movie runtimes:', data.results.map(movie => movie.runtime));


    return sciFiMovies.map(movie => ({
      title: movie.title,
      overview: movie.overview,
      trailerLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title)}+trailer`,
      posterImg: movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : null,
      duration: movie.runtime || 0,
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

app.get('/details', async (req, res) => {
  return res.send(
    renderTemplate('views/detail.liquid', { title: 'Another Title' }),
  );
});

const renderTemplate = (template, data) => {
  const templateData = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    ...data,
  };

  return engine.renderFileSync(template, templateData);
};

