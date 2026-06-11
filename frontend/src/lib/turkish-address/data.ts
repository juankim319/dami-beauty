/** 81 Turkish provinces */
export const PROVINCES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya",
  "Ankara", "Antalya", "Ardahan", "Artvin", "Aydın", "Balıkesir",
  "Bartın", "Batman", "Bayburt", "Bilecik", "Bingöl", "Bitlis",
  "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum",
  "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan",
  "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane",
  "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul", "İzmir",
  "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu",
  "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir", "Kilis",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Mardin",
  "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu",
  "Osmaniye", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop",
  "Sivas", "Şanlıurfa", "Şırnak", "Tekirdağ", "Tokat", "Trabzon",
  "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak",
] as const;

/** il → ilçe list (major cities; others: free-text entry) */
export const DISTRICTS: Record<string, string[]> = {
  İstanbul: [
    "Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler",
    "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü",
    "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt",
    "Eyüpsultan", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane",
    "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer",
    "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla",
    "Ümraniye", "Üsküdar", "Zeytinburnu",
  ],
  Ankara: [
    "Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk",
    "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kalecik",
    "Kahramankazan", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı",
    "Pursaklar", "Sincan", "Şereflikoçhisar", "Yenimahalle",
  ],
  İzmir: [
    "Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova",
    "Buca", "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe",
    "Karabağlar", "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz",
    "Konak", "Menderes", "Menemen", "Narlıdere", "Ödemiş", "Seferihisar",
    "Selçuk", "Tire", "Torbalı", "Urla",
  ],
  Bursa: [
    "Nilüfer", "Osmangazi", "Yıldırım", "Gemlik", "İnegöl", "Mudanya", "Gürsu",
    "Kestel", "Karacabey", "Orhangazi", "Mustafakemalpaşa",
  ],
  Antalya: [
    "Muratpaşa", "Kepez", "Konyaaltı", "Alanya", "Manavgat", "Serik", "Kaş",
    "Kemer", "Finike", "Demre",
  ],
};

/** `${il}|${ilce}` → mahalle list */
export const NEIGHBORHOODS: Record<string, string[]> = {
  "İstanbul|Bağcılar": [
    "15 Temmuz", "Bağlar", "Barbaros", "Demirkapı", "Evren", "Fevziçakmak",
    "Göztepe", "Güneşli", "Hürriyet", "Kirazlı", "Mahmutbey", "Merkez",
    "Sanayi", "Yenibosna", "Yıldıztepe",
  ],
  "İstanbul|Kadıköy": [
    "Acıbadem", "Bostancı", "Caddebostan", "Caferağa", "Erenköy", "Fenerbahçe",
    "Göztepe", "Hasanpaşa", "Koşuyolu", "Moda", "Osmanağa", "Rasimpaşa",
    "Suadiye", "Zühtüpaşa",
  ],
  "İstanbul|Beşiktaş": [
    "Abbasağa", "Arnavutköy", "Bebek", "Etiler", "Levent", "Ortaköy", "Ulus",
    "Vişnezade", "Yıldız",
  ],
  "İstanbul|Şişli": [
    "Bomonti", "Esentepe", "Feriköy", "Halaskargazi", "Kurtuluş", "Mecidiyeköy",
    "Nişantaşı", "Osmanbey", "Teşvikiye",
  ],
  "İstanbul|Üsküdar": [
    "Acıbadem", "Altunizade", "Bulgurlu", "Çengelköy", "Kuzguncuk", "Libadiye",
    "Selimiye", "Valide-i Atik",
  ],
  "Ankara|Çankaya": [
    "Ayrancı", "Bahçelievler", "Balgat", "Çayyolu", "Emek", "Kızılay",
    "Maltepe", "Oran", "Ümitköy", "Yıldız",
  ],
  "İzmir|Karşıyaka": [
    "Alaybey", "Atakent", "Bostanlı", "Cumhuriyet", "Donanmacı", "Mavişehir",
    "Nergiz", "Yamanlar",
  ],
};

/** `${il}|${ilce}|${mahalle}` → cadde/sokak list */
export const STREETS: Record<string, string[]> = {
  "İstanbul|Bağcılar|Güneşli": [
    "1240. Sokak", "1238. Sokak", "1236. Sokak", "1234. Sokak",
    "Atatürk Caddesi", "Güneşli Caddesi", "Mahmutbey Caddesi",
    "Sanayi Caddesi", "Yavuz Sultan Selim Caddesi", "100. Yıl Bulvarı",
    "Bağcılar Bulvarı", "Evren Caddesi", "Fevzi Çakmak Caddesi",
  ],
  "İstanbul|Bağcılar|Mahmutbey": [
    "Mahmutbey Caddesi", "E-5 Yan Yol", "100. Yıl Bulvarı", "Sanayi Caddesi",
    "Bağcılar Bulvarı", "1520. Sokak", "1522. Sokak",
  ],
  "İstanbul|Bağcılar|Yenibosna": [
    "Çobançeşme Caddesi", "Hürriyet Bulvarı", "Soğanlı Caddesi",
    "Yenibosna Merkez Caddesi", "1520. Sokak",
  ],
  "İstanbul|Kadıköy|Moda": [
    "Moda Caddesi", "Damacı Sokak", "Dr. Esat Işık Caddesi", "Kadife Sokak",
    "Moda İskele Sokak", "Plaj Yolu Sokak",
  ],
  "İstanbul|Beşiktaş|Levent": [
    "Büyükdere Caddesi", "Levent Caddesi", "Nispetiye Caddesi", "Ulus Caddesi",
  ],
};
