# Mapa de les Meravelles del Món 🌍

Aquest projecte permet visualitzar les Meravelles del Món en un mapa interactiu utilitzant **Leaflet.js**. Es poden carregar dades des d'un fitxer CSV mitjançant arrossegar i deixar anar (drag & drop). A més, incorpora filtres per continent i mostra informació detallada de cada lloc.

## 🚀 Funcionalitats

- 📌 **Mapa interactiu** amb Leaflet.js
- 📂 **Arrossegament i càrrega de CSV** per afegir meravelles
- 🌎 **Filtrat per continent**
- 🖼 **Visualització d'imatges** de les meravelles

## 🛠 Tecnologies utilitzades

- [Leaflet.js](https://leafletjs.com/) - Llibreria per mapes interactius
- [PapaParse](https://www.papaparse.com/) - Per llegir i processar arxius CSV
- HTML, CSS i JavaScript (ES6+)

## 📂 Estructura del projecte

```
📁 practica_leaflet
│── 📄 index.html       # Pàgina principal
│── 📄 styles.css       # Estils CSS
│── 📄 script.js        # Lògica principal
│── 📄 maravillas.csv         # Exemple de CSV amb meravelles del món
```

## 📥 Com utilitzar el projecte

1. **Baixa el projecte** o clona el repositori.
   ```bash
   git clone https://github.com/rdalmau23/practica_leaflet.git
   ```
2. **Obre `index.html` en un navegador**.
3. **Arrossega un fitxer CSV** amb les dades de les meravelles.
4. **Explora el mapa** i filtra per continent!

## 📝 Format del CSV

El fitxer CSV ha de tenir el següent format:

```
nom,latitud,longitud,continent,descripcio,imatge
Gran Muralla Xina,40.4319,116.5704,Àsia,La muralla més llarga del món,https://upload.wikimedia.org/wikipedia/commons/6/6f/Great_Wall_China.jpg
Petra,30.3285,35.4444,Àsia,Una ciutat excavada a la roca,https://upload.wikimedia.org/wikipedia/commons/e/ec/Petra_Jordan_BW_36.jpg
Colosseu,41.8902,12.4922,Europa,Un antic amfiteatre romà,https://upload.wikimedia.org/wikipedia/commons/d/de/Colosseo_2020.jpg
```

## 🌟 Contribució

Si vols afegir noves funcionalitats, fes un **fork** i envia un **pull request**! Qualsevol millora és benvinguda. 🚀

## 📜 Llicència

Aquest projecte està sota la llicència MIT. Ets lliure d'usar-lo i modificar-lo!

---

💡 **Autor**: Rafel Dalmau  
📧 **Contacte**: rafelcod@gmail.com

