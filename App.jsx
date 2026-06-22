import React, { useState, useEffect, useMemo, useRef } from 'react';

/* ============================================================
   旅 TABI — Japan Honeymoon Companion
   09 — 30 Agosto 2026
   ============================================================ */

const COLORS = {
  ink: '#211F1C',
  inkSoft: '#3A3733',
  washi: '#F3EEE4',
  washiDeep: '#E8E0CF',
  paper: '#FBF8F2',
  indigo: '#2C4A63',
  indigoDeep: '#1D3447',
  vermillion: '#B14A3C',
  moss: '#5C6B4D',
  gold: '#B68A3D',
};

/* ============================================================
   DATA
   ============================================================ */

const FLIGHTS = [
  { id: 'f1', date: '2026-08-09', flightNo: 'EY102', from: 'MAD', to: 'AUH', time: '10:45', type: 'outbound' },
  { id: 'f2', date: '2026-08-09', flightNo: 'EY814', from: 'AUH', to: 'KIX', time: '21:10', type: 'outbound' },
  { id: 'f3', date: '2026-08-29', flightNo: 'EY801', from: 'NRT', to: 'AUH', time: '18:00', type: 'return' },
  { id: 'f4', date: '2026-08-30', flightNo: 'EY101', from: 'AUH', to: 'MAD', time: '02:25', type: 'return' },
];

const HOTELS = [
  { id: 'h1', city: 'Osaka', name: 'Citadines Namba Osaka', nights: 2, checkIn: '10 ago', checkOut: '12 ago', lat: 34.6657, lng: 135.5012 },
  { id: 'h2', city: 'Kyoto', name: 'Kyoto Century Hotel', nights: 3, checkIn: '12 ago', checkOut: '15 ago', lat: 34.9858, lng: 135.7588 },
  { id: 'h3', city: 'Hiroshima', name: 'Hotel Granvia Hiroshima', nights: 2, checkIn: '15 ago', checkOut: '17 ago', lat: 34.3978, lng: 132.4752 },
  { id: 'h4', city: 'Koyasan', name: 'Sekishoin (Shukubo)', nights: 1, checkIn: '17 ago', checkOut: '18 ago', lat: 34.2127, lng: 135.5859 },
  { id: 'h5', city: 'Kawayu Onsen', name: 'Fujiya Ryokan', nights: 1, checkIn: '18 ago', checkOut: '19 ago', lat: 33.7889, lng: 135.7728 },
  { id: 'h6', city: 'Osaka', name: 'Citadines Namba Osaka', nights: 1, checkIn: '19 ago', checkOut: '20 ago', lat: 34.6657, lng: 135.5012 },
  { id: 'h7', city: 'Kanazawa', name: 'Kanazawa Tokyu Hotel', nights: 1, checkIn: '20 ago', checkOut: '21 ago', lat: 36.5613, lng: 136.6562 },
  { id: 'h8', city: 'Takayama', name: 'Tokyu Stay Hida Takayama Musubi no Yu', nights: 1, checkIn: '21 ago', checkOut: '22 ago', lat: 36.1408, lng: 137.2526 },
  { id: 'h9', city: 'Tokyo (Odaiba)', name: 'Grand Nikko Tokyo Daiba', nights: 5, checkIn: '22 ago', checkOut: '27 ago', lat: 35.6275, lng: 139.7779 },
  { id: 'h10', city: 'Tokyo Disney', name: 'Hotel Tokyo Disneyland (cat. similar)', nights: 2, checkIn: '25 ago', checkOut: '27 ago', lat: 35.6329, lng: 139.8804 },
];

const LOCAL_FOOD = {
  Tokyo: ['Sushi', 'Ramen', 'Wagyu'],
  Kanazawa: ['Sushi', 'Marisco'],
  Hiroshima: ['Okonomiyaki estilo Hiroshima', 'Ostras'],
  Osaka: ['Takoyaki', 'Okonomiyaki', 'Kushikatsu'],
  Kyoto: ['Kaiseki', 'Izakaya'],
  Takayama: ['Carne de Hida', 'Sake local'],
};

const TYPE_META = {
  hotel: { icon: '🏨', label: 'Hotel' },
  food: { icon: '🍽️', label: 'Comida' },
  sight: { icon: '⛩️', label: 'Visita' },
  optional: { icon: '✦', label: 'Opcional' },
  transport: { icon: '🚄', label: 'Traslado' },
  park: { icon: '🎢', label: 'Parque' },
};

