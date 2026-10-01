window.onload = function () {
    waitForFoliumMap();
};

function waitForFoliumMap() {
    for (let key in window) {
        if (key.startsWith("map_") && window[key] instanceof L.Map) {
            const map = window[key];            
            min_zoom(map);
            map_boundaries(map);
            bindMarkerClickEvents();
            window[key].on('click', hideLegend);
            window[key].on('baselayerchange', layerchange);
            return; 
        }
    }
    setTimeout(waitForFoliumMap, 200);
}

function min_zoom(map) {
    map.setMinZoom(9.8);
    map.setMaxZoom(19);
    map.options.zoomSnap = 0.2;
    map.options.zoomDelta = 0.2;
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

function layerchange(e) {
   
    var mapInstance = e.target; 

    document.querySelectorAll('.icon-label').forEach(label => {
        label.style.color = e.name === 'Satellite' ? 'wheat' : 'black';
    });

    if (e.layer && e.layer.options && e.layer.options.maxZoom) {
        var layerMaxZoom = e.layer.options.maxZoom;
        var dynamicMaxZoom = Math.min(18, layerMaxZoom); 
        mapInstance.setMaxZoom(dynamicMaxZoom);
    }
}

function bindMarkerClickEvents() {
    const mapKey = Object.keys(window).find(k => k.startsWith("map_"));
    if (!mapKey || !(window[mapKey] instanceof L.Map)) {
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

function hideLegend() {
    const box = document.getElementById('legendBox');

    if (!box.classList.contains('collapsed')) {
        toggleLegend();
    }
}


