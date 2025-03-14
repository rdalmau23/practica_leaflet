// Classe per gestionar el mapa i els marcadors
class MapaMaravelles {
    constructor() {
        this.mapa = L.map('map').setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(this.mapa);

        this.marcadors = new Map(); // Guardar els marcadors amb el nom com a clau
    }

    // Funció per obtenir la bandera del país utilitzant l'API
    async obtenirBandera(codiPais) {
        try {
            const resposta = await fetch(`https://restcountries.com/v3.1/alpha/${codiPais}`);
            const dades = await resposta.json();
            return dades[0]?.flags?.svg || ''; // Retorna la URL de la bandera en format SVG
        } catch (error) {
            console.error("Error obtenint la bandera:", error);
            return ''; // Si hi ha error, retorna una cadena buida
        }
    }

    async mostrarMaravelles(maravelles) {
        // Netejar marcadors antics
        this.marcadors.forEach(marcador => this.mapa.removeLayer(marcador));
        this.marcadors.clear();

        const llistaMaravelles = document.getElementById('llista-maravelles');
        llistaMaravelles.innerHTML = '';

        for (const lloc of maravelles) {
            const { nom, latitud, longitud, descripcio, imatge, codiPais } = lloc;

            if (!isNaN(parseFloat(latitud)) && !isNaN(parseFloat(longitud))) {
                // Obtenir la bandera del país
                const bandera = await this.obtenirBandera(codiPais);

                // Afegir marcador al mapa
                const marcador = L.marker([latitud, longitud]).addTo(this.mapa);
                marcador.bindPopup(`<b>${nom}</b><br>${descripcio}<br><img src="${imatge}" width="100">`);
                this.marcadors.set(nom, marcador);

                // Afegir a la llista lateral
                const elementLlista = document.createElement('li');
                elementLlista.innerHTML = `
                    <b>${nom}</b><br>
                    <img src="${imatge}" width="100"><br>
                    ${descripcio}
                    ${bandera ? `<img src="${bandera}" width="30">` : ''}
                    <button class="btn-delete" data-nom="${nom}">❌</button>
                `;
                llistaMaravelles.appendChild(elementLlista);
            }
        }

        // Afegir esdeveniments als botons de delete
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const nom = event.target.getAttribute('data-nom');
                this.eliminarMaravella(nom);
            });
        });
    }

    eliminarMaravella(nom) {
        // Eliminar del mapa
        if (this.marcadors.has(nom)) {
            this.mapa.removeLayer(this.marcadors.get(nom));
            this.marcadors.delete(nom);
        }

        // Eliminar de la llista
        const llistaMaravelles = document.getElementById('llista-maravelles');
        const elements = llistaMaravelles.querySelectorAll('li');
        elements.forEach(el => {
            if (el.innerHTML.includes(nom)) {
                el.remove();
            }
        });

        // Eliminar de la llista general de meravelles
        this.gestorCSV.totesLesMaravelles = this.gestorCSV.totesLesMaravelles.filter(m => m.nom !== nom);
    }

    assignarGestorCSV(gestorCSV) {
        this.gestorCSV = gestorCSV;
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
    mapa.assignarGestorCSV(gestorCSV);
    new UI(mapa, gestorCSV);
});