const ITINERARY = [
  { day: 1, date: '2026-08-10', city: 'Osaka', title: 'Llegada a Osaka', summary: 'Tras dejar las maletas, tarde libre: comida típica y el Castillo.',
    places: [
      { name: 'Citadines Namba Osaka', type: 'hotel', lat: 34.6657, lng: 135.5012, desc: 'Check-in y arranque de la tarde libre.' },
      { name: 'Okonomiyaki / Kushikatsu', type: 'food', lat: 34.6627, lng: 135.5067, desc: 'Primera comida típica: tortilla salada okonomiyaki y brochetas rebozadas kushikatsu.' },
      { name: 'Castillo de Osaka', type: 'sight', lat: 34.6873, lng: 135.5262, desc: 'Reconstruido en 1931 sobre la fortaleza del s.XVI. Vistas espectaculares desde el mirador superior.' },
      { name: 'Shinsekai / Torre Tsutenkaku', type: 'sight', lat: 34.6523, lng: 135.5063, desc: 'Barrio retro de principios del s.XX. Ambiente de neones, ideal al anochecer.' },
      { name: 'Namba Yasaka Jinja', type: 'optional', lat: 34.6614, lng: 135.5004, desc: "Santuario con la 'cabeza de león gigante'. Si no llega el tiempo, encaja otro rato libre en Osaka." },
      { name: 'Mercado Kuromon Ichiba', type: 'optional', lat: 34.6655, lng: 135.5057, desc: "La 'cocina de Osaka': marisco fresco y wagyu a la plancha." },
      { name: 'Shinsaibashi', type: 'optional', lat: 34.6724, lng: 135.5009, desc: 'Galería comercial techada, shopping nocturno.' },
    ],
    note: 'Con un solo atardecer es difícil meterlo todo. Orden sugerido: comida → Castillo → Shinsekai/Tsutenkaku al anochecer (los neones lucen mejor). Kuromon, Yasaka y Shinsaibashi mejor en otro rato libre de Osaka — el día 19 volvéis a pasar por aquí.' },

  { day: 2, date: '2026-08-11', city: 'Osaka', title: 'Universal Studios Japan', summary: 'Día completo en USJ con plan optimizado.', park: 'USJ',
    places: [{ name: 'Universal Studios Japan', type: 'park', lat: 34.6654, lng: 135.4323, desc: 'Wizarding World of Harry Potter, Super Nintendo World, Jurassic Park y más.' }] },

  { day: 3, date: '2026-08-12', city: 'Kyoto', title: 'Traslado a Kyoto + Higashiyama', summary: 'Carretera Osaka→Kyoto (~50-70 min). Tarde libre en Higashiyama.',
    places: [
      { name: 'Traslado Osaka → Kyoto', type: 'transport', lat: 34.8, lng: 135.6, desc: 'Por carretera, ~50-70 min según tráfico (≈50km).' },
      { name: 'Ninenzaka y Sannenzaka', type: 'sight', lat: 34.9952, lng: 135.7787, desc: 'Calles empedradas con casas de madera tradicionales y dulces típicos.' },
      { name: 'Kiyomizu-dera', type: 'sight', lat: 34.9949, lng: 135.785, desc: 'Templo sobre pilares de madera, Patrimonio de la Humanidad. Atardecer espectacular sobre Kyoto.' },
      { name: 'Yasaka Pagoda (Hokanji)', type: 'sight', lat: 34.9977, lng: 135.7793, desc: 'Pagoda de 5 pisos, icono de Higashiyama, mejor al atardecer/noche.' },
      { name: 'Gion', type: 'sight', lat: 35.0037, lng: 135.7752, desc: 'Barrio histórico de geishas (geiko). Paseo al anochecer.' },
      { name: 'Pontocho', type: 'food', lat: 35.0073, lng: 135.7707, desc: 'Callejón junto al río Kamo, lleno de restaurantes tradicionales — ideal para cenar.' },
    ],
    note: 'Orden recomendado: Ninenzaka/Sannenzaka → Kiyomizu-dera (atardecer) → Yasaka Pagoda → Gion → cena en Pontocho. Si llegáis tarde, prioriza Kiyomizu-dera al atardecer y deja fluir el resto.' },

  { day: 4, date: '2026-08-13', city: 'Kyoto', title: 'Sanjusangendo, Nijo, Kinkakuji, Arashiyama', summary: 'Día intenso de templos y jardines, terminando en el bosque de bambú.',
    places: [
      { name: 'Templo Sanjusangendo', type: 'sight', lat: 34.9881, lng: 135.7717, desc: 'Dedicado a la diosa Kannon; 1001 estatuas doradas de Kannon.' },
      { name: 'Castillo Nijo', type: 'sight', lat: 35.0142, lng: 135.748, desc: "Patrimonio de la Humanidad, famoso por sus 'suelos ruiseñor'." },
      { name: 'Kinkakuji (Pabellón Dorado)', type: 'sight', lat: 35.0394, lng: 135.7292, desc: 'El templo más fotografiado de Japón: pabellón cubierto de pan de oro.' },
      { name: 'Almuerzo', type: 'food', lat: 35.03, lng: 135.73, desc: 'Cerca de Kinkakuji o de camino a Arashiyama.' },
      { name: 'Jardín del Templo Tenryuji', type: 'sight', lat: 35.0157, lng: 135.6741, desc: 'Jardín japonés de paisaje, Patrimonio de la Humanidad.' },
      { name: 'Bosque de Bambú de Arashiyama', type: 'sight', lat: 35.017, lng: 135.6716, desc: 'Sendero icónico entre cañas de bambú; mejor temprano o al atardecer.' },
      { name: 'Cena cerca de Estación de Kyoto', type: 'food', lat: 34.9858, lng: 135.7588, desc: 'Zona con muchísima oferta gastronómica.' },
    ],
    note: 'Ruta lógica: Sanjusangendo → Nijo → Kinkakuji → almuerzo → Arashiyama (Tenryuji + bambú). Arashiyama queda al oeste, algo apartado del resto — es un día largo de desplazamientos.' },

  { day: 5, date: '2026-08-14', city: 'Nara / Kyoto', title: 'Nara medio día + Fushimi Inari', summary: 'Mañana en Nara, tarde/atardecer en Fushimi Inari.',
    places: [
      { name: 'Templo Todaiji', type: 'sight', lat: 34.6889, lng: 135.8398, desc: 'Alberga el Daibutsu, una de las mayores estatuas de Buda de bronce del mundo.' },
      { name: 'Parque de los Ciervos de Nara', type: 'sight', lat: 34.685, lng: 135.843, desc: 'Más de 1000 ciervos sagrados semi-salvajes.' },
      { name: 'Santuario Fushimi Inari Taisha', type: 'sight', lat: 34.9671, lng: 135.7727, desc: 'Miles de torii rojos formando túneles ascendentes. Espectacular al atardecer.' },
      { name: 'Mercado Nishiki', type: 'optional', lat: 35.005, lng: 135.7654, desc: "'La cocina de Kyoto': mercado cubierto con puestos típicos." },
      { name: 'Yasaka Pagoda (si no se vio el día 12)', type: 'optional', lat: 34.9977, lng: 135.7793, desc: 'Plan B si no dio tiempo el día 3.' },
    ],
    note: 'Fushimi Inari al atardecer es precioso pero concurrido. Si preferís menos gente, id nada más llegar de Nara y dejad Nishiki para el cierre.' },

  { day: 6, date: '2026-08-15', city: 'Himeji / Kurashiki / Hiroshima', title: 'Himeji, Kurashiki y traslado a Hiroshima', summary: 'Tren bala a Himeji, Kurashiki histórico y carretera a Hiroshima.',
    places: [
      { name: 'Castillo de Himeji', type: 'sight', lat: 34.8394, lng: 134.6939, desc: "El castillo mejor conservado de Japón, Patrimonio de la Humanidad, 'Castillo de la Garza Blanca'." },
      { name: 'Residencia Ohashi', type: 'sight', lat: 34.5859, lng: 133.7723, desc: 'Antigua casa de mercaderes en Kurashiki.' },
      { name: 'Barrio Bikan', type: 'sight', lat: 34.5853, lng: 133.772, desc: 'Distrito histórico de canales, almacenes blancos y sauces.' },
      { name: 'Traslado a Hiroshima', type: 'transport', lat: 34.5, lng: 133.2, desc: 'Por carretera, ~1h45-2h desde Kurashiki.' },
      { name: 'Hondori (noche)', type: 'food', lat: 34.3946, lng: 132.4553, desc: 'Calle comercial techada, genial para cenar y dar una vuelta.' },
    ],
    note: 'Para la cena del 15 o 16: probad ostras de Hiroshima (la región es famosa) y el okonomiyaki estilo Hiroshima (con fideos, distinto del de Osaka). Hondori vale cualquiera de las dos noches.' },

  { day: 7, date: '2026-08-16', city: 'Hiroshima / Miyajima', title: 'Parque de la Paz y Miyajima', summary: 'Mañana de memoria histórica, tarde en la isla sagrada.',
    places: [
      { name: 'Parque Conmemorativo de la Paz', type: 'sight', lat: 34.3955, lng: 132.4536, desc: 'Memorial a las víctimas de la bomba atómica de 1945.' },
      { name: 'Museo Memorial de la Paz', type: 'sight', lat: 34.3917, lng: 132.4525, desc: 'Museo imprescindible y muy emotivo.' },
      { name: 'Cúpula de la Bomba Atómica', type: 'sight', lat: 34.3955, lng: 132.4536, desc: 'Único edificio en pie cerca del hipocentro; Patrimonio de la Humanidad.' },
      { name: 'Santuario Itsukushima (Miyajima)', type: 'sight', lat: 34.296, lng: 132.3197, desc: 'El famoso torii flotante sobre el mar.' },
      { name: 'Monte Misen', type: 'optional', lat: 34.2697, lng: 132.3211, desc: 'Teleférico + caminata corta. Si no está en la excursión y os queda tiempo, merece la pena: vistas del Mar Interior de Seto.' },
    ],
    note: 'Si la excursión a Miyajima no incluye el Monte Misen y os sobra tarde el 16, subid (ropeway ~15 min + 30 min de paseo). Reservad la cena de ostras/okonomiyaki para la noche más libre entre el 15 y 16.' },

  { day: 8, date: '2026-08-17', city: 'Koyasan', title: 'Monte sagrado de Koyasan', summary: 'Tren a Osaka, luego Koyasan. Tarde de templos, noche mística en Okunoin.',
    places: [
      { name: 'Templo Kongobuji', type: 'sight', lat: 34.2138, lng: 135.5859, desc: 'Templo principal del budismo Shingon, con el jardín zen de piedras más grande de Japón.' },
      { name: 'Danjo Garan', type: 'sight', lat: 34.2117, lng: 135.5848, desc: 'Complejo de templos con la pagoda bermellón Konpon Daito.' },
      { name: 'Mausoleo Okunoin', type: 'sight', lat: 34.2147, lng: 135.602, desc: 'El cementerio más grande de Japón, 200.000 tumbas entre cedros centenarios. De noche, con los farolillos encendidos, es sobrecogedor.' },
      { name: 'Cena vegetariana-budista (shojin ryori)', type: 'food', lat: 34.2127, lng: 135.5859, desc: 'Cena en el monasterio, cocina tradicional sin carne ni pescado.' },
    ],
    note: 'Coincidimos: Okunoin se vive mejor de noche. Organizad: llegada → Kongobuji → Danjo Garan → cena en el monasterio → Okunoin nocturno como cierre.' },

  { day: 9, date: '2026-08-18', city: 'Koyasan / Kumano / Kawayu', title: 'Servicio religioso, Kumano Kodo y termas', summary: 'Mañana espiritual, tarde de peregrinación, noche de onsen.',
    places: [
      { name: 'Servicio religioso matutino', type: 'sight', lat: 34.2127, lng: 135.5859, desc: 'Ceremonia budista antes del desayuno vegetariano.' },
      { name: 'Traslado a Kumano', type: 'transport', lat: 33.9, lng: 135.7, desc: 'Por carretera.' },
      { name: 'Ruta Kumano Kodo', type: 'sight', lat: 33.8389, lng: 135.7728, desc: 'Antigua ruta de peregrinación, Patrimonio de la Humanidad (~60 min de tramo).' },
      { name: 'Santuario Kumano Hongu Taisha', type: 'sight', lat: 33.8389, lng: 135.7728, desc: 'Uno de los tres grandes santuarios de Kumano.' },
      { name: 'Oyunohara', type: 'sight', lat: 33.8358, lng: 135.7686, desc: 'Antiguo emplazamiento del santuario; el torii más grande de Japón.' },
      { name: 'Baños termales Kawayu Onsen', type: 'sight', lat: 33.7889, lng: 135.7728, desc: 'Río termal único, agua caliente brotando del lecho del río. Cierre perfecto en el ryokan.' },
    ],
    note: 'De acuerdo con vuestra valoración: tras un día de templos, naturaleza y caminata, los baños termales son el broche ideal. No hace falta añadir nada más.' },

  { day: 10, date: '2026-08-19', city: 'Osaka', title: 'Regreso a Osaka: Umeda Sky y Dotombori', summary: 'Vuelta por carretera. Tarde/noche en los barrios más vibrantes.',
    places: [
      { name: 'Umeda Sky Building', type: 'sight', lat: 34.7054, lng: 135.4906, desc: 'Observatorio circular a 173m, vistas 360°. Espectacular al atardecer.' },
      { name: 'Dotombori', type: 'sight', lat: 34.6688, lng: 135.5013, desc: 'El barrio de neones, con el cartel Glico Running Man.' },
      { name: 'Amerikamura', type: 'optional', lat: 34.6709, lng: 135.4989, desc: 'Barrio juvenil de moda urbana y street art.' },
      { name: 'Den Den Town', type: 'optional', lat: 34.6586, lng: 135.5063, desc: "El 'Akihabara de Osaka': electrónica, anime y manga." },
      { name: 'Hozenji Yokocho', type: 'optional', lat: 34.6677, lng: 135.5024, desc: 'Callejón empedrado con linternas, junto a Dotombori.' },
      { name: 'Abeno Harukas', type: 'optional', lat: 34.6457, lng: 135.5134, desc: 'El edificio más alto de Japón, mirador en el piso 60.' },
    ],
    note: 'Ruta sugerida: Umeda Sky (atardecer, está al norte) → Dotombori/Hozenji Yokocho (noche, neones) → Amemura (pegado a Dotombori). Den Den Town y Abeno Harukas quedan apartados — los primeros en sacrificar si falta tiempo.' },

  { day: 11, date: '2026-08-20', city: 'Kanazawa', title: 'Tren a Kanazawa: jardines y samuráis', summary: 'Shinkansen a Kanazawa. Kenroku-en, Oumicho y barrios históricos.',
    places: [
      { name: 'Jardín Kenroku-en', type: 'sight', lat: 36.5621, lng: 136.6627, desc: 'Uno de los tres jardines más bellos de Japón.' },
      { name: 'Mercado Oumicho', type: 'food', lat: 36.5697, lng: 136.6553, desc: "La 'cocina de Kanazawa': marisco fresquísimo y sushi al momento." },
      { name: 'Barrio Higashi Chaya', type: 'sight', lat: 36.5709, lng: 136.6645, desc: 'Antiguo distrito de geishas con casas de té tradicionales.' },
      { name: 'Barrio Nagamachi', type: 'sight', lat: 36.563, lng: 136.6535, desc: 'Antiguo barrio samurái con muros de adobe.' },
      { name: 'Residencia Nomura', type: 'sight', lat: 36.5625, lng: 136.6531, desc: 'Antigua casa de familia samurái con jardín interior.' },
      { name: 'Katamachi (cena de marisco)', type: 'food', lat: 36.5644, lng: 136.6553, desc: 'Zona de restaurantes e izakayas.' },
      { name: 'Kazue-machi Chaya', type: 'optional', lat: 36.5683, lng: 136.6598, desc: 'Tercer barrio de geishas junto al río Asano, puente fotogénico.' },
    ],
    note: 'Ruta por proximidad: Kenroku-en → Oumicho (comer) → Nagamachi/Residencia Nomura → Higashi Chaya → cena en Katamachi. Kazue-machi está de camino entre Higashi Chaya y el centro — factible asomarse de camino a cenar.' },

  { day: 12, date: '2026-08-21', city: 'Shirakawago / Takayama', title: 'Shirakawago y Takayama', summary: 'Pueblo Patrimonio de la Humanidad y casco histórico, con izakaya y onsen.',
    places: [
      { name: 'Shirakawago', type: 'sight', lat: 36.2581, lng: 136.9066, desc: "Pueblo Patrimonio de la Humanidad, casas tradicionales 'gassho-zukuri'." },
      { name: 'Yatai Kaikan', type: 'sight', lat: 36.1419, lng: 137.253, desc: 'Sala de exposición de las carrozas (yatai) de los festivales de Takayama.' },
      { name: 'Calle Kami-Sannomachi', type: 'sight', lat: 36.1421, lng: 137.2516, desc: 'Calle histórica con casas de comerciantes de época Edo y sake-bars.' },
      { name: 'Izakaya / sake / carne de Hida', type: 'food', lat: 36.1408, lng: 137.2526, desc: 'Takayama es famosa por su sake y por la ternera Hida, de las mejores de Japón.' },
      { name: 'Onsen del hotel', type: 'optional', lat: 36.1408, lng: 137.2526, desc: "El hotel incluye 'Musubi no Yu' — onsen propio. Buen cierre de noche." },
    ],
    note: 'Plan que cuadra: Shirakawago (mañana) → almuerzo → Takayama (tarde) → cena/izakaya en el centro histórico → onsen. Probad el sake local y la carne de Hida, de las mejores experiencias gastronómicas del viaje.' },

  { day: 13, date: '2026-08-22', city: 'Hakone / Tokyo', title: 'Hakone y llegada a Tokio', summary: 'Autocar a Nagoya, tren a Hakone, lago y teleférico, vistas al Fuji, llegada a Tokio.',
    places: [
      { name: 'Traslado a Nagoya y tren a Hakone', type: 'transport', lat: 35.1815, lng: 136.9066, desc: 'Autocar a Nagoya, luego Shinkansen. Almuerzo bento durante el trayecto.' },
      { name: 'Lago Ashi (barco)', type: 'sight', lat: 35.2042, lng: 139.0246, desc: 'Lago volcánico con crucero panorámico; en días claros se ve el Fuji reflejado.' },
      { name: 'Teleférico de Hakone', type: 'sight', lat: 35.2308, lng: 139.0167, desc: 'Vistas aéreas del Parque Nacional Fuji-Hakone-Izu.' },
      { name: 'Owakudani', type: 'optional', lat: 35.2356, lng: 139.0228, desc: "Valle volcánico activo; aquí se compran los 'kurotamago' (huevos negros, dicen que alargan la vida)." },
      { name: 'Monte Fuji (vistas)', type: 'sight', lat: 35.3606, lng: 138.7274, desc: 'Si el día está despejado, vistas espectaculares. Consulta la webcam en directo en la app.' },
      { name: 'Traslado a Tokio', type: 'transport', lat: 35.6762, lng: 139.6503, desc: 'Por carretera hasta el hotel en Odaiba.' },
    ],
    note: 'Owakudani encaja perfecto entre el lago y el ropeway para ver el Fuji de cerca y probar los kurotamago. Si llegáis con margen a Tokio, una primera toma de contacto con Odaiba (vuestra zona de hotel) es agradable, pero sin forzar tras un día largo de traslados.' },

  { day: 14, date: '2026-08-23', city: 'Tokyo', title: 'Tokyo Tower, Asakusa y panorámica', summary: 'Mañana de visitas clásicas, tarde libre.',
    places: [
      { name: 'Torre de Tokio', type: 'sight', lat: 35.6586, lng: 139.7454, desc: 'Torre roja y blanca inspirada en la Eiffel, símbolo clásico de Tokio.' },
      { name: 'Templo Senso-ji y Nakamise', type: 'sight', lat: 35.7148, lng: 139.7967, desc: 'El templo más antiguo de Tokio, con la arcada Nakamise.' },
    ],
    note: 'Tarde libre — ver la sección "Tokio: tiempo libre" para la propuesta completa.' },

  { day: 15, date: '2026-08-24', city: 'Nikko', title: 'Excursión a Nikko', summary: 'Día completo (almuerzo incluido): santuario Toshogu y cascada Kegon.',
    places: [
      { name: 'Santuario Toshogu', type: 'sight', lat: 36.7581, lng: 139.5995, desc: 'Mausoleo de Tokugawa Ieyasu, Patrimonio de la Humanidad (los 3 monos sabios).' },
      { name: 'Cascada Kegon', type: 'sight', lat: 36.7372, lng: 139.4983, desc: 'Una de las cascadas más espectaculares de Japón, 97m de caída.' },
      { name: 'Carretera zigzag Iroha-zaka', type: 'sight', lat: 36.74, lng: 139.47, desc: '48 curvas hacia el lago Chuzenji.' },
    ],
    note: 'Nikko está a ~2h de Tokio; es un día largo. Al volver probablemente lleguéis con poco margen — mejor no forzar planes extra y descansar para el día siguiente.' },

  { day: 16, date: '2026-08-25', city: 'Tokyo Disney', title: 'Parque Disney (día 1)', summary: 'Día completo en un parque Disney + noche en el hotel Disney.', park: 'DISNEY',
    places: [{ name: 'Tokyo DisneySea', type: 'park', lat: 35.6263, lng: 139.8853, desc: 'Ver sección Disney para la estrategia completa.' }] },

  { day: 17, date: '2026-08-26', city: 'Tokyo Disney', title: 'Parque Disney (día 2)', summary: 'Segundo día completo en el otro parque.', park: 'DISNEY',
    places: [{ name: 'Tokyo Disneyland', type: 'park', lat: 35.6329, lng: 139.8804, desc: 'Ver sección Disney para la estrategia completa.' }] },

  { day: 18, date: '2026-08-27', city: 'Tokyo', title: 'Tiempo libre en Tokio', summary: 'Día completo libre.', places: [],
    note: 'Ver sección "Tokio: tiempo libre".' },

  { day: 19, date: '2026-08-28', city: 'Tokyo', title: 'Tiempo libre en Tokio', summary: 'Día completo libre.', places: [],
    note: 'Ver sección "Tokio: tiempo libre".' },

  { day: 20, date: '2026-08-29', city: 'Tokyo', title: 'Última mañana libre + vuelo', summary: 'Libre hasta ~14h, luego al aeropuerto (vuelo 18:00 NRT→AUH).', places: [],
    note: 'Mañana corta — ideal algo cercano al hotel (Odaiba) o de camino a Narita.' },

  { day: 21, date: '2026-08-30', city: 'Vuelta', title: 'Llegada a Madrid', summary: 'Vuelo AUH→MAD 02:25, llegada a Madrid.', places: [] },
];

