// Alanya Kalesi CBS Portalı - GeoServer WFS/WMS & PostGIS Entegrasyonu
const GEOSERVER_URL = "http://localhost:8080/geoserver/alanya";

// Türkçe karakter duyarsız metin normalleştirme (İ/i, ı/i, ş/s, ğ/g, ü/u, ö/o, ç/c)
function normalizeTR(str) {
    if (!str) return "";
    return str
        .toString()
        .replace(/İ/g, "i")
        .replace(/I/g, "i")
        .replace(/ı/g, "i")
        .toLowerCase()
        .replace(/ş/g, "s")
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c");
}

// Harita Başlatma (Alanya Kalesi Yarımadası Merkezli - EPSG:4326)
const map = L.map("map", {
    center: [36.5355, 31.9920],
    zoom: 15,
    zoomControl: true
});

// Altlık Haritalar (Base Maps)
const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution: "&copy; OpenStreetMap katkıcıları"
});

const satelliteLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics"
});

const darkLayer = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 20,
    attribution: "&copy; OpenStreetMap &copy; CARTO"
});

satelliteLayer.addTo(map);

// GeoServer Canlı WMS Katmanı
const geoserverWmsLayer = L.tileLayer.wms(`${GEOSERVER_URL}/wms`, {
    layers: "alanya:riskli_alanlar,alanya:yuruyus_yollari,alanya:yapilar,alanya:sarniclar,alanya:kapilar",
    format: "image/png",
    transparent: true,
    version: "1.1.0",
    attribution: "GeoServer WMS (alanya)"
});

const baseMaps = {
    "Uydu Görüntüsü (Esri)": satelliteLayer,
    "OpenStreetMap (Sokak)": osmLayer,
    "Koyu Tema (CartoDB)": darkLayer
};

const overlayMaps = {
    "GeoServer Canlı WMS Katmanı": geoserverWmsLayer
};

L.control.layers(baseMaps, overlayMaps, { position: "topright" }).addTo(map);
L.control.scale({ metric: true, imperial: false, position: "bottomright" }).addTo(map);

// Canlı Koordinat Gösterimi (EPSG:4326)
const coordBadge = document.getElementById("coord-display");
map.on("mousemove", (e) => {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    coordBadge.textContent = `EPSG:4326 | K: ${lat}° D: ${lng}°`;
});

// Katman Konfigürasyonu (10 Mekânsal Katman)
const LAYER_CONFIG = {
    yapilar: { title: "Tarihi Yapılar", color: "#f59e0b", type: "point", radius: 9, visible: true },
    kapilar: { title: "Kale Kapıları", color: "#10b981", type: "point", radius: 7, visible: true },
    sarniclar: { title: "Tarihi Sarnıçlar", color: "#06b6d4", type: "point", radius: 7, visible: true },
    kitabeler: { title: "Kitabeler", color: "#a855f7", type: "point", radius: 6, visible: true },
    seyir_teraslari: { title: "Seyir Terasları", color: "#ec4899", type: "point", radius: 7, visible: true },
    hizmet_noktalari: { title: "Hizmet Noktaları", color: "#3b82f6", type: "point", radius: 6, visible: true },
    ziyaretci_yogunlugu: { title: "Ziyaretçi Yoğunluğu", color: "#f97316", type: "point", radius: 8, visible: false },
    etkinlikler: { title: "Kültürel Etkinlikler", color: "#eab308", type: "point", radius: 6, visible: false },
    yuruyus_yollari: { title: "Yürüyüş Yolları", color: "#22c55e", type: "line", visible: true },
    riskli_alanlar: { title: "Riskli Alanlar", color: "#ef4444", type: "poly", visible: true }
};

const leafletGroups = {};
const yapilarMarkersById = {};
const rawDataStore = {
    restorasyon: [],
    fotograflar: []
};

// Her katman için Leaflet LayerGroup oluştur
Object.keys(LAYER_CONFIG).forEach((key) => {
    leafletGroups[key] = L.layerGroup();
    if (LAYER_CONFIG[key].visible) {
        leafletGroups[key].addTo(map);
    }
});

// Üst Bildirim Banner Yardımcısı
let bannerTimeout = null;
function showBannerMessage(htmlText, durationMs = 3500) {
    const measureBanner = document.getElementById("measure-banner");
    measureBanner.style.display = "block";
    measureBanner.innerHTML = htmlText;
    if (bannerTimeout) clearTimeout(bannerTimeout);
    if (durationMs > 0) {
        bannerTimeout = setTimeout(() => {
            if (!measureActive) {
                measureBanner.style.display = "none";
            }
        }, durationMs);
    }
}

