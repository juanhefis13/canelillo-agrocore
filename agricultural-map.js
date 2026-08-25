(function registerAgriculturalMap(global) {
  "use strict";

  const MAP_OPTIONS = Object.freeze({
    mapTypeId: "satellite",
    disableDefaultUI: false,
    streetViewControl: false,
    fullscreenControl: true,
    mapTypeControl: true,
    zoomControl: true,
    clickableIcons: false,
    gestureHandling: "greedy",
    scrollwheel: true,
    draggable: true,
    keyboardShortcuts: true,
    tilt: 0,
    backgroundColor: "#10271f"
  });

  const BLOCK_STYLE = Object.freeze({
    strokeColor: "#ffd84d",
    strokeOpacity: 0.96,
    strokeWeight: 1.8,
    fillColor: "#f4c542",
    fillOpacity: 0.08,
    zIndex: 4
  });

  const POTRERO_STYLE = Object.freeze({
    strokeColor: "#ffffff",
    strokeOpacity: 0.98,
    strokeWeight: 3.2,
    fillOpacity: 0,
    clickable: false,
    zIndex: 8
  });

  function ringArea(ring = []) {
    let area = 0;
    for (let index = 0; index < ring.length; index += 1) {
      const [x1, y1] = ring[index];
      const [x2, y2] = ring[(index + 1) % ring.length];
      area += Number(x1) * Number(y2) - Number(x2) * Number(y1);
    }
    return area / 2;
  }

  function pointInRing(point, ring = []) {
    let inside = false;
    const [x, y] = point;
    for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
      const [xi, yi] = ring[index];
      const [xj, yj] = ring[previous];
      const intersects = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / ((yj - yi) || Number.EPSILON) + xi);
      if (intersects) inside = !inside;
    }
    return inside;
  }

  function ringCentroid(ring = []) {
    const area = ringArea(ring);
    if (!ring.length || Math.abs(area) < Number.EPSILON) return null;
    let x = 0;
    let y = 0;
    for (let index = 0; index < ring.length; index += 1) {
      const [x1, y1] = ring[index];
      const [x2, y2] = ring[(index + 1) % ring.length];
      const factor = Number(x1) * Number(y2) - Number(x2) * Number(y1);
      x += (Number(x1) + Number(x2)) * factor;
      y += (Number(y1) + Number(y2)) * factor;
    }
    return [x / (6 * area), y / (6 * area)];
  }

  function center(rings) {
    const validRings = (rings || []).filter((ring) => Array.isArray(ring) && ring.length >= 3);
    if (!validRings.length) return { lat: 0, lng: 0 };
    const ring = [...validRings].sort((a, b) => Math.abs(ringArea(b)) - Math.abs(ringArea(a)))[0];
    const lngs = ring.map((point) => Number(point[0])).filter(Number.isFinite);
    const lats = ring.map((point) => Number(point[1])).filter(Number.isFinite);
    const boundsCenter = [
      (Math.min(...lngs) + Math.max(...lngs)) / 2,
      (Math.min(...lats) + Math.max(...lats)) / 2
    ];
    const centroid = ringCentroid(ring);
    const [lng, lat] = centroid && pointInRing(centroid, ring)
      ? centroid
      : pointInRing(boundsCenter, ring)
        ? boundsCenter
        : ring[Math.floor(ring.length / 2)];
    return { lat, lng };
  }

  function shiftedLabelPosition(point, index, meters = 34) {
    const directions = [
      { lat: 1, lng: 1 }, { lat: -1, lng: 1 },
      { lat: 1, lng: -1 }, { lat: -1, lng: -1 },
      { lat: 0, lng: 1 }, { lat: 1, lng: 0 }
    ];
    const direction = directions[index % directions.length];
    const safeCos = Math.max(0.2, Math.abs(Math.cos(point.lat * Math.PI / 180)));
    return {
      lat: point.lat + meters / 111320 * direction.lat,
      lng: point.lng + meters / (111320 * safeCos) * direction.lng
    };
  }

  function createLabel(maps, position, text, className = "") {
    class AgriculturalLabelOverlay extends maps.OverlayView {
      constructor() {
        super();
        this.element = null;
        this.visible = true;
      }

      onAdd() {
        this.element = document.createElement("div");
        this.element.className = `map-label-google agricultural-map-label ${className}`.trim();
        this.element.textContent = text;
        this.element.style.display = this.visible ? "block" : "none";
        this.getPanes().overlayMouseTarget.appendChild(this.element);
      }

      draw() {
        if (!this.element) return;
        const point = this.getProjection().fromLatLngToDivPixel(new maps.LatLng(position.lat, position.lng));
        this.element.style.left = `${point.x}px`;
        this.element.style.top = `${point.y}px`;
      }

      onRemove() {
        this.element?.remove();
        this.element = null;
      }

      setVisible(visible) {
        this.visible = Boolean(visible);
        if (this.element) this.element.style.display = this.visible ? "block" : "none";
      }

      getElement() {
        return this.element;
      }
    }
    return new AgriculturalLabelOverlay();
  }

  function createLabelCollisionController(maps, map, entries = []) {
    let animationFrame = 0;
    const overlaps = (first, second, padding = 3) => !(
      first.right + padding <= second.left
      || first.left >= second.right + padding
      || first.bottom + padding <= second.top
      || first.top >= second.bottom + padding
    );
    const layout = () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        animationFrame = 0;
        const zoom = Number(map.getZoom?.() || 15);
        const occupied = [];
        [...entries]
          .sort((a, b) => (b.priority || 0) - (a.priority || 0))
          .forEach((entry) => {
            const minZoom = Number(entry.minZoom || 0);
            if (zoom < minZoom) {
              entry.label.setVisible(false);
              return;
            }
            entry.label.setVisible(true);
            const element = entry.label.getElement?.();
            if (!element) return;
            const rect = element.getBoundingClientRect();
            if (!rect.width || !rect.height || (!entry.allowOverlap && occupied.some((item) => overlaps(rect, item)))) {
              entry.label.setVisible(false);
              return;
            }
            occupied.push(rect);
          });
      });
    };
    const idleListener = maps.event.addListener(map, "idle", layout);
    layout();
    return {
      setMap(value) {
        if (value !== null) {
          layout();
          return;
        }
        if (animationFrame) cancelAnimationFrame(animationFrame);
        idleListener.remove?.();
      }
    };
  }

  function createIconMarker(maps, position, {
    iconUrl,
    label = "",
    title = "",
    className = "",
    onClick = null
  } = {}) {
    class AgriculturalIconOverlay extends maps.OverlayView {
      constructor() {
        super();
        this.element = null;
      }

      onAdd() {
        this.element = document.createElement(onClick ? "button" : "div");
        if (onClick) this.element.type = "button";
        this.element.className = `agricultural-map-icon ${className}`.trim();
        this.element.title = title || label;
        this.element.setAttribute("aria-label", title || label || "Ubicacion en el mapa");
        const image = document.createElement("img");
        image.src = iconUrl;
        image.alt = "";
        image.draggable = false;
        this.element.appendChild(image);
        if (label) {
          const caption = document.createElement("span");
          caption.textContent = label;
          this.element.appendChild(caption);
        }
        if (onClick) this.element.addEventListener("click", onClick);
        this.getPanes().overlayMouseTarget.appendChild(this.element);
      }

      draw() {
        if (!this.element) return;
        const point = this.getProjection().fromLatLngToDivPixel(new maps.LatLng(position.lat, position.lng));
        this.element.style.left = `${point.x}px`;
        this.element.style.top = `${point.y}px`;
      }

      onRemove() {
        this.element?.remove();
        this.element = null;
      }
    }
    return new AgriculturalIconOverlay();
  }

  function ensureMap({ maps, element, currentMap = null, currentElement = null, options = {} }) {
    const reusable = Boolean(currentMap && currentElement === element);
    const map = reusable ? currentMap : new maps.Map(element, { ...MAP_OPTIONS, ...options });
    map.setOptions({ ...MAP_OPTIONS, ...options });
    maps.event.trigger(map, "resize");
    return { map, created: !reusable };
  }

  function clearOverlays(overlays = []) {
    overlays.forEach((overlay) => overlay?.setMap?.(null));
    return [];
  }

  function groupRingItems(items, keyForItem) {
    const groups = new Map();
    (items || []).forEach((item, index) => {
      const rawKey = keyForItem ? keyForItem(item, index) : `item-${index}`;
      const key = String(rawKey || `item-${index}`);
      const group = groups.get(key) || { key, feature: item.feature, rings: [], items: [], index };
      group.rings.push(...(item.rings || []));
      group.items.push(item);
      groups.set(key, group);
    });
    return [...groups.values()];
  }

  function featureProperty(feature, names, fallback = "") {
    const properties = feature?.properties || {};
    for (const name of names) {
      const value = properties[name];
      if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
    }
    return fallback;
  }

  function geometryRings(geometry) {
    if (!geometry) return [];
    if (geometry.type === "Polygon") return geometry.coordinates.map((ring) => ring.map(([lng, lat]) => [Number(lng), Number(lat)]));
    if (geometry.type === "MultiPolygon") {
      return geometry.coordinates.flatMap((polygon) => polygon.map((ring) => ring.map(([lng, lat]) => [Number(lng), Number(lat)])));
    }
    return [];
  }

  function renderInfrastructureLayers({
    maps,
    map,
    casetas = null,
    tranques = null,
    casetaIconUrl = "assets/caseta-map-marker.png",
    showCasetas = true,
    showTranques = true,
    onCasetaClick = null
  }) {
    const bounds = new maps.LatLngBounds();
    const casetaOverlays = [];
    const tranqueOverlays = [];
    const labelOverlays = [];

    if (showTranques) {
      (tranques?.features || []).forEach((feature, index) => {
        const rings = geometryRings(feature.geometry);
        if (!rings.length) return;
        rings.forEach((ring) => {
          const path = ring.map(([lng, lat]) => ({ lat, lng }));
          const polygon = new maps.Polygon({
            paths: path,
            strokeColor: "#38bdf8",
            strokeOpacity: 0.32,
            strokeWeight: 1.2,
            fillColor: "#0284c7",
            fillOpacity: 0.22,
            clickable: false,
            zIndex: 9
          });
          polygon.setMap(map);
          const dashedBorder = new maps.Polyline({
            path,
            strokeOpacity: 0,
            icons: [{
              icon: {
                path: "M 0,-2 0,2",
                strokeColor: "#38bdf8",
                strokeOpacity: 1,
                strokeWeight: 3,
                scale: 1
              },
              offset: "0",
              repeat: "13px"
            }],
            clickable: false,
            zIndex: 12
          });
          dashedBorder.setMap(map);
          tranqueOverlays.push(polygon, dashedBorder);
          ring.forEach(([lng, lat]) => bounds.extend({ lat, lng }));
        });
        const name = featureProperty(feature, ["nombre", "Nombre_Tranque", "Nombre"], `Tranque ${index + 1}`);
        const label = createLabel(maps, center(rings), name, "map-label-tranque-google");
        label.setMap(map);
        labelOverlays.push(label);
      });
    }

    if (showCasetas) {
      (casetas?.features || []).forEach((feature, index) => {
        const rings = geometryRings(feature.geometry);
        if (!rings.length) return;
        const position = center(rings);
        const name = featureProperty(feature, ["nombre", "Alias", "Nombre"], `Caseta ${index + 1}`);
        const marker = createIconMarker(maps, position, {
          iconUrl: casetaIconUrl,
          label: name,
          title: name,
          className: "agricultural-map-caseta",
          onClick: onCasetaClick ? () => onCasetaClick({ feature, position, maps, map }) : null
        });
        marker.setMap(map);
        casetaOverlays.push(marker);
        rings.flat().forEach(([lng, lat]) => bounds.extend({ lat, lng }));
      });
    }

    return {
      bounds,
      casetaOverlays,
      tranqueOverlays,
      labelOverlays,
      overlays: [...tranqueOverlays, ...labelOverlays, ...casetaOverlays]
    };
  }

  function renderFieldLayers({
    maps,
    map,
    blockItems = [],
    potreroItems = [],
    blockKey,
    potreroKey,
    blockLabel,
    blockLabelPriority,
    blockLabelMinZoom,
    blockLabelAllowOverlap,
    potreroLabel,
    blockStyle,
    potreroStyle,
    onBlockClick,
    showBlocks = true,
    showPotreros = true,
    showBlockLabels = true,
    showPotreroLabels = true,
    shiftPotreroLabels = false
  }) {
    const bounds = new maps.LatLngBounds();
    const blockOverlays = [];
    const potreroOverlays = [];
    const labelOverlays = [];
    const labelCollisionEntries = [];
    const blockEntries = [];
    const blockGroups = groupRingItems(blockItems, blockKey);
    const potreroGroups = groupRingItems(potreroItems, potreroKey);

    blockGroups.forEach((group, index) => {
      const style = { ...BLOCK_STYLE, ...(blockStyle?.(group, index) || {}) };
      group.rings.forEach((ring) => {
        const polygon = new maps.Polygon({
          ...style,
          paths: ring.map(([lng, lat]) => ({ lat, lng }))
        });
        if (onBlockClick) polygon.addListener("click", (event) => onBlockClick({ event, group, polygon, maps, map }));
        if (showBlocks) polygon.setMap(map);
        blockOverlays.push(polygon);
        blockEntries.push({ polygon, key: group.key, group });
        ring.forEach(([lng, lat]) => bounds.extend({ lat, lng }));
      });
      const text = blockLabel?.(group, index);
      if (showBlockLabels && text) {
        const label = createLabel(maps, center(group.rings), text, "map-label-block-google");
        label.setMap(map);
        labelOverlays.push(label);
        labelCollisionEntries.push({
          label,
          priority: Number(blockLabelPriority?.(group, index)) || 1,
          minZoom: Number(blockLabelMinZoom?.(group, index)) || 15,
          allowOverlap: Boolean(blockLabelAllowOverlap?.(group, index))
        });
      }
    });

    potreroGroups.forEach((group, index) => {
      const style = { ...POTRERO_STYLE, ...(potreroStyle?.(group, index) || {}) };
      group.rings.forEach((ring) => {
        const polygon = new maps.Polygon({
          ...style,
          paths: ring.map(([lng, lat]) => ({ lat, lng }))
        });
        if (showPotreros) polygon.setMap(map);
        potreroOverlays.push(polygon);
        ring.forEach(([lng, lat]) => bounds.extend({ lat, lng }));
      });
      const text = potreroLabel?.(group, index);
      if (showPotreroLabels && text) {
        const basePosition = center(group.rings);
        const position = shiftPotreroLabels ? shiftedLabelPosition(basePosition, index) : basePosition;
        const label = createLabel(maps, position, text, "map-label-potrero-google");
        label.setMap(map);
        labelOverlays.push(label);
        labelCollisionEntries.push({ label, priority: 2, minZoom: 13 });
      }
    });

    if (labelCollisionEntries.length) {
      const collisionController = createLabelCollisionController(maps, map, labelCollisionEntries);
      labelOverlays.push(collisionController);
    }

    return {
      bounds,
      blockGroups,
      potreroGroups,
      blockEntries,
      blockOverlays,
      potreroOverlays,
      labelOverlays,
      overlays: [...blockOverlays, ...potreroOverlays, ...labelOverlays]
    };
  }

  function addGeoJsonLayer({ maps, map, geoJson, style, onClick }) {
    const layer = new maps.Data({ map });
    layer.addGeoJson(geoJson);
    if (style) layer.setStyle(style);
    if (onClick) layer.addListener("click", onClick);
    return layer;
  }

  global.AgroMap = Object.freeze({
    options: MAP_OPTIONS,
    styles: Object.freeze({ block: BLOCK_STYLE, potrero: POTRERO_STYLE }),
    ensureMap,
    clearOverlays,
    createLabel,
    createIconMarker,
    renderFieldLayers,
    renderInfrastructureLayers,
    addGeoJsonLayer,
    center,
    shiftedLabelPosition
  });
})(globalThis);