const TOKYO_FREE_BLOCKS = [
  { when: 'Día 23 — tarde', zone: 'Asakusa y alrededores', items: ['Ueno y Ameyoko (mercado callejero)', 'Tokyo Skytree (atardecer)'], reason: 'Ya estaréis en la zona por la mañana con Senso-ji; ambos están a un paso.' },
  { when: 'Día 27 — de día', zone: 'Shibuya · Harajuku · Omotesando', items: ['Meiji Jingu (temprano, tranquilo)', 'Takeshita Street', 'Omotesando', 'Shibuya: Hachiko + cruce + Shibuya Sky (atardecer, reservar antes)'], reason: 'Bloque conectado a pie o 1-2 paradas de metro. Empezad por Meiji Jingu, terminad en Shibuya al atardecer.' },
  { when: 'Día 27 — noche', zone: 'Shinjuku', items: ['Kabukicho', 'Omoide Yokocho', 'Golden Gai', 'Godzilla Head (Hotel Gracery)'], reason: 'Shinjuku de noche, todo en 10 min andando.' },
  { when: 'Día 28 — de día', zone: 'Tsukiji · Ginza · Azabudai · Roppongi', items: ['Mercado Tsukiji (temprano)', 'Ginza', 'Azabudai Hills', 'Roppongi + Tokyo Tower Mori'], reason: 'Tsukiji-Ginza cerca entre sí; Azabudai/Roppongi a 15-20 min en metro.' },
  { when: 'Día 28 — atardecer/noche', zone: 'Odaiba', items: ['Estatua de la Libertad (réplica)', 'Robot Gundam (DiverCity)', 'Rainbow Bridge al atardecer', 'TeamLab Borderless (de noche)'], reason: 'Vuestra zona de hotel: cierre de día perfecto. Reservad TeamLab con antelación.' },
  { when: 'Día 28 (si sobra tiempo)', zone: 'Akihabara', items: ['Barrio del anime, videojuegos y electrónica'], reason: 'No encaja con facilidad por geografía — a 15 min en metro desde Ginza si queréis sacrificar algo de ese bloque.' },
  { when: 'Día 29 — mañana hasta ~14h', zone: 'Odaiba / camino a Narita', items: ['Algo tranquilo cerca del hotel', 'Compras de última hora'], reason: 'Mañana corta antes del aeropuerto.' },
];

