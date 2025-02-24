// mapa del mon
const mapa = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(mapa);

let totesLesMaravelles = [];
let marcadors = [];

// Funció per processar CSV
function processarCSV(archivo) {
    Papa.parse(archivo, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const dades = results.data;
            totesLesMaravelles = dades;
            mostrarMaravelles(dades);
        }
    });
}

// Mostrar i marcar meravelles
    function mostrarMaravelles(maravelles) {
        marcadors.forEach(marcador => mapa.removeLayer(marcador));
        marcadors = [];
    
        const llistaMaravelles = document.getElementById('llista-maravelles');
        llistaMaravelles.innerHTML = '';
    
        maravelles.forEach(lloc => {
            const { nom, latitud, longitud, descripcio, imatge } = lloc;
    
            if (!isNaN(parseFloat(latitud)) && !isNaN(parseFloat(longitud))) {
                const marcador = L.marker([latitud, longitud]).addTo(mapa);
                marcador.bindPopup(`<b>${nom}</b><br>${descripcio}<br><img src="${imatge}" width="100">`);
                marcadors.push(marcador);
    
                const elementLlista = document.createElement('li');
                elementLlista.innerHTML = `
                    <b>${nom}</b><br>
                    <img src="${imatge}" width="100"><br>
                    ${descripcio}
                `;
                llistaMaravelles.appendChild(elementLlista);
            }
        });
    }
    

// Gestió de Dropzone
const dropzone = document.getElementById('dropzone');
dropzone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropzone.style.backgroundColor = "#e8f4ff";
});

dropzone.addEventListener('dragleave', () => {
    dropzone.style.backgroundColor = "transparent";
});

dropzone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropzone.style.backgroundColor = "transparent";
    const archivo = event.dataTransfer.files[0];
    
    if (archivo && archivo.type === "text/csv") {
        processarCSV(archivo);
    } else {
        alert("Si us plau, puja un fitxer CSV vàlid.");
    }
});

// Filtres per continent
const filtresContinents = document.getElementById('filtres-continents');
filtresContinents.addEventListener('click', (event) => {
    const continentSeleccionat = event.target.getAttribute('data-continent');
    if (continentSeleccionat === "Tots") {
        mostrarMaravelles(totesLesMaravelles);
    } else {
        const filtrades = totesLesMaravelles.filter(m => m.continent === continentSeleccionat);
        mostrarMaravelles(filtrades);
    }
});
