-- Alanya Kalesi CBS Projesi - Mekânsal ve Öznitelik Veri Seti (EPSG:4326)
BEGIN;

TRUNCATE TABLE
    fotograflar,
    restorasyon,
    kitabeler,
    sarniclar,
    yuruyus_yollari,
    riskli_alanlar,
    kapilar,
    seyir_teraslari,
    hizmet_noktalari,
    ziyaretci_yogunlugu,
    etkinlikler,
    yapilar
RESTART IDENTITY CASCADE;

-- 1. YAPILAR (Tarihi Yapılar - POINT)
INSERT INTO yapilar (adi, turu, yapim_yili, donemi, aciklama, koruma_durumu, geom) VALUES
('Kızılkule', 'Savunma', 1226, 'Selçuklu', 'Alanya Kalesi''nin limanı koruyan sekizgen planlı, 33 metre yüksekliğindeki simge kulesi. Mimar Ebu Ali Reha el-Kettani tarafından inşa edilmiştir.', 'İyi', ST_SetSRID(ST_MakePoint(31.998251, 36.536387), 4326)),
('Alanya Tersanesi', 'Askeri / Denizcilik', 1227, 'Selçuklu', 'I. Alaeddin Keykubad tarafından yaptırılan, 5 gözlü (kemerli) ve 56.5 metre cepheli Selçuklu deniz üssü.', 'İyi', ST_SetSRID(ST_MakePoint(31.997080, 36.533520), 4326)),
('Tophane Burcu', 'Savunma', 1228, 'Selçuklu', 'Tersaneyi güneyden korumak ve savaş gemileri için top dökümü yapmak amacıyla kayalıklar üzerine inşa edilen 19 metre yüksekliğindeki kule.', 'İyi', ST_SetSRID(ST_MakePoint(31.997350, 36.532880), 4326)),
('İçkale (Sultan Sarayı)', 'Saray / Savunma', 1221, 'Selçuklu', 'Yarımadanın en yüksek noktası olan 250 metre rakımda yer alan, Selçuklu Sultanı I. Alaeddin Keykubad''ın saray kalıntılarını ve sarnıçları barındıran merkez kale.', 'Orta', ST_SetSRID(ST_MakePoint(31.989650, 36.532200), 4326)),
('Ehmedek (Orta Kale)', 'Savunma', 1227, 'Selçuklu', 'Kuzey yamacında Helenistik temel üzerine inşa edilen, üç kuleli ve iki bölümlü kara savunma kalesi.', 'İyi', ST_SetSRID(ST_MakePoint(31.991850, 36.539550), 4326)),
('Süleymaniye Camii', 'Dini', 1231, 'Selçuklu / Osmanlı', 'İlk olarak I. Alaeddin Keykubad döneminde inşa edilen, XVI. yüzyılda Kanuni Sultan Süleyman döneminde yeniden yaptırılan kare planlı kubbeli cami.', 'İyi', ST_SetSRID(ST_MakePoint(31.992520, 36.537850), 4326)),
('Bedesten (Arasta)', 'Ticaret', 1350, 'Karamanoğulları', 'Süleymaniye Camii yakınında yer alan, dikdörtgen planlı ve 26 odalı tarihi kapalı çarşı ve kervansaray yapısı.', 'İyi', ST_SetSRID(ST_MakePoint(31.992100, 36.537350), 4326)),
('Akşebe Sultan Mescidi', 'Dini', 1230, 'Selçuklu', 'Kalenin ilk dizdarı (kale komutanı) Akşebe Sultan tarafından yaptırılan iki odalı, tuğla minareli Selçuklu mescidi.', 'İyi', ST_SetSRID(ST_MakePoint(31.991450, 36.536420), 4326)),
('Aya Yorgi Kilisesi (İçkale)', 'Dini', 550, 'Bizans', 'İçkale''nin ortasında yer alan, yonca planlı ve kubbeli 6. yüzyıl Bizans dönemi şapeli.', 'Orta', ST_SetSRID(ST_MakePoint(31.989920, 36.532450), 4326)),
('Darphane ve Manastır Kalıntıları', 'Kamu / İdari', 1100, 'Bizans / Selçuklu', 'Cilvarda Burnu''nun sarp kayalıkları üzerinde yer alan kesme taş yapılar.', 'Riskli / Harabe', ST_SetSRID(ST_MakePoint(31.985400, 36.529800), 4326));