const USJ_PLAN = {
  queueApiParkId: 284,
  strategy: [
    'Reservad Express Pass con antelación para minimizar colas en agosto (temporada alta): sin él, las colas top pueden superar 90-120 min.',
    'Entrad al abrir e id directos a Super Nintendo World a por la entrada con cita (timed-entry) si el aforo lo requiere.',
    'Después, Wizarding World of Harry Potter antes de las 11:00.',
    'Hollywood Dream the Ride y The Flying Dinosaur a media mañana.',
    'Comed pronto (12:00-12:30) o tarde (14:30) para evitar el pico de mediodía.',
    'Por la tarde, shows y atracciones con menos cola; dejad las top para última hora si bajan las colas.',
  ],
  bestRestaurant: { name: "Finnegan's Bar & Grill", zone: 'Hollywood / New York area', desc: 'El restaurante mejor valorado del parque: ambiente de pub irlandés, fish & chips, cerveza artesanal, música en vivo.' },
  topAttractions: ['Harry Potter and the Forbidden Journey', 'Flight of the Hippogriff', 'The Flying Dinosaur (Jurassic Park)', 'Hollywood Dream - The Ride', "Mario Kart: Koopa's Challenge", "Yoshi's Adventure"],
};

const DISNEY_PARKS = [
  { name: 'Tokyo DisneySea', lat: 35.6263, lng: 139.8853, desc: 'Único en el mundo, temática marítima y de exploración, ambientación más elaborada y adulta. Para muchos, el mejor parque Disney del planeta.', top: ['Soaring: Fantastic Flight', 'Journey to the Center of the Earth', 'Toy Story Mania!', 'Tower of Terror', 'Fantasy Springs'] },
  { name: 'Tokyo Disneyland', lat: 35.6329, lng: 139.8804, desc: 'El parque clásico Disney: castillo, Mundo de Fantasía, Mickey, desfiles. Más familiar y nostálgico.', top: ["Pooh's Hunny Hunt", 'Big Thunder Mountain', 'Splash Mountain', 'Space Mountain', 'Beauty and the Beast: Magical Journey'] },
];

const FUJI_LOCATION = { lat: 35.3606, lng: 138.7274 };

/* ============================================================
   UTILIDADES
   ============================================================ */

const gmapsUrl = (lat, lng, label) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}${label ? `&query_place_id=` : ''}`;

const gmapsLabelUrl = (name, lat, lng) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}+${lat},${lng}`;

function useExchangeRate() {
  const [rate, setRate] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [status, setStatus] = useState('loading');

  const fetchRate = async () => {
    setStatus('loading');
    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=EUR&to=JPY');
      if (!res.ok) throw new Error('bad response');
      const data = await res.json();
      if (data && data.rates && data.rates.JPY) {
        setRate(data.rates.JPY);
        setUpdatedAt(new Date());
        setStatus('live');
        return;
      }
      throw new Error('no rate');
    } catch (e) {
      setStatus('fallback');
      if (!rate) setRate(168.5);
      setUpdatedAt(new Date());
    }
  };

  useEffect(() => {
    fetchRate();
    const interval = setInterval(fetchRate, 60 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { rate, updatedAt, status, refresh: fetchRate };
}

function useWeather(lat, lng, label) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setData(null);
    (async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=Asia%2FTokyo&forecast_days=7`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('bad');
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setStatus('live');
        }
      } catch (e) {
        if (!cancelled) setStatus('error');
      }
    })();
    return () => { cancelled = true; };
  }, [lat, lng, label]);

  return { data, status };
}

function weatherCodeToIcon(code) {
  if (code === 0) return '☀️';
  if ([1, 2].includes(code)) return '🌤️';
  if (code === 3) return '☁️';
  if ([45, 48].includes(code)) return '🌫️';
  if ([51, 53, 55, 56, 57].includes(code)) return '🌦️';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '🌧️';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return '🌨️';
  if ([95, 96, 99].includes(code)) return '⛈️';
  return '🌡️';
}

function useQueueTimes(parkId) {
  const [rides, setRides] = useState(null);
  const [status, setStatus] = useState('loading');

  const fetchData = async () => {
    setStatus('loading');
    try {
      const res = await fetch(`https://queue-times.com/parks/${parkId}/queue_times.json`);
      if (!res.ok) throw new Error('bad');
      const json = await res.json();
      const lands = json.lands || [];
      const allRides = lands.flatMap((l) => (l.rides || []).map((r) => ({ ...r, land: l.name })));
      if (json.rides) allRides.push(...json.rides.map((r) => ({ ...r, land: 'General' })));
      if (allRides.length === 0) throw new Error('empty');
      setRides(allRides);
      setStatus('live');
    } catch (e) {
      setStatus('fallback');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parkId]);

  return { rides, status, refresh: fetchData };
}

const ESTIMATED_WAITS_BY_HOUR = (hour) => {
  if (hour < 10) return { level: 'Bajo', minutes: '10-25 min', color: COLORS.moss };
  if (hour < 12) return { level: 'Medio', minutes: '30-50 min', color: COLORS.gold };
  if (hour < 16) return { level: 'Alto', minutes: '50-90 min', color: COLORS.vermillion };
  if (hour < 18) return { level: 'Medio-Alto', minutes: '35-60 min', color: COLORS.gold };
  return { level: 'Bajo-Medio', minutes: '15-35 min', color: COLORS.moss };
};

/* ============================================================
   PRIMITIVOS UI
   ============================================================ */

function Seal({ children, size = 40 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        border: `2px solid ${COLORS.vermillion}`, color: COLORS.vermillion,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: size * 0.4, flexShrink: 0,
        fontFamily: 'Georgia, serif',
      }}
    >
      {children}
    </div>
  );
}

function PlaceCard({ place }) {
  const meta = TYPE_META[place.type] || TYPE_META.sight;
  return (
    <a
      href={gmapsLabelUrl(place.name, place.lat, place.lng)}
      target="_blank" rel="noopener noreferrer"
      style={{
        display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 10,
        background: COLORS.paper, border: `1px solid ${COLORS.washiDeep}`,
        textDecoration: 'none', color: 'inherit', marginBottom: 8,
      }}
    >
      <div style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{meta.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
          <span style={{ fontWeight: 600, fontSize: 14.5, color: COLORS.ink }}>{place.name}</span>
          <span style={{ fontSize: 10.5, color: COLORS.indigo, whiteSpace: 'nowrap', fontWeight: 600, letterSpacing: 0.3 }}>
            {meta.label.toUpperCase()}
          </span>
        </div>
        <div style={{ fontSize: 13, color: COLORS.inkSoft, marginTop: 3, lineHeight: 1.4 }}>{place.desc}</div>
        <div style={{ fontSize: 11.5, color: COLORS.indigo, marginTop: 4, fontWeight: 600 }}>📍 Ver en Google Maps →</div>
      </div>
    </a>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: COLORS.vermillion, marginBottom: 8, textTransform: 'uppercase' }}>
      {children}
    </div>
  );
}

/* ============================================================
   PANTALLAS
   ============================================================ */

