(function attachIndexColorScales(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.IndexColorScaleConfig = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createIndexColorScales() {
  const NO_DATA = Object.freeze({ label: "NoData", color: "#BDBDBD", opacity: 0 });
  const INDEX_COLOR_SCALES = Object.freeze({
    NDVI: {
      name: "NDVI",
      description: "Vigor vegetal y cobertura activa",
      levels: [
        { max: 0.20, label: "Muy bajo", color: "#D73027", range: "≤ 0,20", interpretation: "Suelo, vegetación inexistente o extremadamente débil." },
        { max: 0.40, label: "Bajo", color: "#FC8D59", range: "> 0,20 y ≤ 0,40", interpretation: "Vegetación escasa o bajo vigor." },
        { max: 0.60, label: "Medio", color: "#FEE08B", range: "> 0,40 y ≤ 0,60", interpretation: "Vigor intermedio." },
        { max: 0.80, label: "Alto", color: "#91CF60", range: "> 0,60 y ≤ 0,80", interpretation: "Vegetación vigorosa." },
        { max: null, label: "Muy alto", color: "#1A9850", range: "> 0,80", interpretation: "Cobertura muy densa y alto vigor." }
      ]
    },
    NDMI: {
      name: "NDMI",
      description: "Humedad de vegetación y estrés hídrico",
      levels: [
        { max: -0.20, label: "Muy bajo", color: "#A6611A", range: "≤ -0,20", interpretation: "Estrés hídrico fuerte o vegetación muy seca." },
        { max: 0.00, label: "Bajo", color: "#DFC27D", range: "> -0,20 y ≤ 0,00", interpretation: "Baja humedad." },
        { max: 0.20, label: "Medio", color: "#F6E8A6", range: "> 0,00 y ≤ 0,20", interpretation: "Humedad intermedia." },
        { max: 0.40, label: "Alto", color: "#80CDC1", range: "> 0,20 y ≤ 0,40", interpretation: "Buena humedad vegetal." },
        { max: null, label: "Muy alto", color: "#2166AC", range: "> 0,40", interpretation: "Humedad elevada." }
      ]
    },
    NDRE: {
      name: "NDRE",
      description: "Clorofila y vigor en canopia desarrollada",
      levels: [
        { max: 0.10, label: "Muy bajo", color: "#D73027", range: "≤ 0,10", interpretation: "Clorofila o vigor muy bajo." },
        { max: 0.20, label: "Bajo", color: "#FC8D59", range: "> 0,10 y ≤ 0,20", interpretation: "Bajo contenido relativo de clorofila." },
        { max: 0.35, label: "Medio", color: "#FEE08B", range: "> 0,20 y ≤ 0,35", interpretation: "Condición intermedia." },
        { max: 0.50, label: "Alto", color: "#91CF60", range: "> 0,35 y ≤ 0,50", interpretation: "Buena condición de la canopia." },
        { max: null, label: "Muy alto", color: "#1A9850", range: "> 0,50", interpretation: "Clorofila y vigor elevados." }
      ]
    },
    GNDVI: {
      name: "GNDVI",
      description: "Clorofila y respuesta nitrogenada",
      levels: [
        { max: 0.20, label: "Muy bajo", color: "#D73027", range: "≤ 0,20", interpretation: "Respuesta vegetal muy baja." },
        { max: 0.40, label: "Bajo", color: "#FDAE61", range: "> 0,20 y ≤ 0,40", interpretation: "Respuesta baja." },
        { max: 0.55, label: "Medio", color: "#FFFFBF", range: "> 0,40 y ≤ 0,55", interpretation: "Respuesta intermedia." },
        { max: 0.70, label: "Alto", color: "#A6D96A", range: "> 0,55 y ≤ 0,70", interpretation: "Buena respuesta vegetal." },
        { max: null, label: "Muy alto", color: "#1A9641", range: "> 0,70", interpretation: "Respuesta vegetal o clorofila muy alta." }
      ]
    },
    SAVI: {
      name: "SAVI",
      description: "Vigor vegetal con influencia de suelo expuesto",
      levels: [
        { max: 0.15, label: "Muy bajo", color: "#A6611A", range: "≤ 0,15", interpretation: "Predominio de suelo o vegetación mínima." },
        { max: 0.30, label: "Bajo", color: "#DFC27D", range: "> 0,15 y ≤ 0,30", interpretation: "Poca cobertura vegetal." },
        { max: 0.50, label: "Medio", color: "#FEE08B", range: "> 0,30 y ≤ 0,50", interpretation: "Cobertura intermedia." },
        { max: 0.70, label: "Alto", color: "#91CF60", range: "> 0,50 y ≤ 0,70", interpretation: "Buena cobertura." },
        { max: null, label: "Muy alto", color: "#1A9850", range: "> 0,70", interpretation: "Cobertura vegetal densa." }
      ]
    },
    NDWI: {
      name: "NDWI",
      description: "Agua superficial y zonas con exceso de humedad",
      levels: [
        { max: -0.30, label: "Muy bajo", color: "#A6611A", range: "≤ -0,30", interpretation: "Superficie seca." },
        { max: -0.10, label: "Bajo", color: "#DFC27D", range: "> -0,30 y ≤ -0,10", interpretation: "Baja humedad superficial." },
        { max: 0.10, label: "Medio", color: "#F7F7BF", range: "> -0,10 y ≤ 0,10", interpretation: "Zona de transición." },
        { max: 0.30, label: "Alto", color: "#67A9CF", range: "> 0,10 y ≤ 0,30", interpretation: "Alta humedad o posible presencia de agua." },
        { max: null, label: "Muy alto", color: "#2166AC", range: "> 0,30", interpretation: "Agua o humedad superficial elevada." }
      ]
    },
    MSAVI2: {
      name: "MSAVI2",
      description: "Vigor vegetal ajustado por presencia de suelo",
      levels: [
        { max: 0.15, label: "Muy bajo", color: "#8C510A", range: "≤ 0,15", interpretation: "Predominio de suelo." },
        { max: 0.30, label: "Bajo", color: "#D8B365", range: "> 0,15 y ≤ 0,30", interpretation: "Vegetación escasa." },
        { max: 0.50, label: "Medio", color: "#F6E8C3", range: "> 0,30 y ≤ 0,50", interpretation: "Vigor intermedio." },
        { max: 0.70, label: "Alto", color: "#7FBF7B", range: "> 0,50 y ≤ 0,70", interpretation: "Buen vigor." },
        { max: null, label: "Muy alto", color: "#1B7837", range: "> 0,70", interpretation: "Vigor vegetal muy alto." }
      ]
    },
    VARI: {
      name: "VARI",
      description: "Verdor visible calculado mediante bandas RGB",
      levels: [
        { max: 0.00, label: "Muy bajo", color: "#D73027", range: "≤ 0,00", interpretation: "Poco o ningún verdor." },
        { max: 0.10, label: "Bajo", color: "#FC8D59", range: "> 0,00 y ≤ 0,10", interpretation: "Verdor bajo." },
        { max: 0.20, label: "Medio", color: "#FEE08B", range: "> 0,10 y ≤ 0,20", interpretation: "Verdor intermedio." },
        { max: 0.40, label: "Alto", color: "#91CF60", range: "> 0,20 y ≤ 0,40", interpretation: "Vegetación verde." },
        { max: null, label: "Muy alto", color: "#1A9850", range: "> 0,40", interpretation: "Verdor elevado." }
      ]
    },
    MTVI2: {
      name: "MTVI2",
      description: "Clorofila y vigor de la canopia",
      levels: [
        { max: 0.20, label: "Muy bajo", color: "#D73027", range: "≤ 0,20", interpretation: "Canopia muy pobre." },
        { max: 0.40, label: "Bajo", color: "#FC8D59", range: "> 0,20 y ≤ 0,40", interpretation: "Bajo vigor." },
        { max: 0.60, label: "Medio", color: "#FEE08B", range: "> 0,40 y ≤ 0,60", interpretation: "Vigor medio." },
        { max: 0.80, label: "Alto", color: "#91CF60", range: "> 0,60 y ≤ 0,80", interpretation: "Buen vigor." },
        { max: null, label: "Muy alto", color: "#1A9850", range: "> 0,80", interpretation: "Canopia muy vigorosa." }
      ]
    },
    TGI: {
      name: "TGI",
      description: "Verdor y clorofila utilizando bandas visibles",
      relative: true,
      percentileKeys: [20, 40, 60, 80],
      levels: [
        { percentileMax: 20, label: "Muy bajo", color: "#D73027", range: "0-20 %", interpretation: "Verdor relativo muy bajo." },
        { percentileMax: 40, label: "Bajo", color: "#FC8D59", range: "20-40 %", interpretation: "Verdor relativo bajo." },
        { percentileMax: 60, label: "Medio", color: "#FEE08B", range: "40-60 %", interpretation: "Verdor relativo intermedio." },
        { percentileMax: 80, label: "Alto", color: "#91CF60", range: "60-80 %", interpretation: "Verdor relativo alto." },
        { percentileMax: 100, label: "Muy alto", color: "#1A9850", range: "80-100 %", interpretation: "Verdor relativo muy alto." }
      ]
    }
  });

  function getIndexScale(indexType) {
    return INDEX_COLOR_SCALES[String(indexType || "NDVI").toUpperCase()] || INDEX_COLOR_SCALES.NDVI;
  }

  function getIndexThresholds(indexType, relativeThresholds) {
    const scale = getIndexScale(indexType);
    if (scale.relative) {
      const values = Array.isArray(relativeThresholds) ? relativeThresholds.map(Number).filter(Number.isFinite) : [];
      return values.length === 4 ? values : [];
    }
    return scale.levels.slice(0, -1).map((level) => Number(level.max));
  }

  function getIndexLevel(indexType, value, relativeThresholds) {
    const scale = getIndexScale(indexType);
    if (value === null || value === "" || typeof value === "undefined") return { ...NO_DATA };
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return { ...NO_DATA };
    const thresholds = getIndexThresholds(indexType, relativeThresholds);
    if (scale.relative && thresholds.length !== 4) return { ...NO_DATA, pending: true };
    const levelIndex = thresholds.findIndex((threshold) => numericValue <= threshold);
    return scale.levels[levelIndex < 0 ? scale.levels.length - 1 : levelIndex];
  }

  function getIndexLegend(indexType) {
    return getIndexScale(indexType).levels.map((level) => ({ ...level }));
  }

  return Object.freeze({ NO_DATA, INDEX_COLOR_SCALES, getIndexScale, getIndexThresholds, getIndexLevel, getIndexLegend });
});
