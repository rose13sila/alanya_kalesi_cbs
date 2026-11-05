-- Alanya Kalesi CBS Projesi - Veritabanı Şeması (Faz 2)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Yapılar (Nokta)
CREATE TABLE IF NOT EXISTS yapilar (
    id SERIAL PRIMARY KEY,
    adi VARCHAR(150) NOT NULL,
    turu VARCHAR(50),
    yapim_yili INTEGER,
    donemi VARCHAR(100),
    aciklama TEXT,
    koruma_durumu VARCHAR(50),
    geom GEOMETRY(Point, 4326)
);

-- 2. Kitabeler (Nokta)
CREATE TABLE IF NOT EXISTS kitabeler (
    id SERIAL PRIMARY KEY,
    yapi_id INTEGER REFERENCES yapilar(id) ON DELETE SET NULL,
    dil VARCHAR(50),
    yazi TEXT,
    ceviri TEXT,
    durum VARCHAR(50),
    geom GEOMETRY(Point, 4326)
);

-- 3. Sarnıçlar (Nokta)
CREATE TABLE IF NOT EXISTS sarniclar (
    id SERIAL PRIMARY KEY,
    adi VARCHAR(100),
    kapasite NUMERIC,
    durum VARCHAR(50),
    su_durumu BOOLEAN,
    geom GEOMETRY(Point, 4326)
);

-- 4. Yürüyüş Yolları (Çizgi)
CREATE TABLE IF NOT EXISTS yuruyus_yollari (
    id SERIAL PRIMARY KEY,
    isim VARCHAR(100),
    uzunluk_m NUMERIC,
    egim_yuzde NUMERIC,
    zemin VARCHAR(50),
    erisilebilirlik VARCHAR(50),
    geom GEOMETRY(LineString, 4326)
);

-- 5. Riskli Alanlar (Poligon)
CREATE TABLE IF NOT EXISTS riskli_alanlar (
    id SERIAL PRIMARY KEY,
    risk_tipi VARCHAR(50),
    risk_seviyesi VARCHAR(20),
    aciklama TEXT,
    geom GEOMETRY(Polygon, 4326)
);

-- 6. Kapılar (Nokta)
CREATE TABLE IF NOT EXISTS kapilar (
    id SERIAL PRIMARY KEY,
    isim VARCHAR(100),
    durum VARCHAR(50),
    geom GEOMETRY(Point, 4326)
);

-- 7. Seyir Terasları (Nokta)
CREATE TABLE IF NOT EXISTS seyir_teraslari (
    id SERIAL PRIMARY KEY,
    isim VARCHAR(100),
    manzara_tipi VARCHAR(100),
    geom GEOMETRY(Point, 4326)
);

-- 8. Hizmet Noktaları (Nokta)
CREATE TABLE IF NOT EXISTS hizmet_noktalari (
    id SERIAL PRIMARY KEY,
    tip VARCHAR(50),
    isim VARCHAR(100),
    geom GEOMETRY(Point, 4326)
);

-- 9. Ziyaretçi Yoğunluğu (Nokta)
CREATE TABLE IF NOT EXISTS ziyaretci_yogunlugu (
    id SERIAL PRIMARY KEY,
    nokta_adi VARCHAR(100),
    tarih_saat TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ziyaretci_sayisi INTEGER,
    geom GEOMETRY(Point, 4326)
);

-- 10. Etkinlikler (Nokta)
CREATE TABLE IF NOT EXISTS etkinlikler (
    id SERIAL PRIMARY KEY,
    adi VARCHAR(150),
    tarih TIMESTAMP WITHOUT TIME ZONE,
    yer VARCHAR(150),
    geom GEOMETRY(Point, 4326)
);

-- 11. Restorasyon (Öznitelik / İlişkisel Tablo)
CREATE TABLE IF NOT EXISTS restorasyon (
    id SERIAL PRIMARY KEY,
    yapi_id INTEGER REFERENCES yapilar(id) ON DELETE CASCADE,
    baslangic_tarihi DATE,
    bitis_tarihi DATE,
    durum VARCHAR(50),
    aciklama TEXT
);

-- 12. Fotoğraflar (Öznitelik / İlişkisel Tablo)
CREATE TABLE IF NOT EXISTS fotograflar (
    id SERIAL PRIMARY KEY,
    yapi_id INTEGER REFERENCES yapilar(id) ON DELETE CASCADE,
    dosya_yolu VARCHAR(255),
    tarih DATE
);