function HomeScreen({ goTo }) {
  const today = new Date('2026-08-15'); // referencia fija de demo
  const tiles = [
    { key: 'itinerary', icon: '📅', title: 'Itinerario', sub: '21 días, ciudad a ciudad' },
    { key: 'tokyo', icon: '🗼', title: 'Tokio libre', sub: 'Plan por zonas y horarios' },
    { key: 'parks', icon: '🎢', title: 'Universal & Disney', sub: 'Colas en vivo + estrategia' },
    { key: 'weather', icon: '🌤️', title: 'Clima', sub: 'Por ciudad, en directo' },
    { key: 'fuji', icon: '🗻', title: 'Monte Fuji', sub: '¿Se ve hoy?' },
    { key: 'currency', icon: '💴', title: 'Conversor', sub: 'EUR ↔ JPY en vivo' },
    { key: 'translator', icon: '🈳', title: 'Traductor', sub: 'Español ↔ Japonés' },
    { key: 'hotels', icon: '🏨', title: 'Hoteles', sub: '10 alojamientos' },
    { key: 'flights', icon: '✈️', title: 'Vuelos', sub: 'Ida y vuelta' },
    { key: 'food', icon: '🍜', title: 'Qué comer', sub: 'Lo típico por ciudad' },
    { key: 'words', icon: '🌸', title: 'Palabras japonesas', sub: 'Conceptos, belleza, amor' },
  ];
  return (
    <div style={{ padding: '20px 16px 100px' }}>
      <div style={{ textAlign: 'center', marginBottom: 28, marginTop: 8 }}>
        <div style={{ fontSize: 13, color: COLORS.indigo, fontWeight: 600, letterSpacing: 2 }}>新婚旅行 · LUNA DE MIEL</div>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 34, color: COLORS.ink, marginTop: 6, fontWeight: 700 }}>日本</div>
        <div style={{ fontSize: 14, color: COLORS.inkSoft, marginTop: 4 }}>9 — 30 agosto 2026</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {tiles.map((t) => (
          <button
            key={t.key}
            onClick={() => goTo(t.key)}
            style={{
              background: COLORS.paper, border: `1px solid ${COLORS.washiDeep}`, borderRadius: 14,
              padding: '18px 14px', textAlign: 'left', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}
          >
            <div style={{ fontSize: 26 }}>{t.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: COLORS.ink }}>{t.title}</div>
            <div style={{ fontSize: 11.5, color: COLORS.inkSoft }}>{t.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ItineraryScreen() {
  const [activeDay, setActiveDay] = useState(1);
  const day = ITINERARY.find((d) => d.day === activeDay);
  const scrollerRef = useRef(null);

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: '16px 16px 0' }}>
        <SectionLabel>Itinerario · 21 días</SectionLabel>
      </div>
      <div ref={scrollerRef} style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 16px 14px', WebkitOverflowScrolling: 'touch' }}>
        {ITINERARY.map((d) => (
          <button
            key={d.day}
            onClick={() => setActiveDay(d.day)}
            style={{
              flexShrink: 0, padding: '10px 12px', borderRadius: 10,
              border: `1.5px solid ${d.day === activeDay ? COLORS.vermillion : COLORS.washiDeep}`,
              background: d.day === activeDay ? COLORS.vermillion : COLORS.paper,
              color: d.day === activeDay ? COLORS.washi : COLORS.ink,
              cursor: 'pointer', textAlign: 'center', minWidth: 56,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.85 }}>DÍA</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{d.day}</div>
          </button>
        ))}
      </div>

      {day && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12.5, color: COLORS.indigo, fontWeight: 700 }}>
              {new Date(day.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} · {day.city}
            </div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: COLORS.ink, marginTop: 2 }}>{day.title}</div>
            <div style={{ fontSize: 13.5, color: COLORS.inkSoft, marginTop: 6, lineHeight: 1.5 }}>{day.summary}</div>
          </div>

          {day.park && (
            <div style={{ background: COLORS.indigo, color: COLORS.washi, padding: '12px 14px', borderRadius: 10, marginBottom: 14, fontSize: 13 }}>
              🎢 Día de parque temático — abre la sección <strong>Universal & Disney</strong> en el menú principal para ver estrategia y colas en vivo.
            </div>
          )}

          {day.places && day.places.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              {day.places.map((p, i) => <PlaceCard key={i} place={p} />)}
            </div>
          )}

          {day.note && (
            <div style={{ background: '#FDF6E8', border: `1px solid ${COLORS.gold}40`, borderRadius: 10, padding: '12px 14px', fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 700, color: COLORS.gold }}>💡 Sugerencia de organización — </span>{day.note}
            </div>
          )}

          {day.places && day.places.length === 0 && !day.park && (
            <div style={{ fontSize: 13.5, color: COLORS.inkSoft, fontStyle: 'italic' }}>
              Día libre — consulta la sección "Tokio libre" en el menú principal.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TokyoFreeScreen() {
  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SectionLabel>Tokio · Tiempo libre</SectionLabel>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: COLORS.ink, marginBottom: 8 }}>Plan por zonas</div>
      <div style={{ fontSize: 13.5, color: COLORS.inkSoft, lineHeight: 1.55, marginBottom: 18 }}>
        Habéis acumulado bastante tiempo libre: la tarde del día 23, los días 27 y 28 completos, y la mañana del 29. Agrupado por cercanía y mejor franja horaria, para minimizar desplazamientos.
      </div>
      {TOKYO_FREE_BLOCKS.map((b, i) => (
        <div key={i} style={{ background: COLORS.paper, border: `1px solid ${COLORS.washiDeep}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.vermillion, letterSpacing: 0.5 }}>{b.when.toUpperCase()}</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 700, color: COLORS.ink, marginTop: 3, marginBottom: 6 }}>{b.zone}</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.6 }}>
            {b.items.map((it, j) => <li key={j}>{it}</li>)}
          </ul>
          <div style={{ fontSize: 12, color: COLORS.indigo, marginTop: 8, fontStyle: 'italic' }}>{b.reason}</div>
        </div>
      ))}

      <div style={{ background: '#FDF6E8', border: `1px solid ${COLORS.gold}40`, borderRadius: 10, padding: 14, marginTop: 16, fontSize: 13, lineHeight: 1.55 }}>
        <strong style={{ color: COLORS.gold }}>🥋 Sumo — </strong>
        Los torneos oficiales (basho) son solo 6 veces al año y no coinciden con agosto 2026. Podéis visitar un "sumo stable" (heya) para ver un entrenamiento matutino, o el museo del Ryogoku Kokugikan. Conviene confirmarlo más cerca de la fecha.
      </div>
      <div style={{ background: '#FDF6E8', border: `1px solid ${COLORS.gold}40`, borderRadius: 10, padding: 14, marginTop: 10, fontSize: 13, lineHeight: 1.55 }}>
        <strong style={{ color: COLORS.gold }}>🖋️ Tatuajes — </strong>
        Repartirlo en 2 días distintos tiene sentido: 6h seguidas rompería la planificación. Sugerencia: el día 27 por la mañana (10:00-13:00) tatuaje de uno, tarde-noche en Shinjuku (donde está el estudio) ya programado. El día 28, tatuaje del otro por la mañana y aprovecháis la tarde para el bloque correspondiente.
      </div>
    </div>
  );
}

function ParksScreen() {
  const [tab, setTab] = useState('usj');
  const { rides, status, refresh } = useQueueTimes(USJ_PLAN.queueApiParkId);
  const hour = new Date().getHours();
  const est = ESTIMATED_WAITS_BY_HOUR(hour);

  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SectionLabel>Parques temáticos</SectionLabel>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setTab('usj')} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1.5px solid ${COLORS.indigo}`, background: tab === 'usj' ? COLORS.indigo : COLORS.paper, color: tab === 'usj' ? COLORS.washi : COLORS.indigo, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Universal (día 2)</button>
        <button onClick={() => setTab('disney')} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1.5px solid ${COLORS.indigo}`, background: tab === 'disney' ? COLORS.indigo : COLORS.paper, color: tab === 'disney' ? COLORS.washi : COLORS.indigo, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Disney (días 16-17)</button>
      </div>

      {tab === 'usj' && (
        <div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: COLORS.ink, marginBottom: 4 }}>Universal Studios Japan</div>
          <div style={{ fontSize: 13, color: COLORS.inkSoft, marginBottom: 14 }}>11 de agosto · Osaka</div>

          <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.washiDeep}`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>⏱️ Colas en directo</span>
              <button onClick={refresh} style={{ fontSize: 11, color: COLORS.indigo, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}>↻ Actualizar</button>
            </div>
            {status === 'loading' && <div style={{ fontSize: 13, color: COLORS.inkSoft }}>Consultando queue-times.com...</div>}
            {status === 'live' && rides && (
              <div>
                <div style={{ fontSize: 11, color: COLORS.moss, fontWeight: 700, marginBottom: 8 }}>● EN VIVO — queue-times.com</div>
                {rides.slice(0, 8).map((r) => (
                  <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${COLORS.washiDeep}`, fontSize: 13 }}>
                    <span style={{ color: COLORS.ink }}>{r.name}</span>
                    <span style={{ fontWeight: 700, color: r.is_open ? (r.wait_time > 45 ? COLORS.vermillion : COLORS.moss) : COLORS.inkSoft }}>
                      {r.is_open ? `${r.wait_time} min` : 'Cerrada'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {status === 'fallback' && (
              <div>
                <div style={{ fontSize: 11, color: COLORS.gold, fontWeight: 700, marginBottom: 8 }}>● ESTIMADO — sin conexión a datos en vivo ahora mismo</div>
                <div style={{ fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.5 }}>
                  Cuando abráis la app desde el móvil en Japón, aquí veréis las colas reales de cada atracción (fuente: queue-times.com). Por ahora, estimación típica de agosto: <strong style={{ color: est.color }}>{est.level} ({est.minutes})</strong>.
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>🎯 Plan optimizado del día</div>
            {USJ_PLAN.strategy.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.5 }}>
                <span style={{ color: COLORS.vermillion, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                <span>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#FDF6E8', border: `1px solid ${COLORS.gold}40`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: COLORS.gold, marginBottom: 4 }}>🍽️ Mejor restaurante del parque</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{USJ_PLAN.bestRestaurant.name}</div>
            <div style={{ fontSize: 12.5, color: COLORS.inkSoft }}>{USJ_PLAN.bestRestaurant.zone}</div>
            <div style={{ fontSize: 13, color: COLORS.inkSoft, marginTop: 4 }}>{USJ_PLAN.bestRestaurant.desc}</div>
          </div>

          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>🎢 Atracciones imprescindibles</div>
          {USJ_PLAN.topAttractions.map((a, i) => (
            <div key={i} style={{ fontSize: 13, color: COLORS.ink, padding: '6px 0', borderBottom: i < USJ_PLAN.topAttractions.length - 1 ? `1px solid ${COLORS.washiDeep}` : 'none' }}>⛩️ {a}</div>
          ))}
        </div>
      )}

      {tab === 'disney' && (
        <div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: COLORS.ink, marginBottom: 4 }}>Tokyo Disney Resort</div>
          <div style={{ fontSize: 13, color: COLORS.inkSoft, marginBottom: 14 }}>25-26 de agosto · 2 noches en el hotel Disney</div>

          <div style={{ background: '#FDF6E8', border: `1px solid ${COLORS.gold}40`, borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 13, lineHeight: 1.5 }}>
            <strong style={{ color: COLORS.gold }}>📌 Recomendación de orden — </strong>
            DisneySea primero (día 25): es el más singular y el que justifica el viaje, mejor con energías frescas. Disneyland el segundo día (26).
          </div>

          {DISNEY_PARKS.map((p, i) => (
            <div key={i} style={{ background: COLORS.paper, border: `1px solid ${COLORS.washiDeep}`, borderRadius: 12, padding: 14, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: COLORS.inkSoft, marginBottom: 8, lineHeight: 1.5 }}>{p.desc}</div>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.indigo, marginBottom: 4 }}>TOP ATRACCIONES</div>
              {p.top.map((a, j) => <div key={j} style={{ fontSize: 12.5, color: COLORS.ink, padding: '3px 0' }}>· {a}</div>)}
              <a href={gmapsLabelUrl(p.name, p.lat, p.lng)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11.5, color: COLORS.indigo, fontWeight: 700, marginTop: 6, display: 'inline-block' }}>📍 Ver en Google Maps →</a>
            </div>
          ))}

          <div style={{ marginBottom: 14, marginTop: 4 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>🎯 Estrategia</div>
            {DISNEY_PLAN_STRATEGY.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.5 }}>
                <span style={{ color: COLORS.vermillion, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                <span>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 12, color: COLORS.inkSoft, background: COLORS.washiDeep, padding: 12, borderRadius: 10, lineHeight: 1.5 }}>
            ⚠️ Tokyo Disney Resort no comparte datos de colas con plataformas externas. La app oficial "Tokyo Disney Resort App" sí tiene tiempos reales, descargadla antes de viajar. Aquí veréis una estimación por franja horaria: ahora mismo sería <strong style={{ color: est.color }}>{est.level} ({est.minutes})</strong>.
          </div>
        </div>
      )}
    </div>
  );
}

const DISNEY_PLAN_STRATEGY = [
  'Descargad la app oficial "Tokyo Disney Resort App" antes de viajar — permite comprar Premier Access (de pago, por atracción) para saltar colas.',
  'Entrad a la apertura y haced primero la atracción más demandada del parque elegido ese día.',
  'En DisneySea: Soaring y Toy Story Mania suelen tener las colas más largas — Premier Access muy recomendable.',
  "En Disneyland: Pooh's Hunny Hunt es histórica por sus colas; id a primera hora.",
  'Comed pronto (11:30-12:00) o tarde (14:00+) evitando el pico de mediodía.',
];

function WeatherScreen() {
  const cities = useMemo(() => [
    { name: 'Osaka', lat: 34.6937, lng: 135.5023 },
    { name: 'Kyoto', lat: 35.0116, lng: 135.7681 },
    { name: 'Hiroshima', lat: 34.3853, lng: 132.4553 },
    { name: 'Koyasan', lat: 34.2127, lng: 135.5859 },
    { name: 'Kanazawa', lat: 36.5613, lng: 136.6562 },
    { name: 'Takayama', lat: 36.1408, lng: 137.2526 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  ], []);
  const [selected, setSelected] = useState(cities[0]);
  const { data, status } = useWeather(selected.lat, selected.lng, selected.name);

  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SectionLabel>Clima en directo</SectionLabel>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 6 }}>
        {cities.map((c) => (
          <button key={c.name} onClick={() => setSelected(c)} style={{
            flexShrink: 0, padding: '8px 14px', borderRadius: 20,
            border: `1.5px solid ${selected.name === c.name ? COLORS.indigo : COLORS.washiDeep}`,
            background: selected.name === c.name ? COLORS.indigo : COLORS.paper,
            color: selected.name === c.name ? COLORS.washi : COLORS.ink,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>{c.name}</button>
        ))}
      </div>

      {status === 'loading' && <div style={{ fontSize: 13, color: COLORS.inkSoft, padding: 20, textAlign: 'center' }}>Consultando el tiempo en {selected.name}...</div>}
      {status === 'error' && <div style={{ fontSize: 13, color: COLORS.vermillion, padding: 20, textAlign: 'center' }}>No se pudo conectar con el servicio de clima ahora mismo. Reintenta más tarde.</div>}

      {data && status === 'live' && (
        <div>
          <div style={{ background: COLORS.indigo, color: COLORS.washi, borderRadius: 16, padding: 22, textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 600 }}>{selected.name} ahora</div>
            <div style={{ fontSize: 46, margin: '6px 0' }}>{weatherCodeToIcon(data.current?.weather_code)}</div>
            <div style={{ fontSize: 38, fontWeight: 800 }}>{Math.round(data.current?.temperature_2m)}°C</div>
            <div style={{ fontSize: 12.5, opacity: 0.8, marginTop: 4 }}>Humedad {data.current?.relative_humidity_2m}%</div>
          </div>

          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10, color: COLORS.ink }}>Próximos días</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {data.daily?.time?.slice(0, 7).map((date, i) => (
              <div key={date} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: COLORS.paper, border: `1px solid ${COLORS.washiDeep}`, borderRadius: 10, padding: '10px 14px' }}>
                <span style={{ fontSize: 13, fontWeight: 600, width: 70 }}>{new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}</span>
                <span style={{ fontSize: 20 }}>{weatherCodeToIcon(data.daily.weather_code[i])}</span>
                <span style={{ fontSize: 12.5, color: COLORS.indigo }}>💧{data.daily.precipitation_probability_max[i]}%</span>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{Math.round(data.daily.temperature_2m_max[i])}° / {Math.round(data.daily.temperature_2m_min[i])}°</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ fontSize: 11, color: COLORS.inkSoft, marginTop: 14, textAlign: 'center' }}>Datos vía Open-Meteo, actualizados al abrir la app.</div>
    </div>
  );
}

function FujiScreen() {
  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SectionLabel>Monte Fuji</SectionLabel>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>¿Se ve hoy?</div>
      <div style={{ fontSize: 13.5, color: COLORS.inkSoft, lineHeight: 1.55, marginBottom: 16 }}>
        Lo veréis de camino de Hakone a Tokio (día 13). El Fuji solo se aprecia bien en días despejados — consultad aquí antes de salir hacia Owakudani.
      </div>

      <div style={{ borderRadius: 16, overflow: 'hidden', border: `1px solid ${COLORS.washiDeep}`, marginBottom: 12 }}>
        <div style={{ background: `linear-gradient(180deg, #BFD4E0 0%, #E8E0CF 100%)`, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 50 }}>🗻</span>
          <span style={{ fontSize: 12, color: COLORS.inkSoft, textAlign: 'center', padding: '0 24px' }}>Webcam en directo se carga aquí al abrir la app en el navegador (las webcams públicas no se pueden incrustar en esta vista previa)</span>
        </div>
      </div>

      <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.washiDeep}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 6 }}>📷 Fuente recomendada</div>
        <a href="https://www.fujisan-net.jp/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: COLORS.indigo, fontWeight: 600 }}>fujisan-net.jp — webcams oficiales del Fuji →</a>
      </div>

      <a href={gmapsLabelUrl('Mount Fuji', FUJI_LOCATION.lat, FUJI_LOCATION.lng)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: COLORS.indigo, fontWeight: 600 }}>📍 Ver ubicación en Google Maps →</a>
    </div>
  );
}

function CurrencyScreen() {
  const { rate, updatedAt, status, refresh } = useExchangeRate();
  const [eur, setEur] = useState('100');
  const [jpy, setJpy] = useState('');
  const [lastEdited, setLastEdited] = useState('eur');

  useEffect(() => {
    if (!rate) return;
    if (lastEdited === 'eur') {
      const v = parseFloat(eur);
      setJpy(isNaN(v) ? '' : (v * rate).toFixed(0));
    } else {
      const v = parseFloat(jpy);
      setEur(isNaN(v) ? '' : (v / rate).toFixed(2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate]);

  const onEurChange = (v) => {
    setEur(v); setLastEdited('eur');
    const n = parseFloat(v);
    setJpy(isNaN(n) || !rate ? '' : (n * rate).toFixed(0));
  };
  const onJpyChange = (v) => {
    setJpy(v); setLastEdited('jpy');
    const n = parseFloat(v);
    setEur(isNaN(n) || !rate ? '' : (n / rate).toFixed(2));
  };

  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SectionLabel>Conversor de divisas</SectionLabel>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: COLORS.ink, marginBottom: 16 }}>EUR ↔ JPY</div>

      <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.washiDeep}`, borderRadius: 16, padding: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: COLORS.indigo, letterSpacing: 0.5 }}>EUROS (€)</label>
          <input
            type="number" value={eur} onChange={(e) => onEurChange(e.target.value)}
            style={{ width: '100%', fontSize: 28, fontWeight: 700, border: 'none', borderBottom: `2px solid ${COLORS.indigo}`, background: 'transparent', padding: '8px 0', marginTop: 4, color: COLORS.ink, outline: 'none' }}
          />
        </div>
        <div style={{ textAlign: 'center', fontSize: 18, color: COLORS.vermillion, margin: '4px 0' }}>⇅</div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: COLORS.indigo, letterSpacing: 0.5 }}>YENES (¥)</label>
          <input
            type="number" value={jpy} onChange={(e) => onJpyChange(e.target.value)}
            style={{ width: '100%', fontSize: 28, fontWeight: 700, border: 'none', borderBottom: `2px solid ${COLORS.indigo}`, background: 'transparent', padding: '8px 0', marginTop: 4, color: COLORS.ink, outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, padding: '0 4px' }}>
        <div style={{ fontSize: 12, color: COLORS.inkSoft }}>
          {status === 'live' && <span>1 € = {rate?.toFixed(2)} ¥ <span style={{ color: COLORS.moss, fontWeight: 700 }}>● en vivo</span></span>}
          {status === 'fallback' && <span>1 € ≈ {rate?.toFixed(2)} ¥ <span style={{ color: COLORS.gold, fontWeight: 700 }}>● aproximado</span></span>}
          {status === 'loading' && <span>Consultando tipo de cambio...</span>}
        </div>
        <button onClick={refresh} style={{ fontSize: 11, color: COLORS.indigo, background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>↻ Actualizar</button>
      </div>
      {updatedAt && <div style={{ fontSize: 10.5, color: COLORS.inkSoft, marginTop: 2, padding: '0 4px' }}>Actualizado: {updatedAt.toLocaleTimeString('es-ES')}</div>}

      <div style={{ marginTop: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Referencia rápida</div>
        {[1000, 5000, 10000, 50000].map((amount) => (
          <div key={amount} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${COLORS.washiDeep}`, fontSize: 14 }}>
            <span>¥{amount.toLocaleString()}</span>
            <span style={{ fontWeight: 700, color: COLORS.indigo }}>{rate ? (amount / rate).toFixed(2) : '–'} €</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const QUICK_PHRASES = [
  { es: '¿Dónde está el baño?', romaji: 'Toire wa doko desu ka?', jp: 'トイレはどこですか？' },
  { es: 'La cuenta, por favor', romaji: 'Okaikei onegaishimasu', jp: 'お会計お願いします' },
  { es: '¿Cuánto cuesta?', romaji: 'Ikura desu ka?', jp: 'いくらですか？' },
  { es: 'Sin gluten, por favor', romaji: 'Guruten nashi de onegaishimasu', jp: 'グルテンなしでお願いします' },
  { es: 'Muchas gracias', romaji: 'Arigatou gozaimasu', jp: 'ありがとうございます' },
  { es: 'Perdón / disculpe', romaji: 'Sumimasen', jp: 'すみません' },
  { es: '¿Puede hacernos una foto?', romaji: 'Shashin o totte itadakemasu ka?', jp: '写真を撮っていただけますか？' },
  { es: 'Está delicioso', romaji: 'Oishii desu', jp: '美味しいです' },
  { es: 'Dos personas, por favor', romaji: 'Futari desu', jp: '二人です' },
  { es: 'Salud / ¡brindemos!', romaji: 'Kanpai!', jp: '乾杯！' },
];

function TranslatorScreen() {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState('es-jp');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const translate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const systemPrompt = direction === 'es-jp'
        ? 'Eres un traductor experto español-japonés para viajeros. Traduce el texto del español al japonés. Responde ÚNICAMENTE en JSON válido, sin texto adicional, con este formato exacto: {"japanese":"texto en kanji/hiragana/katakana","romaji":"transliteración en romaji","notes":"breve nota cultural o de pronunciación si es relevante, o cadena vacía si no aplica"}'
        : 'Eres un traductor experto japonés-español para viajeros. Traduce el texto del japonés al español. Responde ÚNICAMENTE en JSON válido, sin texto adicional, con este formato exacto: {"spanish":"traducción al español","romaji":"transliteración en romaji del original","notes":"breve nota cultural si es relevante, o cadena vacía"}';

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: 'user', content: input }],
        }),
      });
      const data = await response.json();
      const text = data.content?.find((c) => c.type === 'text')?.text || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setError('No se pudo traducir. Comprueba la conexión e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SectionLabel>Traductor</SectionLabel>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: COLORS.ink, marginBottom: 16 }}>Español ↔ 日本語</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button onClick={() => setDirection('es-jp')} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1.5px solid ${COLORS.indigo}`, background: direction === 'es-jp' ? COLORS.indigo : COLORS.paper, color: direction === 'es-jp' ? COLORS.washi : COLORS.indigo, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>ES → 日本語</button>
        <button onClick={() => setDirection('jp-es')} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1.5px solid ${COLORS.indigo}`, background: direction === 'jp-es' ? COLORS.indigo : COLORS.paper, color: direction === 'jp-es' ? COLORS.washi : COLORS.indigo, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>日本語 → ES</button>
      </div>

      <textarea
        value={input} onChange={(e) => setInput(e.target.value)}
        placeholder={direction === 'es-jp' ? 'Escribe en español...' : '日本語で書いてください...'}
        style={{ width: '100%', minHeight: 70, borderRadius: 10, border: `1.5px solid ${COLORS.washiDeep}`, padding: 12, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', background: COLORS.paper }}
      />
      <button onClick={translate} disabled={loading} style={{ width: '100%', marginTop: 10, padding: '12px 0', borderRadius: 10, border: 'none', background: COLORS.vermillion, color: COLORS.washi, fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
        {loading ? 'Traduciendo...' : 'Traducir'}
      </button>

      {error && <div style={{ color: COLORS.vermillion, fontSize: 13, marginTop: 12 }}>{error}</div>}

      {result && (
        <div style={{ background: COLORS.paper, border: `1px solid ${COLORS.washiDeep}`, borderRadius: 12, padding: 16, marginTop: 16 }}>
          {direction === 'es-jp' ? (
            <>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>{result.japanese}</div>
              <div style={{ fontSize: 14, color: COLORS.indigo, fontWeight: 600, marginBottom: 4 }}>{result.romaji}</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.ink, marginBottom: 6 }}>{result.spanish}</div>
              <div style={{ fontSize: 13, color: COLORS.indigo, fontWeight: 600, marginBottom: 4 }}>{result.romaji}</div>
            </>
          )}
          {result.notes && <div style={{ fontSize: 12.5, color: COLORS.inkSoft, marginTop: 8, fontStyle: 'italic', borderTop: `1px solid ${COLORS.washiDeep}`, paddingTop: 8 }}>💡 {result.notes}</div>}
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Frases útiles</div>
        {QUICK_PHRASES.map((p, i) => (
          <button key={i} onClick={() => setInput(p.es)} style={{ width: '100%', textAlign: 'left', background: COLORS.paper, border: `1px solid ${COLORS.washiDeep}`, borderRadius: 10, padding: '10px 12px', marginBottom: 6, cursor: 'pointer' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink }}>{p.es}</div>
            <div style={{ fontSize: 12, color: COLORS.indigo, marginTop: 2 }}>{p.jp} · {p.romaji}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function HotelsScreen() {
  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SectionLabel>Hoteles</SectionLabel>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: COLORS.ink, marginBottom: 16 }}>Alojamientos</div>
      {HOTELS.map((h) => (
        <a key={h.id} href={gmapsLabelUrl(h.name, h.lat, h.lng)} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: COLORS.paper, border: `1px solid ${COLORS.washiDeep}`, borderRadius: 12, padding: 14, marginBottom: 10, textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.vermillion, letterSpacing: 0.5 }}>{h.city.toUpperCase()}</div>
          <div style={{ fontWeight: 700, fontSize: 15.5, color: COLORS.ink, marginTop: 2 }}>{h.name}</div>
          <div style={{ fontSize: 13, color: COLORS.inkSoft, marginTop: 4 }}>{h.checkIn} → {h.checkOut} · {h.nights} {h.nights === 1 ? 'noche' : 'noches'} · Régimen AD</div>
          <div style={{ fontSize: 11.5, color: COLORS.indigo, marginTop: 6, fontWeight: 600 }}>📍 Ver en Google Maps →</div>
        </a>
      ))}
    </div>
  );
}

function FlightsScreen() {
  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SectionLabel>Vuelos</SectionLabel>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: COLORS.ink, marginBottom: 16 }}>Ida y vuelta</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.moss, letterSpacing: 0.5, marginBottom: 8 }}>IDA — 9 AGOSTO</div>
      {FLIGHTS.filter((f) => f.type === 'outbound').map((f) => <FlightCard key={f.id} f={f} />)}
      <div style={{ fontSize: 11, fontWeight: 700, color: COLORS.vermillion, letterSpacing: 0.5, marginTop: 18, marginBottom: 8 }}>VUELTA — 29-30 AGOSTO</div>
      {FLIGHTS.filter((f) => f.type === 'return').map((f) => <FlightCard key={f.id} f={f} />)}
      <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 16, lineHeight: 1.5 }}>
        💡 Puedes consultar el estado en directo de cada vuelo (retrasos, puerta de embarque) en FlightAware o la web de Etihad introduciendo el número de vuelo.
      </div>
    </div>
  );
}

function FlightCard({ f }) {
  return (
    <a href={`https://www.flightaware.com/live/flight/${f.flightNo}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: COLORS.paper, border: `1px solid ${COLORS.washiDeep}`, borderRadius: 12, padding: 14, marginBottom: 8, textDecoration: 'none', color: 'inherit' }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{f.from} → {f.to}</div>
        <div style={{ fontSize: 12, color: COLORS.inkSoft, marginTop: 2 }}>{f.flightNo} · {new Date(f.date + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.indigo }}>{f.time}</div>
        <div style={{ fontSize: 10.5, color: COLORS.indigo, fontWeight: 600 }}>Ver estado →</div>
      </div>
    </a>
  );
}

