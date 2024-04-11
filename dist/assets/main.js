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
});

window.addEventListener('DOMContentLoaded', (event) => {
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
