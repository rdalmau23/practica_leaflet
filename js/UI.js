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
        const filtreTipus = document.getElementById('filtre-tipus');
        filtreTipus.addEventListener('change', (event) => {
            const tipusSeleccionat = event.target.value;
            let filtrades;
    
            if (tipusSeleccionat === "Tots") {
                filtrades = this.gestorCSV.totesLesMaravelles;
            } else {
                filtrades = this.gestorCSV.totesLesMaravelles.filter(m => m.tipus === tipusSeleccionat);
            }
    
            this.mapa.mostrarMaravelles(filtrades);
        });
    }
}
