// console.log('hello world');
// document.querySelectorAll('input[name="content"]').forEach(radio => {
//   radio.addEventListener('change', async function (event) {
//     const selectedMode = event.target.value;

//     try {
//       // Stuur een AJAX-verzoek naar de server met de geselecteerde modus
//       const response = await fetch(`/?mode=${selectedMode}`);
//       const data = await response.text(); // of .json(), afhankelijk van de reactie

//       // Update de pagina met de nieuwe filmgegevens of voer andere acties uit zoals nodig
//       document.body.innerHTML = data;

//       // Zorg ervoor dat de geselecteerde radioknop gecontroleerd blijft
//       document.querySelector(`input[name="content"][value="${selectedMode}"]`).checked = true;
//     } catch (error) {
//       console.error('Error:', error);
//       // Handel eventuele fouten af
//     }
//   });
// });
