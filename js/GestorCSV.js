// Classe per gestionar el processament del CSV

export class GestorCSV {
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
