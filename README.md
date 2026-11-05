# Alanya Kalesi Coğrafi Bilgi Sistemi (CBS) Projesi

Bu proje, Alanya Kalesi yarımadasındaki tarihi, kültürel ve risk alanlarının açık kaynak CBS teknolojileri ile yönetilmesini, analiz edilmesini ve web ortamında sunulmasını sağlayan çok katmanlı bir Harita Mühendisliği CBS çalışmasıdır.

---

## 🏛️ Mimari Yapı

Proje 4 ana katmandan oluşmaktadır:
1. **Veritabanı Katmanı (PostgreSQL 15 + PostGIS 3.3):** Mekânsal verilerin (Point, LineString, Polygon) ve ilişkisel tabloların (restorasyon, fotograflar) depolanması.
2. **Harita Sunucusu Katmanı (GeoServer 2.23.0):** Verilerin uluslararası OGC standartlarında (WMS, WFS) `EPSG:4326` projeksiyonunda yayına alınması.
3. **Masaüstü CBS Katmanı (QGIS):** Sayısallaştırma, katman yönetimi ve harita tasarımı.
4. **Sunum & İstemci Katmanı (Web CBS - Leaflet.js):** Kullanıcı dostu, etkileşimli Web CBS harita portalı.

---

## 🗄️ Veritabanı Şeması ve Katmanlar (12 Tablo)

- **Mekânsal Katmanlar (Spatial Tables):**
  - `yapilar` (Point): Kızılkule, Alanya Tersanesi, İçkale, Ehmedek, Camiler ve Saray yapıları.
  - `sarniclar` (Point): Kale içi tarihi su sarnıçları, kapasite ve su durumları.
  - `kapilar` (Point): Kale sur kapıları ve gişeler.
  - `kitabeler` (Point): Selçuklu ve Bizans kitabeleri, tercümeleri.
  - `seyir_teraslari` (Point): Panoramik seyir noktaları.
  - `hizmet_noktalari` (Point): Teleferik istasyonu, danışma, kafeterya ve otoparklar.
  - `ziyaretci_yogunlugu` (Point): Dönemsel/noktasal ziyaretçi yoğunlukları.
  - `etkinlikler` (Point): Kültürel festival ve sergi alanları.
  - `yuruyus_yollari` (LineString): Tarihi gezi ve yürüyüş parkurları (toplam 3140 m).
  - `riskli_alanlar` (Polygon): Falezler, uçurum sınırları ve kaya düşmesi risk izleme bölgeleri.

- **İlişkisel Tablolar (Non-Spatial Tables):**
  - `restorasyon`: Yapıların tarihi ve güncel restorasyon geçmişi (`yapi_id` foreign key).
  - `fotograflar`: Yapılara ait arşiv fotoğrafları dosya yolları.

---

## 🚀 Kurulum ve Çalıştırma

Projeyi herhangi bir bilgisayarda çalıştırmak için yalnızca **Docker Desktop** ve **Git** gereklidir:

1. **Depoyu Klonlayın:**
   ```bash
   git clone <REPO_URL>
   cd alanya_kalesi_cbs
   ```

2. **Docker Servislerini Başlatın:**
   ```bash
   docker compose up -d
   ```
   *İlk kurulumda `veritabani/init_scripts` içerisindeki şema ve veriler otomatik olarak PostGIS'e yüklenir.*

3. **Web CBS Portalını Açın:**
   - Tarayıcınızdan: `http://localhost:8080/geoserver/www/index.html`

4. **GeoServer Yönetim Paneli:**
   - URL: `http://localhost:8080/geoserver`
   - Kullanıcı Adı: `admin`
   - Şifre: `geoserver`