-- 2. KİTABELER (POINT)
INSERT INTO kitabeler (yapi_id, dil, yazi, ceviri, durum, geom) VALUES
(1, 'Arapça (Selçuklu Sülüsü)', 'El-minnetü lillah - Sultanü''l-Muazzam Alaeddin Keykubad bin Keyhüsrev...', 'Kuzey cephesindeki 1226 tarihli 4 satırlık inşa kitabesi ve Ebu Ali el-Kettani usta kitabesi.', 'Okunabilir / İyi', ST_SetSRID(ST_MakePoint(31.998180, 36.536450), 4326)),
(2, 'Arapça (Selçuklu Sülüsü)', 'Es-Sultanü''l-Azam Şahinşahü''l-Muazzam Alaeddin Keykubad Sultanü''l-Berr ve''l-Bahreyn', 'Tersane giriş kapısı üzerindeki Sultanü''l-Bahreyn (İki Denizin Sultanı) unvanlı kitabe.', 'Okunabilir / İyi', ST_SetSRID(ST_MakePoint(31.997120, 36.533580), 4326)),
(5, 'Arapça', 'Ehmedek Kuzey Burcu İnşa Kitabesi (H. 624 / M. 1227)', 'Ehmedek burçlarının 1227 yılında tamamlandığını gösteren taş kitabe.', 'Kısmen Aşınmış', ST_SetSRID(ST_MakePoint(31.991900, 36.539620), 4326)),
(8, 'Arapça', 'Akşebe Sultan Vakıf ve İnşa Kitabesi (H. 628 / M. 1230)', 'Alaeddin Keykubad''ın komutanı Akşebe tarafından yaptırıldığını belirten kitabe.', 'Okunabilir / İyi', ST_SetSRID(ST_MakePoint(31.991480, 36.536450), 4326));

-- 3. SARNIÇLAR (POINT)
INSERT INTO sarniclar (adi, kapasite, durum, su_durumu, geom) VALUES
('İçkale Büyük Sarnıç', 1450.0, 'İyi (Tuğla Tonozlu)', true, ST_SetSRID(ST_MakePoint(31.989750, 36.532100), 4326)),
('İçkale Kuzey Sarnıcı', 680.0, 'İyi', true, ST_SetSRID(ST_MakePoint(31.989500, 36.532650), 4326)),
('Ehmedek Giriş Sarnıcı', 420.0, 'Orta', true, ST_SetSRID(ST_MakePoint(31.992050, 36.539300), 4326)),
('Kızılkule Merkez Sarnıcı', 210.0, 'İyi', false, ST_SetSRID(ST_MakePoint(31.998251, 36.536350), 4326)),
('Bedesten Yanı Tarihi Sarnıç', 520.0, 'Orta', true, ST_SetSRID(ST_MakePoint(31.991950, 36.537100), 4326)),
('Tophane Yağmur Sarnıcı', 190.0, 'İyi', false, ST_SetSRID(ST_MakePoint(31.997300, 36.532920), 4326));

-- 4. YÜRÜYÜŞ YOLLARI (LINESTRING)
INSERT INTO yuruyus_yollari (isim, uzunluk_m, egim_yuzde, zemin, erisilebilirlik, geom) VALUES
('Kızılkule - Tersane - Tophane Sahil Suru Yolu', 480.0, 6.5, 'Tarihi Taş Döşeme / Ahşap Platform', 'Yaya (Merdivenli)', ST_SetSRID(ST_GeomFromText('LINESTRING(31.998251 36.536387, 31.997950 36.535600, 31.997550 36.534700, 31.997080 36.533520, 31.997350 36.532880)'), 4326)),
('Teleferik Üst İstasyon - Ehmedek - Süleymaniye Gezi Yolu', 620.0, 8.2, 'Ahşap Yürüyüş Yolu ve Doğal Taş', 'Engelli Dostu / Yaya', ST_SetSRID(ST_GeomFromText('LINESTRING(31.990800 36.539950, 31.991850 36.539550, 31.992350 36.538700, 31.992520 36.537850, 31.992100 36.537350)'), 4326)),
('Süleymaniye - İçkale Ana Tırmanış Rotası', 890.0, 14.5, 'Arnavut Kaldırımı / Asfalt', 'Yaya ve Araç', ST_SetSRID(ST_GeomFromText('LINESTRING(31.992100 36.537350, 31.991450 36.536420, 31.990900 36.535100, 31.990500 36.533900, 31.990100 36.532950, 31.989650 36.532200)'), 4326)),
('Kızılkule - Hisariçi Doğu Yamaç Patikası', 1150.0, 18.0, 'Toprak ve Kayalık Patika', 'Sadece Yaya (Orta Zorluk)', ST_SetSRID(ST_GeomFromText('LINESTRING(31.998251 36.536387, 31.996800 36.536800, 31.995100 36.537200, 31.993600 36.537600, 31.992520 36.537850)'), 4326));