// GeoServer WFS'den Veri Çekme Fonksiyonu
async function fetchWfsLayer(typeName) {
    const url = `${GEOSERVER_URL}/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=alanya:${typeName}&outputFormat=application/json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
}

// Sayfa Yüklendiğinde Tüm 12 Tabloyu GeoServer'dan Çek
async function initGisData() {
    const statusDot = document.getElementById("gs-status-dot");
    const statusText = document.getElementById("gs-status-text");

    try {
        const [restGeoJson, fotoGeoJson] = await Promise.all([
            fetchWfsLayer("restorasyon"),
            fetchWfsLayer("fotograflar")
        ]);
        rawDataStore.restorasyon = restGeoJson.features.map(f => ({ id: f.id, ...f.properties }));
        rawDataStore.fotograflar = fotoGeoJson.features.map(f => ({ id: f.id, ...f.properties }));

        const layerKeys = Object.keys(LAYER_CONFIG);
        const results = await Promise.all(layerKeys.map(k => fetchWfsLayer(k)));

        layerKeys.forEach((key, idx) => {
            rawDataStore[key] = results[idx].features || [];
            renderLayer(key, rawDataStore[key]);
        });

        statusDot.classList.remove("offline");
        statusText.textContent = "GeoServer WFS/WMS Aktif (12 Tablo)";
    } catch (err) {
        console.warn("GeoServer bağlantısı kurulamadı:", err);
        statusDot.classList.add("offline");
        statusText.textContent = "GeoServer Bağlantı Hatası";
    }

    buildLayerControlUI();
    updateStatsUI();
    renderSearchResultsList(rawDataStore.yapilar || []);
}

// Katmanı Haritaya Çizdirme
function renderLayer(layerKey, features) {
    const group = leafletGroups[layerKey];
    group.clearLayers();
    const cfg = LAYER_CONFIG[layerKey];

    if (layerKey === "yapilar") {
        Object.keys(yapilarMarkersById).forEach(k => delete yapilarMarkersById[k]);
    }

    features.forEach((feature) => {
        if (!feature.geometry) return;
        const props = feature.properties || {};
        const featureNumId = feature.id ? parseInt(feature.id.split(".")[1], 10) : props.id;

        let layerObj;

        if (feature.geometry.type === "Point") {
            const [lng, lat] = feature.geometry.coordinates;
            layerObj = L.circleMarker([lat, lng], {
                radius: cfg.radius || 8,
                fillColor: cfg.color,
                color: "#ffffff",
                weight: 2.5,
                opacity: 1,
                fillOpacity: 0.95
            });

            // Tarihi yapılara harita üzerinde kalıcı isim etiketi ekle
            if (layerKey === "yapilar" && props.adi) {
                layerObj.bindTooltip(props.adi, {
                    permanent: true,
                    direction: "top",
                    offset: [0, -10],
                    className: "structure-label"
                });
                yapilarMarkersById[featureNumId] = {
                    marker: layerObj,
                    latlng: [lat, lng],
                    props,
                    geometry: feature.geometry,
                    id: featureNumId
                };
            }
        } else if (feature.geometry.type === "LineString") {
            const latlngs = feature.geometry.coordinates.map(c => [c[1], c[0]]);
            layerObj = L.polyline(latlngs, {
                color: cfg.color,
                weight: 4,
                opacity: 0.95,
                dashArray: "8, 6"
            });
        } else if (feature.geometry.type === "Polygon") {
            const latlngs = feature.geometry.coordinates[0].map(c => [c[1], c[0]]);
            layerObj = L.polygon(latlngs, {
                color: cfg.color,
                fillColor: cfg.color,
                weight: 2,
                fillOpacity: 0.32
            });
        }

        if (layerObj) {
            const title = props.adi || props.isim || props.nokta_adi || props.risk_tipi || props.dil || cfg.title;
            const subtitle = props.turu || props.donemi || props.durum || props.risk_seviyesi || props.zemin || props.manzara_tipi || "";

            layerObj.bindPopup(`
                <div class="popup-title">${title}</div>
                <div class="popup-sub"><b>Katman:</b> ${cfg.title}<br>${subtitle ? `<b>Detay:</b> ${subtitle}` : ""}</div>
            `);

            layerObj.on("click", () => {
                showFeatureDetails(layerKey, featureNumId, props, feature.geometry);
            });

            group.addLayer(layerObj);
        }
    });
}

// Belirli Bir Yapıya Haritada Uç (Zoom) ve Bilgilerini Aç
function focusOnStructure(featureNumId) {
    // Tarihi Yapılar katmanı kapalıysa otomatik aç
    if (!LAYER_CONFIG.yapilar.visible) {
        setLayerVisibility("yapilar", true);
    }

    const item = yapilarMarkersById[featureNumId];
    if (!item) return;

    map.flyTo(item.latlng, 18, { animate: true, duration: 1.0 });
    setTimeout(() => {
        item.marker.openPopup();
    }, 600);

    showFeatureDetails("yapilar", item.id, item.props, item.geometry);
    showBannerMessage(`📍 <b>${item.props.adi}</b> (${item.props.donemi} - ${item.props.yapim_yili}) noktasına odaklandı.`);

    document.querySelectorAll(".result-item").forEach(el => {
        el.classList.toggle("active", Number(el.dataset.id) === Number(featureNumId));
    });
}

// Arama Kutusu Altındaki Tıklanabilir Yapı Listesini Oluştur
function renderSearchResultsList(features) {
    const listEl = document.getElementById("search-results");
    listEl.innerHTML = "";

    if (!features || features.length === 0) {
        listEl.innerHTML = `<div style="font-size:12px;color:#94a3b8;padding:6px;">Eşleşen yapı bulunamadı.</div>`;
        return;
    }

    features.forEach((f) => {
        const props = f.properties || {};
        const featureNumId = f.id ? parseInt(f.id.split(".")[1], 10) : props.id;

        const row = document.createElement("div");
        row.className = "result-item";
        row.dataset.id = featureNumId;
        row.innerHTML = `
            <span class="result-name">📍 ${props.adi}</span>
            <span class="result-meta">${props.donemi || ""} (${props.yapim_yili || ""})</span>
        `;
        row.addEventListener("click", () => {
            focusOnStructure(featureNumId);
        });
        listEl.appendChild(row);
    });
}

// Katman Görünürlüğünü Değiştirme Yardımcısı
function setLayerVisibility(key, isVisible) {
    LAYER_CONFIG[key].visible = isVisible;
    if (isVisible) {
        leafletGroups[key].addTo(map);
    } else {
        map.removeLayer(leafletGroups[key]);
    }
    const cb = document.querySelector(`input[data-layer="${key}"]`);
    if (cb) cb.checked = isVisible;
}

// Sol Panel Katman Yöneticisi Oluşturma
function buildLayerControlUI() {
    const container = document.getElementById("layer-list");
    container.innerHTML = "";

    Object.keys(LAYER_CONFIG).forEach((key) => {
        const cfg = LAYER_CONFIG[key];
        const count = (rawDataStore[key] || []).length;

        const item = document.createElement("label");
        item.className = "layer-item";
        item.innerHTML = `
            <div class="layer-left">
                <input type="checkbox" data-layer="${key}" ${cfg.visible ? "checked" : ""}>
                <span class="layer-swatch ${cfg.type}" style="background:${cfg.color}"></span>
                <span>${cfg.title}</span>
            </div>
            <span class="layer-count" id="count-${key}">${count}</span>
        `;

        const checkbox = item.querySelector("input");
        checkbox.addEventListener("change", (e) => {
            setLayerVisibility(key, e.target.checked);
        });

        container.appendChild(item);
    });
}

// Özet İstatistikleri Güncelleme ve Kart Tıklamaları
function updateStatsUI() {
    document.getElementById("stat-yapilar").textContent = (rawDataStore.yapilar || []).length;
    document.getElementById("stat-sarniclar").textContent = (rawDataStore.sarniclar || []).length;

    const totalWalkM = (rawDataStore.yuruyus_yollari || []).reduce(
        (acc, f) => acc + (Number(f.properties?.uzunluk_m) || 0),
        0
    );
    document.getElementById("stat-yollar").textContent = `${totalWalkM} m`;
    document.getElementById("stat-risk").textContent = (rawDataStore.riskli_alanlar || []).length;
}

// Arama ve Dönem/Tür Filtreleme (Yapılar Katmanı)
function applyYapilarFilter(autoFocusFirst = false) {
    const rawQuery = document.getElementById("search-input").value.trim();
    const q = normalizeTR(rawQuery);
    const filterVal = normalizeTR(document.getElementById("period-filter").value);

    // Arama yapıldığında Tarihi Yapılar katmanı kapalıysa otomatik aç
    if (!LAYER_CONFIG.yapilar.visible) {
        setLayerVisibility("yapilar", true);
    }

    const allYapilar = rawDataStore.yapilar || [];
    const filtered = allYapilar.filter((f) => {
        const p = f.properties || {};
        const matchText =
            !q ||
            normalizeTR(p.adi).includes(q) ||
            normalizeTR(p.aciklama).includes(q) ||
            normalizeTR(p.turu).includes(q) ||
            normalizeTR(p.donemi).includes(q);

        const matchCategory =
            filterVal === "all" ||
            normalizeTR(p.donemi).includes(filterVal) ||
            normalizeTR(p.turu).includes(filterVal);

        return matchText && matchCategory;
    });

    renderLayer("yapilar", filtered);
    renderSearchResultsList(filtered);

    const countBadge = document.getElementById("count-yapilar");
    if (countBadge) countBadge.textContent = filtered.length;

    // Eğer tek bir sonuç kaldıysa veya "Bul & Git" / Enter basıldıysa otomatik o yapıya odaklan!
    if ((autoFocusFirst || filtered.length === 1) && filtered.length > 0 && rawQuery.length > 0) {
        const firstFeature = filtered[0];
        const firstId = firstFeature.id ? parseInt(firstFeature.id.split(".")[1], 10) : firstFeature.properties.id;
        focusOnStructure(firstId);
    }
}

document.getElementById("search-input").addEventListener("input", () => applyYapilarFilter(false));
document.getElementById("search-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        applyYapilarFilter(true);
    }
});
document.getElementById("btn-search-go").addEventListener("click", () => applyYapilarFilter(true));
document.getElementById("period-filter").addEventListener("change", () => applyYapilarFilter(false));

// Arama Sıfırlama
document.getElementById("btn-clear-search").addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    document.getElementById("period-filter").value = "ALL";
    applyYapilarFilter(false);
    map.closePopup();
    map.flyTo([36.5355, 31.9920], 15, { animate: true, duration: 0.8 });
});

// Tüm Katmanları Aç/Kapat
document.getElementById("btn-toggle-all").addEventListener("click", () => {
    const anyHidden = Object.keys(LAYER_CONFIG).some(k => !LAYER_CONFIG[k].visible);
    Object.keys(LAYER_CONFIG).forEach(k => setLayerVisibility(k, anyHidden));
    document.getElementById("btn-toggle-all").textContent = anyHidden ? "Tümünü Kapat" : "Tümünü Aç";
});

// Seçilen Objenin Öznitelik ve İlişkisel (Restorasyon + Fotoğraf) Bilgilerini Göster
function showFeatureDetails(layerKey, featureId, props, geometry) {
    const box = document.getElementById("feature-detail");
    const cfg = LAYER_CONFIG[layerKey];
    const title = props.adi || props.isim || props.nokta_adi || props.risk_tipi || cfg.title;

    let rowsHtml = "";
    Object.entries(props).forEach(([k, v]) => {
        if (v === null || v === undefined) return;
        const labelMap = {
            adi: "Adı",
            isim: "İsim",
            turu: "Türü",
            yapim_yili: "Yapım Yılı",
            donemi: "Dönemi",
            koruma_durumu: "Koruma Durumu",
            aciklama: "Açıklama",
            kapasite: "Kapasite (m³)",
            durum: "Durum",
            su_durumu: "Su Varlığı",
            uzunluk_m: "Uzunluk (m)",
            egim_yuzde: "Ortalama Eğim (%)",
            zemin: "Zemin Tipi",
            erisilebilirlik: "Erişilebilirlik",
            risk_tipi: "Risk Tipi",
            risk_seviyesi: "Risk Seviyesi",
            manzara_tipi: "Manzara",
            tip: "Hizmet Tipi",
            ziyaretci_sayisi: "Anlık Ziyaretçi",
            tarih_saat: "Ölçüm Zamanı",
            dil: "Kitabe Dili",
            yazi: "Kitabe Metni",
            ceviri: "Açıklama / Çeviri",
            yer: "Konum",
            tarih: "Tarih"
        };
        const label = labelMap[k] || k;
        const val = typeof v === "boolean" ? (v ? "Var (Aktif)" : "Yok") : v;
        rowsHtml += `<tr><td>${label}</td><td><strong>${val}</strong></td></tr>`;
    });

    if (geometry && geometry.type === "Point") {
        rowsHtml += `<tr><td>Koordinat (WGS84)</td><td>${geometry.coordinates[1].toFixed(5)}, ${geometry.coordinates[0].toFixed(5)}</td></tr>`;
    }

    let relatedHtml = "";
    if (layerKey === "yapilar" && featureId) {
        const rests = rawDataStore.restorasyon.filter(r => Number(r.yapi_id) === Number(featureId));
        const fotos = rawDataStore.fotograflar.filter(f => Number(f.yapi_id) === Number(featureId));

        if (rests.length > 0) {
            relatedHtml += `<div class="related-box"><h4>🛠 Restorasyon Geçmişi (${rests.length} Kayıt)</h4>`;
            rests.forEach(r => {
                relatedHtml += `<div class="related-item"><b>${r.baslangic_tarihi || ""} - ${r.bitis_tarihi || "Devam"} (${r.durum}):</b> ${r.aciklama}</div>`;
            });
            relatedHtml += `</div>`;
        }

        if (fotos.length > 0) {
            relatedHtml += `<div class="related-box"><h4>📷 Arşiv Fotoğraf Kaydı</h4>`;
            fotos.forEach(f => {
                relatedHtml += `<div class="related-item">Dosya: <code>${f.dosya_yolu}</code> (${f.tarih})</div>`;
            });
            relatedHtml += `</div>`;
        }
    }

    box.innerHTML = `
        <span class="sub-badge">${cfg.title} (ID: ${featureId || "-"})</span>
        <h3>${title}</h3>
        <table class="detail-table">${rowsHtml}</table>
        ${relatedHtml}
    `;
}

// CBS Mesafe Ölçüm Aracı
let measureActive = false;
let measurePoints = [];
let measureLine = null;
let measureMarkers = [];

const btnMeasure = document.getElementById("btn-measure");
const measureBanner = document.getElementById("measure-banner");

btnMeasure.addEventListener("click", () => {
    measureActive = !measureActive;
    btnMeasure.classList.toggle("active", measureActive);
    clearMeasurement();

    if (measureActive) {
        measureBanner.style.display = "block";
        measureBanner.innerHTML = "📏 <b>Mesafe Ölçüm Modu:</b> Harita üzerinde başlangıç ve bitiş noktalarına tıklayın.";
        map.getContainer().style.cursor = "crosshair";
    } else {
        measureBanner.style.display = "none";
        map.getContainer().style.cursor = "";
    }
});

function clearMeasurement() {
    measurePoints = [];
    if (measureLine) map.removeLayer(measureLine);
    measureMarkers.forEach(m => map.removeLayer(m));
    measureMarkers = [];
}

map.on("click", (e) => {
    if (!measureActive) return;

    measurePoints.push(e.latlng);
    const marker = L.circleMarker(e.latlng, {
        radius: 6,
        color: "#0f172a",
        fillColor: "#f59e0b",
        fillOpacity: 1,
        weight: 2
    }).addTo(map);
    measureMarkers.push(marker);

    if (measurePoints.length === 2) {
        const distMeters = map.distance(measurePoints[0], measurePoints[1]);
        measureLine = L.polyline(measurePoints, {
            color: "#f59e0b",
            weight: 3,
            dashArray: "6, 6"
        }).addTo(map);

        measureBanner.innerHTML = `📏 <b>Jeodezik Yatay Mesafe (WGS84):</b> <span style="color:#f59e0b;font-weight:800">${distMeters.toFixed(1)} metre</span> (Yeni ölçüm için tekrar tıklayın)`;
        measurePoints = [];
    } else if (measurePoints.length === 1 && measureMarkers.length > 1) {
        const firstPt = e.latlng;
        clearMeasurement();
        measurePoints.push(firstPt);
        const m = L.circleMarker(firstPt, {
            radius: 6,
            color: "#0f172a",
            fillColor: "#f59e0b",
            fillOpacity: 1,
            weight: 2
        }).addTo(map);
        measureMarkers.push(m);
        measureBanner.innerHTML = "📏 İkinci noktaya tıklayın...";
    }
});

// 🎯 Kaleye Odakla (Genel Görünüm + Katmanları ve Filtreyi Sıfırla)
document.getElementById("btn-reset-view").addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    document.getElementById("period-filter").value = "ALL";
    ["yapilar", "kapilar", "sarniclar", "yuruyus_yollari", "riskli_alanlar", "seyir_teraslari"].forEach(k => {
        setLayerVisibility(k, true);
    });
    applyYapilarFilter(false);
    map.closePopup();
    map.flyToBounds([[36.5285, 31.9840], [36.5410, 31.9995]], {
        padding: [30, 30],
        animate: true,
        duration: 1.0
    });
    showBannerMessage("🎯 <b>Alanya Kalesi Yarımadası:</b> Tüm ana katmanlar açıldı ve kale sınırlarına odaklandı.");
});

// Başlat
initGisData();
