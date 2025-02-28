// Classe per gestionar el mapa i els marcadors
class MapaMaravelles {
    constructor() {
        this.mapa = L.map('map').setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(this.mapa);

        this.marcadors = [];
    }

    mostrarMaravelles(maravelles) {
        // Netejar marcadors antics
        this.marcadors.forEach(marcador => this.mapa.removeLayer(marcador));
        this.marcadors = [];

        const llistaMaravelles = document.getElementById('llista-maravelles');
        llistaMaravelles.innerHTML = '';

        maravelles.forEach(lloc => {
            const { nom, latitud, longitud, descripcio, imatge } = lloc;

            if (!isNaN(parseFloat(latitud)) && !isNaN(parseFloat(longitud))) {
                // Afegir marcador al mapa
                const marcador = L.marker([latitud, longitud]).addTo(this.mapa);
                marcador.bindPopup(`<b>${nom}</b><br>${descripcio}<br><img src="${imatge}" width="100">`);
                this.marcadors.push(marcador);

                // Afegir a la llista lateral
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
}

// Classe per gestionar el processament del CSV
class GestorCSV {
    constructor(callback) {
        this.callback = callback;
        this.totesLesMaravelles = [];
    }

    processarCSV(archivo) {
        Papa.parse(archivo, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                this.totesLesMaravelles = results.data;
                this.callback(this.totesLesMaravelles);
            }
        });
    }
}

// Classe per gestionar la interfície d'usuari
class UI {
    constructor(mapa, gestorCSV) {
        this.mapa = mapa;
        this.gestorCSV = gestorCSV;
        this.configurarDropzone();
        this.configurarFiltres();
    }

    configurarDropzone() {
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
                this.gestorCSV.processarCSV(archivo);
            } else {
                alert("Si us plau, puja un fitxer CSV vàlid.");
            }
        });
    }

    configurarFiltres() {
        const filtresContinents = document.getElementById('filtres-continents');
        filtresContinents.addEventListener('click', (event) => {
            const continentSeleccionat = event.target.getAttribute('data-continent');
            if (continentSeleccionat === "Tots") {
                this.mapa.mostrarMaravelles(this.gestorCSV.totesLesMaravelles);
            } else {
                const filtrades = this.gestorCSV.totesLesMaravelles.filter(m => m.continent === continentSeleccionat);
                this.mapa.mostrarMaravelles(filtrades);
            }
        });
    }
}

// Inicialització de la aplicació
document.addEventListener('DOMContentLoaded', () => {
    const mapa = new MapaMaravelles();
    const gestorCSV = new GestorCSV(mapa.mostrarMaravelles.bind(mapa));
    new UI(mapa, gestorCSV);
});
