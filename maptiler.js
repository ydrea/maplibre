// MapTiler Cloud implementation
const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/019975f1-0471-70ee-a396-4128df469a8c/style.json?key=oEh7tEurLBOuqu00VxyM',
    center: [8.54806714892635, 47.37180823552663],
    zoom: 10
});

// Add your GeoJSON layer
map.on('load', () => {
    map.addSource('rh-buffer', {
        type: 'geojson',
        data: geojsonData
    });
    
    map.addLayer({
        id: 'rh-buffer-layer',
        type: 'fill',
        source: 'rh-buffer',
        paint: {
            'fill-color': '#ff6b35',
            'fill-opacity': 0.5,
            'fill-outline-color': '#d84315'
        }
    });
});