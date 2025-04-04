export class Monument {
    constructor(nom, latitud, longitud, descripcio, imatge, codiPais) {
        this.nom = nom;
        this.latitud = latitud;
        this.longitud = longitud;
        this.descripcio = descripcio;
        this.imatge = imatge;
        this.codiPais = codiPais;
    }
}

export class Maravella extends Monument {
    constructor(nom, latitud, longitud, descripcio, imatge, codiPais, continent) {
        super(nom, latitud, longitud, descripcio, imatge, codiPais);
        this.continent = continent;
    }
}

// Classe per gestionar el mapa i els marcadors
export class MapaMaravelles {
    constructor() {
        this.mapa = L.map('map').setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(this.mapa);
        this.marcadors = new Map();
    }

    async obtenirBandera(codiPais) {
        try {
            const resposta = await fetch(`https://restcountries.com/v3.1/alpha/${codiPais}`);
            const dades = await resposta.json();
            return dades[0]?.flags?.svg || '';
        } catch (error) {
            console.error("Error obtenint la bandera:", error);
            return '';
        }
    }

    async mostrarMaravelles(maravelles) {
        this.marcadors.forEach(marcador => this.mapa.removeLayer(marcador));
        this.marcadors.clear();
        
        const llistaMaravelles = document.getElementById('llista-maravelles');
        llistaMaravelles.innerHTML = '';

        for (const maravella of maravelles) {
            const { nom, latitud, longitud, descripcio, imatge, codiPais } = maravella;
            if (!isNaN(parseFloat(latitud)) && !isNaN(parseFloat(longitud))) {
                const bandera = await this.obtenirBandera(codiPais);
                const marcador = L.marker([latitud, longitud]).addTo(this.mapa);
                marcador.bindPopup(`<b>${nom}</b><br>${descripcio}<br><img src="${imatge}" width="100">`);
                this.marcadors.set(nom, marcador);

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

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const nom = event.target.getAttribute('data-nom');
                this.eliminarMaravella(nom);
            });
        });
    }

    eliminarMaravella(nom) {
        if (this.marcadors.has(nom)) {
            this.mapa.removeLayer(this.marcadors.get(nom));
            this.marcadors.delete(nom);
        }
        
        const llistaMaravelles = document.getElementById('llista-maravelles');
        const elements = llistaMaravelles.querySelectorAll('li');
        elements.forEach(el => {
            if (el.innerHTML.includes(nom)) {
                el.remove();
            }
        });

        this.gestorCSV.totesLesMaravelles = this.gestorCSV.totesLesMaravelles.filter(m => m.nom !== nom);
    }

    assignarGestorCSV(gestorCSV) {
        this.gestorCSV = gestorCSV;
    }
}
