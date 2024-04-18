/* eslint-disable no-inner-declarations */

const imageContainers = document.querySelectorAll('.images-container');

if (imageContainers) {
  imageContainers.forEach(imageContainer => {
    gsap.to(imageContainer, {
      scrollTrigger: {
        trigger: imageContainer,
        start: 'top bottom',
        scrub: true
      },
      '--i': 1
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  const planetItems = document.querySelectorAll('.planet');

  planetItems.forEach(function (planet) {
    planet.addEventListener('click', function () {
      const movieContent = this.nextElementSibling;
      toggleMovieContent(movieContent);
    });
  });

  function toggleMovieContent (movieContent) {
    movieContent.classList.toggle('shown');
  }

  const maxLength = 200; // Maximaal aantal tekens
  const paragraphs = document.querySelectorAll('.overview');

  paragraphs.forEach(paragraph => {
    const originalText = paragraph.textContent.trim();

    if (originalText.length > maxLength) {
      const truncatedText = originalText.slice(0, maxLength) + '...';
      paragraph.textContent = truncatedText;
    }
  });
});


const logo = document.querySelector('.logo');

// if (logo) {
//   gsap.to(logo, {
//     scale: 3,
//     duration: 1,
//     }
//   );
// }


// if (logo) {
//   gsap.from(logo, {
//     scale: 3,
//     duration: 0.5,
//     },
//   );
// }

const logoTl = gsap.timeline({ delay: 13 });
logoTl.to(logo, {
  scale: 1,
  ease: 'power4.out',
  delay: .5,
});
logoTl.to(logo,{
  y: 0,
  ease: 'power4.out',
});
logoTl.to(logo, {
  rotate: '360deg',
  ease: 'power4.out',
});
logoTl.to(logo, {
  scale: 0.6,
  ease: 'bounce.out',
});

// power4.out

const movieContents = document.querySelectorAll('.movie-content');

movieContents.forEach(movieContent => {
  gsap.to(movieContent, {
    scrollTrigger: {
      trigger: movieContent,
      start: 'top bottom',
      end: 'bottom',
      scrub: true
    },
    y: -100,
    scale: 0.9
  });

  const textImg = movieContent.querySelectorAll('img');
  gsap.to(textImg, {
    scrollTrigger: {
      trigger: movieContent,
      start: 'top bottom',
      end: 'bottom',
      scrub: true
    },
    scale: 1.2,
    x: 20
  });
});

const sun = document.querySelector('#sun');

gsap.to(sun, {
  scrollTrigger: {
    trigger: sun,
    start: 'top bottom',
    end: 'bottom',
    scrub: true
    },
  scale: 1.1
});

gsap.from(sun, {
  x: '-100vw',
  ease: 'power4.out',
  duration: 2,
  delay: 12,
  onComplete: startOtherAnimations // De haakjes zijn verwijderd om de functie niet meteen uit te voeren
});

function startOtherAnimations () { // De haakjes zijn verwijderd van de functiedeclaratie
  const planetsOdd = document.querySelectorAll('.galaxy li:nth-of-type(odd) .planet:not(#sun)');
  const planetTlOne = gsap.timeline();
  planetsOdd.forEach(planet => {
    planetTlOne.from(planet, {
      x: '-100vw',
      ease: 'power4.out',
      duration: 2,
    });
  });

  const planetsEven = document.querySelectorAll('.galaxy li:nth-of-type(even) .planet');
  const planetTlTwo = gsap.timeline();
  planetsEven.forEach(planet => {
    planetTlTwo.from(planet, {
      x: '100vw',
      ease: 'power4.out',
      duration: 2,
    });
  });
}

const planetsOdd = document.querySelectorAll('.galaxy li:nth-of-type(odd) .planet');
const planetTlOne = gsap.timeline();
planetsOdd.forEach(planet => {
  planetTlOne.from(planet, {
    x: '-100vw',
    ease: 'power4.out',
    duration: 2
  });
});

const planetsEven = document.querySelectorAll('.galaxy li:nth-of-type(even) .planet');
const planetTlTwo = gsap.timeline();
planetsEven.forEach(planet => {
  planetTlTwo.from(planet, {
    x: '100vw',
    ease: 'power4.out',
    duration: 2
  });
});

const stars = document.querySelector('.stars');
if (stars) {
  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateRandomShadow () {
    return `${getRandomInt(0, 100)}vw ${getRandomInt(0, 100)}vh`;
  }

  function updateStars () {
    let boxShadowValues = '';
    for (let i = 0; i < 100; i++) {
      boxShadowValues += `${generateRandomShadow()} 0 white, `;
    }
      stars.style.boxShadow = boxShadowValues.slice(0, -2);
  }
  updateStars();
  stars.addEventListener('click', updateStars);
}
  // Functie om de loader aan te sturen
function runLoader () {
  const loaderElement = document.getElementById('percentage');
  const totalTime = 10000; // Totaal aantal milliseconden
  const updateInterval = 100; // Interval om het percentage bij te werken

  let currentTime = 0;

  const updatePercentage = () => {
      const percentage = Math.min((currentTime / totalTime) * 100, 100);
      loaderElement.textContent = `${percentage.toFixed(0)}%`;
  };

  const loaderInterval = setInterval(() => {
      currentTime += updateInterval;

      if (currentTime <= totalTime) {
          updatePercentage();
      } else {
          clearInterval(loaderInterval);
      }
  }, updateInterval);
}

// Start de loader wanneer het document is geladen
document.addEventListener('DOMContentLoaded', () => {
  runLoader();
});

document.addEventListener('DOMContentLoaded', function () {
  // Wait for the document to be fully loaded
  setTimeout(function () {
      // Get the loader element
      var loader = document.querySelector('.loader');

      // Add a class to hide the loader
      loader.classList.add('hidden');

      // Add another timeout to add 'none' class after 1 second (1000 milliseconds)
      setTimeout(function () {
          loader.classList.add('none');
      }, 1000);
  }, 12000); // 12 seconds in milliseconds
});


