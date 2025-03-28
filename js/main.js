import { MapaMaravelles } from './MapaMaravelles.js';
import { GestorCSV } from './GestorCSV.js';
import { UI } from './UI.js';

// Inicialització de la aplicació

document.addEventListener('DOMContentLoaded', () => {
    const mapa = new MapaMaravelles();
    const gestorCSV = new GestorCSV(mapa.mostrarMaravelles.bind(mapa));
    mapa.assignarGestorCSV(gestorCSV);
    new UI(mapa, gestorCSV);
});
