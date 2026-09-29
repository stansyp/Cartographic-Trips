window.onload = function () {
    waitForFoliumMap();
};

function waitForFoliumMap() {
    for (let key in window) {
        if (key.startsWith("map_") && window[key] instanceof L.Map) {
            const map = window[key];
            console.log("Mapa znaleziona:", key);
            min_zoom(map);
            map_boundaries(map);
            bindMarkerClickEvents();
            return; 
        }
    }
    console.log("Jeszcze nie znaleziono mapy...");
    setTimeout(waitForFoliumMap, 200);
}

function min_zoom(map) {
    map.setMinZoom(10);
    map.setMaxZoom(15);
    map.options.zoomSnap = 0;
    map.options.zoomDelta = 0.1;
}

function map_boundaries(map) {
    var bounds = L.latLngBounds(
        L.latLng(49.34, 21.63), 
        L.latLng(49.92, 23.37)
    );
    map.setMaxBounds(bounds);

    map.on("drag", function () {
        map.panInsideBounds(bounds, { animate: false });
    });
}

function bindMarkerClickEvents() {
    const mapKey = Object.keys(window).find(k => k.startsWith("map_"));
    if (!mapKey || !(window[mapKey] instanceof L.Map)) {
        console.warn("Nie znaleziono mapy do OMS.");
        return;
    }
    const map = window[mapKey];
    const oms = new OverlappingMarkerSpiderfier(map);

    for (let key in window) {
        if (key.startsWith("marker_") && window[key] instanceof L.Marker) {
            const marker = window[key];
            oms.addMarker(marker);
        }
    }

    oms.addListener('click', function (marker) {
        const lat = marker.getLatLng().lat.toFixed(5);
        const lng = marker.getLatLng().lng.toFixed(5);
        const url = `https://www.google.com/maps/place/${lat},${lng}?hl=pl`;
        window.open(url, '_blank');
    });

    oms.addListener('spiderfy', function (markers) {
        markers.forEach(m => m.setZIndexOffset(1000));
    });

    oms.addListener('unspiderfy', function (markers) {
        markers.forEach(m => m.setZIndexOffset(0));
    });
}

function toggleLegend() {
  const box = document.getElementById('legendBox');
  const icon = document.getElementById('legendIcon');

  const isCollapsed = box.classList.toggle('collapsed');

  // steruj widocznością ikony FA poza legendą
  if (isCollapsed) {
    icon.style.visibility = 'visible';
  } else {
    icon.style.visibility = 'hidden';
  }
}