-- 5. RİSKLİ ALANLAR (POLYGON)
INSERT INTO riskli_alanlar (risk_tipi, risk_seviyesi, aciklama, geom) VALUES
('Uçurum ve Sarp Kayalık', 'Yüksek', 'Cilvarda Burnu ve Adam Atacağı mevkii güneybatı uçurum hattı; 200 metreyi aşan dik falezler nedeniyle ziyaretçi güvenlik sınırı.', ST_SetSRID(ST_GeomFromText('POLYGON((31.984500 36.530500, 31.988800 36.531300, 31.989400 36.530400, 31.984800 36.529100, 31.984500 36.530500))'), 4326)),
('Kaya Düşmesi ve Erozyon', 'Orta', 'Damlataş - Ehmedek batı yamacı dik eğimli jeolojik kırık hattı; yağışlı dönemlerde kaya düşme riski izleme alanı.', ST_SetSRID(ST_GeomFromText('POLYGON((31.989200 36.538200, 31.990900 36.539600, 31.990200 36.540300, 31.988500 36.538900, 31.989200 36.538200))'), 4326)),
('Sur Duvarı Statik Risk Bölgesi', 'Yüksek', 'Doğu yamacı eski sur kalıntılarında dalga ve rüzgâr erozyonu kaynaklı taş kopma riski bulunan koruma bandı.', ST_SetSRID(ST_GeomFromText('POLYGON((31.995500 36.533800, 31.996900 36.534200, 31.996600 36.532900, 31.995200 36.532600, 31.995500 36.533800))'), 4326));

-- 6. KAPILAR (POINT)
INSERT INTO kapilar (isim, durum, geom) VALUES
('İçkale Ana Giriş Kapısı', 'Aktif / Gişeli', ST_SetSRID(ST_MakePoint(31.990080, 36.532820), 4326)),
('Orta Kapı (Pazaryeri Kapısı)', 'Aktif / Araç ve Yaya Geçişi', ST_SetSRID(ST_MakePoint(31.993250, 36.538200), 4326)),
('Aşağı Kale (Liman) Kapısı', 'Aktif / Yaya Geçişi', ST_SetSRID(ST_MakePoint(31.997850, 36.536650), 4326)),
('Ehmedek Kuzey Kapısı', 'Aktif / Teleferik Bağlantı Kapısı', ST_SetSRID(ST_MakePoint(31.991650, 36.539700), 4326));

-- 7. SEYİR TERASLARI (POINT)
INSERT INTO seyir_teraslari (isim, manzara_tipi, geom) VALUES
('Adam Atacağı Seyir Terası (İçkale)', 'Kleopatra Plajı, Akdeniz ve Cilvarda Burnu Panoraması', ST_SetSRID(ST_MakePoint(31.989150, 36.531850), 4326)),
('Kızılkule Üst Burç Terası', 'Alanya Limanı, Tersane ve Doğu Sahili Panoraması', ST_SetSRID(ST_MakePoint(31.998290, 36.536410), 4326)),
('Ehmedek Gün Batımı Terası', 'Kleopatra Plajı ve Batı Toroslar Gün Batımı', ST_SetSRID(ST_MakePoint(31.991250, 36.539600), 4326)),
('Süleymaniye Panorama Noktası', 'Alanya Şehir Merkezi ve Liman Koyu Manzarası', ST_SetSRID(ST_MakePoint(31.992950, 36.537650), 4326));

-- 8. HİZMET NOKTALARI (POINT)
INSERT INTO hizmet_noktalari (tip, isim, geom) VALUES
('Ulaşım', 'Alanya Teleferik Kale (Ehmedek) Üst İstasyonu', ST_SetSRID(ST_MakePoint(31.990800, 36.539950), 4326)),
('Bilet Gişesi', 'İçkale Müze Bilet Gişesi ve Danışma', ST_SetSRID(ST_MakePoint(31.990150, 36.532900), 4326)),
('Bilet Gişesi', 'Kızılkule Etnografya Müzesi Gişesi', ST_SetSRID(ST_MakePoint(31.998120, 36.536500), 4326)),
('Otopark / Durak', 'İçkale Belediye Otobüs Durağı ve Otoparkı', ST_SetSRID(ST_MakePoint(31.990450, 36.533350), 4326)),
('Kafe / Dinlenme', 'Kale Panorama Dinlenme Alanı ve WC', ST_SetSRID(ST_MakePoint(31.992280, 36.537520), 4326));

