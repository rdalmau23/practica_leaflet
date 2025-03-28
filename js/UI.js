// Classe per gestionar la interfície d'usuari

export class UI {
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
