// mapa del mon
const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Funció porcessar csv
function procesarCSV(file) {
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const datos = results.data;
            datos.forEach(lugar => {
                const nombre = lugar.nombre;
                const latitud = parseFloat(lugar.latitud);
                const longitud = parseFloat(lugar.longitud);

                if (!isNaN(latitud) && !isNaN(longitud)) {
                    const marcador = L.marker([latitud, longitud]).addTo(map);
                    marcador.bindPopup(`<b>${nombre}</b>`);
                }
            });
        }
    });
}

// drop fitxer csv
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
    
    // Verifica que sigui fitxer csv
    if (archivo && archivo.type === "text/csv") {
        procesarCSV(archivo);
    } else {
        alert("Por favor, sube un archivo CSV válido.");
    }
});