-- 9. ZİYARETÇİ YOĞUNLUĞU (POINT)
INSERT INTO ziyaretci_yogunlugu (nokta_adi, tarih_saat, ziyaretci_sayisi, geom) VALUES
('Kızılkule Meydanı ve Girişi', '2026-10-19 14:00:00', 1420, ST_SetSRID(ST_MakePoint(31.998200, 36.536420), 4326)),
('İçkale Müzesi ve Seyir Terası', '2026-10-19 14:00:00', 1850, ST_SetSRID(ST_MakePoint(31.989700, 36.532300), 4326)),
('Teleferik Kale İstasyonu Çıkışı', '2026-10-19 14:00:00', 2100, ST_SetSRID(ST_MakePoint(31.990950, 36.539850), 4326)),
('Süleymaniye Camii ve Bedesten Çevresi', '2026-10-19 14:00:00', 960, ST_SetSRID(ST_MakePoint(31.992300, 36.537600), 4326)),
('Alanya Tersanesi İskelesi', '2026-10-19 14:00:00', 780, ST_SetSRID(ST_MakePoint(31.997100, 36.533550), 4326));

-- 10. ETKİNLİKLER (POINT)
INSERT INTO etkinlikler (adi, tarih, yer, geom) VALUES
('Alanya Uluslararası Caz Günleri Açılış Konseri', '2026-09-25 20:30:00', 'Kızılkule Meydanı', ST_SetSRID(ST_MakePoint(31.998050, 36.536600), 4326)),
('Selçuklu Denizcilik Tarihi ve Gemi Maketleri Sergisi', '2026-10-10 10:00:00', 'Alanya Tersanesi Galerileri', ST_SetSRID(ST_MakePoint(31.997050, 36.533500), 4326)),
('Geleneksel İpek Kozası ve El Sanatları Atölyesi', '2026-10-18 11:00:00', 'Tarihi Bedesten İçi', ST_SetSRID(ST_MakePoint(31.992120, 36.537380), 4326)),
('UNESCO Dünya Miras Geçici Listesi Bilgilendirme Sempozyumu', '2026-11-05 14:00:00', 'İçkale Açık Hava Alanı', ST_SetSRID(ST_MakePoint(31.989800, 36.532350), 4326));

-- 11. RESTORASYON (Öznitelik Tablosu - yapilar ile ilişkili)
INSERT INTO restorasyon (yapi_id, baslangic_tarihi, bitis_tarihi, durum, aciklama) VALUES
(1, '1951-04-01', '1953-10-15', 'Tamamlandı', 'Mimar Ali Saim Ülgen yönetiminde kapsamlı Cumhuriyet dönemi ilk bilimsel restorasyonu.'),
(1, '2018-11-01', '2019-06-20', 'Tamamlandı', 'Kızılkule dış cephe derz onarımı, ışıklandırma ve sarnıç izolasyon çalışmaları.'),
(2, '2014-03-10', '2015-05-30', 'Tamamlandı', 'Tersane tonoz güçlendirmesi ve denizcilik/kuşatma müzesi teşhir-tanzim projesi.'),
(4, '2021-05-01', '2024-09-15', 'Tamamlandı', 'İçkale Selçuklu Sarayı arkeolojik kazı ve duvar konservasyon projesi.'),
(6, '2011-02-15', '2012-08-01', 'Tamamlandı', 'Süleymaniye Camii kubbe kurşun kaplama, minare ve ahşap kündekâri kapı restorasyonu.'),
(10, '2026-03-01', NULL, 'Planlama Aşamasında', 'Cilvarda Burnu Darphane yapıları için fotogrametrik rölöve ve acil sağlamlaştırma projesi.');

-- 12. FOTOĞRAFLAR (Öznitelik Tablosu - yapilar ile ilişkili)
INSERT INTO fotograflar (yapi_id, dosya_yolu, tarih) VALUES
(1, 'medya/fotoğraflar/kizilkule_genel.jpg', '2026-10-15'),
(2, 'medya/fotoğraflar/alanya_tersanesi.jpg', '2026-10-15'),
(3, 'medya/fotoğraflar/tophane_burcu.jpg', '2026-10-15'),
(4, 'medya/fotoğraflar/ickale_saray.jpg', '2026-10-15'),
(5, 'medya/fotoğraflar/ehmedek_kalesi.jpg', '2026-10-15'),
(6, 'medya/fotoğraflar/suleymaniye_camii.jpg', '2026-10-15'),
(7, 'medya/fotoğraflar/tarihi_bedesten.jpg', '2026-10-15');

COMMIT;