function FoodScreen() {
  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SectionLabel>Qué comer</SectionLabel>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: COLORS.ink, marginBottom: 16 }}>Lo típico, ciudad a ciudad</div>
      {Object.entries(LOCAL_FOOD).map(([city, dishes]) => (
        <div key={city} style={{ background: COLORS.paper, border: `1px solid ${COLORS.washiDeep}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.ink, marginBottom: 8 }}>{city}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {dishes.map((d, i) => (
              <span key={i} style={{ background: COLORS.washiDeep, color: COLORS.inkSoft, fontSize: 12.5, padding: '5px 10px', borderRadius: 16, fontWeight: 600 }}>{d}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   APP SHELL
   ============================================================ */

/* ============================================================
   PALABRAS JAPONESAS — conceptos sin traducción exacta,
   frases del viajero, amor y naturaleza
   ============================================================ */

const JP_WORDS = [
  {
    category: '🌸 Amor y relación',
    items: [
      { word: '縁 En', romaji: 'En', meaning: 'El lazo invisible del destino que une a dos personas. La razón por la que os encontrasteis.' },
      { word: '初恋 Hatsukoi', romaji: 'Hatsukoi', meaning: 'Primer amor. Ese sentimiento que nunca se olvida del todo.' },
      { word: '一期一会 Ichi-go ichi-e', romaji: 'Ichi-go ichi-e', meaning: '"Un encuentro, una oportunidad." Cada momento es único e irrepetible. El corazón del viaje.' },
      { word: '恋しい Koishii', romaji: 'Koishii', meaning: 'La melancolía de echar de menos a alguien que amas. Lo que sentiréis al volver.' },
      { word: '大切 Taisetsu', romaji: 'Taisetsu', meaning: 'Alguien o algo que se cuida con el alma porque es irreemplazable.' },
      { word: '想い Omoi', romaji: 'Omoi', meaning: 'El peso de los sentimientos que llevas en el corazón hacia alguien.' },
    ],
  },
  {
    category: '🗻 Naturaleza y belleza',
    items: [
      { word: '木漏れ日 Komorebi', romaji: 'Komorebi', meaning: 'La luz del sol filtrándose entre las hojas de los árboles. Lo veréis en Arashiyama y Koyasan.' },
      { word: '物の哀れ Mono no aware', romaji: 'Mono no aware', meaning: 'La emoción agridulce ante la belleza de lo que es efímero. Los cerezos, los atardeceres, el viaje mismo.' },
      { word: '侘び寂び Wabi-sabi', romaji: 'Wabi-sabi', meaning: 'Encontrar belleza en la imperfección y en lo transitorio. El musgo de los templos, el hierro oxidado de los torii.' },
      { word: '森林浴 Shinrin-yoku', romaji: 'Shinrin-yoku', meaning: '"Baño de bosque." Absorber la atmósfera del bosque con todos los sentidos. Esencial en Koyasan.' },
      { word: '夕焼け Yūyake', romaji: 'Yūyake', meaning: 'El brillo rojizo del cielo al atardecer. El mejor momento en Kiyomizu-dera y el Lago Ashi.' },
      { word: '間 Ma', romaji: 'Ma', meaning: 'El espacio, la pausa, el silencio con significado propio. El vacío que define el arte y la arquitectura japonesa.' },
    ],
  },
  {
    category: '✨ Conceptos únicos',
    items: [
      { word: '懐かしい Natsukashii', romaji: 'Natsukashii', meaning: 'Una nostalgia cálida hacia algo del pasado. Lo que sentiréis al recordar este viaje.' },
      { word: '生き甲斐 Ikigai', romaji: 'Ikigai', meaning: '"Razón de vivir." Aquello que te hace levantarte con propósito cada mañana.' },
      { word: '侘 Wabi', romaji: 'Wabi', meaning: 'La belleza de lo sencillo, lo austero, lo que no necesita adorno. La esencia del ryokan.' },
      { word: '幽玄 Yūgen', romaji: 'Yūgen', meaning: 'Una conciencia profunda del universo que provoca una tristeza misteriosa y hermosa.' },
      { word: '花鳥風月 Kachō fūgetsu', romaji: 'Kachō fūgetsu', meaning: '"Flor, pájaro, viento, luna." La belleza de la naturaleza y el arte de apreciarla.' },
      { word: '道 Dō', romaji: 'Dō', meaning: 'El camino. No solo el trayecto físico, sino el camino de vida, de práctica, de perfección.' },
    ],
  },
  {
    category: '🍜 En la mesa',
    items: [
      { word: 'いただきます Itadakimasu', romaji: 'Itadakimasu', meaning: '"Recibo humildemente." Se dice antes de comer, agradeciendo a todo lo que dio vida al alimento.' },
      { word: 'ごちそうさま Gochisōsama', romaji: 'Gochisōsama deshita', meaning: '"Ha sido un festín." Se dice al terminar de comer, como agradecimiento al cocinero.' },
      { word: 'もったいない Mottainai', romaji: 'Mottainai', meaning: 'La pena de desperdiciar algo valioso. Comed todo lo del plato — es una muestra de respeto.' },
      { word: '旨味 Umami', romaji: 'Umami', meaning: 'El quinto sabor: sabroso, profundo, reconfortante. Lo descubriréis en el ramen y el dashi.' },
      { word: '一汁三菜 Ichijū sansai', romaji: 'Ichijū sansai', meaning: '"Una sopa, tres guarniciones." La estructura del equilibrio perfecto en la mesa japonesa.' },
    ],
  },
  {
    category: '🎌 Viaje y camino',
    items: [
      { word: '旅 Tabi', romaji: 'Tabi', meaning: 'Viaje. También puede significar el camino interior que recorres mientras viajas. El nombre de esta app.' },
      { word: 'お土産 Omiyage', romaji: 'Omiyage', meaning: 'Souvenirs que se traen del viaje para regalar. En Japón es casi una obligación sagrada hacia familia y amigos.' },
      { word: '道草 Michikusa', romaji: 'Michikusa', meaning: '"Hierba del camino." Detenerse a disfrutar de lo inesperado mientras vas de un sitio a otro. Dejarse llevar.' },
      { word: '流れ Nagare', romaji: 'Nagare', meaning: 'El flujo, la corriente. Dejarse llevar por el ritmo del viaje sin forzar nada.' },
      { word: '縁側 Engawa', romaji: 'Engawa', meaning: 'El porche de madera que rodea las casas tradicionales japonesas. El lugar de transición entre dentro y fuera.' },
    ],
  },
];

function WordsScreen() {
  const [openCat, setOpenCat] = useState(0);
  const [flipped, setFlipped] = useState({});

  const toggle = (catI, wordI) => {
    const key = `${catI}-${wordI}`;
    setFlipped((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SectionLabel>Cultura y lenguaje</SectionLabel>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: COLORS.ink, marginBottom: 4 }}>Palabras japonesas</div>
      <div style={{ fontSize: 13, color: COLORS.inkSoft, lineHeight: 1.55, marginBottom: 20 }}>
        Conceptos sin traducción exacta, belleza del idioma y frases esenciales del viajero. Toca cada tarjeta para ver el significado.
      </div>

      {JP_WORDS.map((cat, catI) => (
        <div key={catI} style={{ marginBottom: 16 }}>
          <button
            onClick={() => setOpenCat(openCat === catI ? -1 : catI)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: openCat === catI ? COLORS.indigo : COLORS.paper, border: `1px solid ${COLORS.washiDeep}`, borderRadius: openCat === catI ? '12px 12px 0 0' : 12, padding: '13px 16px', cursor: 'pointer' }}
          >
            <span style={{ fontWeight: 700, fontSize: 14, color: openCat === catI ? COLORS.washi : COLORS.ink }}>{cat.category}</span>
            <span style={{ fontSize: 12, color: openCat === catI ? COLORS.washi : COLORS.inkSoft }}>{openCat === catI ? '▲' : '▼'}</span>
          </button>

          {openCat === catI && (
            <div style={{ border: `1px solid ${COLORS.washiDeep}`, borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
              {cat.items.map((item, wordI) => {
                const key = `${catI}-${wordI}`;
                const isFlipped = flipped[key];
                return (
                  <button
                    key={wordI}
                    onClick={() => toggle(catI, wordI)}
                    style={{ width: '100%', textAlign: 'left', background: isFlipped ? '#FDF6E8' : COLORS.paper, borderBottom: wordI < cat.items.length - 1 ? `1px solid ${COLORS.washiDeep}` : 'none', padding: '14px 16px', cursor: 'pointer', border: 'none', display: 'block' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: 'Georgia, serif', fontSize: 17, fontWeight: 700, color: COLORS.ink }}>{item.word}</span>
                      <span style={{ fontSize: 11, color: COLORS.indigo, fontWeight: 600 }}>{isFlipped ? 'cerrar' : 'ver significado'}</span>
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.indigo, marginTop: 2, fontStyle: 'italic' }}>{item.romaji}</div>
                    {isFlipped && (
                      <div style={{ fontSize: 13.5, color: COLORS.inkSoft, marginTop: 10, lineHeight: 1.6, borderTop: `1px solid ${COLORS.washiDeep}`, paddingTop: 10 }}>
                        {item.meaning}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}

      <div style={{ background: COLORS.indigo, color: COLORS.washi, borderRadius: 14, padding: 18, marginTop: 8, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, marginBottom: 8 }}>一期一会</div>
        <div style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.6 }}>
          Ichi-go ichi-e — "Un encuentro, una oportunidad."<br />
          Este viaje es único e irrepetible. Disfrutadlo.
        </div>
      </div>
    </div>
  );
}

const NAV = [
  { key: 'home', icon: '🏠', label: 'Inicio' },
  { key: 'itinerary', icon: '📅', label: 'Días' },
  { key: 'parks', icon: '🎢', label: 'Parques' },
  { key: 'weather', icon: '🌤️', label: 'Clima' },
  { key: 'more', icon: '⋯', label: 'Más' },
];

const MORE_SCREENS = [
  { key: 'tokyo', icon: '🗼', label: 'Tokio libre' },
  { key: 'fuji', icon: '🗻', label: 'Monte Fuji' },
  { key: 'currency', icon: '💴', label: 'Conversor' },
  { key: 'translator', icon: '🈳', label: 'Traductor' },
  { key: 'hotels', icon: '🏨', label: 'Hoteles' },
  { key: 'flights', icon: '✈️', label: 'Vuelos' },
  { key: 'food', icon: '🍜', label: 'Qué comer' },
  { key: 'words', icon: '🌸', label: 'Palabras japonesas' },
];

export default function App() {
  const [screen, setScreen] = useState('home');

  const renderScreen = () => {
    switch (screen) {
      case 'home': return <HomeScreen goTo={setScreen} />;
      case 'itinerary': return <ItineraryScreen />;
      case 'tokyo': return <TokyoFreeScreen />;
      case 'parks': return <ParksScreen />;
      case 'weather': return <WeatherScreen />;
      case 'fuji': return <FujiScreen />;
      case 'currency': return <CurrencyScreen />;
      case 'translator': return <TranslatorScreen />;
      case 'hotels': return <HotelsScreen />;
      case 'flights': return <FlightsScreen />;
      case 'food': return <FoodScreen />;
      case 'words': return <WordsScreen />;
      case 'more': return <MoreScreen goTo={setScreen} />;
      default: return <HomeScreen goTo={setScreen} />;
    }
  };

  const activeNavKey = MORE_SCREENS.some((m) => m.key === screen) ? 'more' : screen;

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: COLORS.washi, minHeight: '100vh', maxWidth: 480, margin: '0 auto', position: 'relative', color: COLORS.ink }}>
      {screen !== 'home' && (
        <div style={{ position: 'sticky', top: 0, background: COLORS.washi, borderBottom: `1px solid ${COLORS.washiDeep}`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, zIndex: 10 }}>
          <button onClick={() => setScreen('home')} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: COLORS.ink }}>←</button>
          <Seal size={26}>旅</Seal>
        </div>
      )}

      {renderScreen()}

      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: COLORS.paper, borderTop: `1px solid ${COLORS.washiDeep}`, display: 'flex', padding: '8px 4px calc(8px + env(safe-area-inset-bottom))', boxSizing: 'border-box' }}>
        {NAV.map((n) => (
          <button key={n.key} onClick={() => setScreen(n.key)} style={{ flex: 1, background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '4px 0', cursor: 'pointer', color: activeNavKey === n.key ? COLORS.vermillion : COLORS.inkSoft }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 600 }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MoreScreen({ goTo }) {
  return (
    <div style={{ padding: '16px 16px 100px' }}>
      <SectionLabel>Más</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {MORE_SCREENS.map((m) => (
          <button key={m.key} onClick={() => goTo(m.key)} style={{ display: 'flex', alignItems: 'center', gap: 12, background: COLORS.paper, border: `1px solid ${COLORS.washiDeep}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', textAlign: 'left' }}>
            <span style={{ fontSize: 22 }}>{m.icon}</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.ink }}>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
