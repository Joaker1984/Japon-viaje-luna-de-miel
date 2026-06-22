# 旅 Tabi — Japan Honeymoon Companion

App de viaje para la luna de miel en Japón (9–30 agosto 2026).

## Módulos

- 📅 Itinerario completo día a día (21 días)
- 🗼 Plan de Tokio libre organizado por zonas y horarios
- 🎢 Universal Studios Japan + Tokyo Disney (colas + estrategia)
- 🌤️ Clima en directo por ciudad (Open-Meteo)
- 🗻 Monte Fuji — ¿se ve hoy?
- 💴 Conversor EUR ↔ JPY en vivo (Frankfurter API)
- 🈳 Traductor ES ↔ JP (Claude API)
- 🌸 Palabras japonesas con significados
- 🏨 Hoteles + ✈️ Vuelos + 🍜 Qué comer por ciudad

## Deploy en Netlify

### Opción A — Desde la web de Netlify (más fácil)

1. Ve a [netlify.com](https://netlify.com) e inicia sesión
2. Arrastra la carpeta **entera** del proyecto a la zona de drag & drop de Netlify
   - Pero antes, ejecuta el build localmente:
     ```
     npm install
     npm run build
     ```
   - Luego arrastra la carpeta `dist/` generada

### Opción B — Desde GitHub (recomendado para futuras actualizaciones)

1. Sube este proyecto a un repositorio de GitHub
2. En Netlify → "Add new site" → "Import from Git"
3. Selecciona el repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy — Netlify se encargará de todo automáticamente

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Actualizar datos

Todos los datos del viaje están en `src/App.jsx` en las constantes al inicio del fichero:
- `ITINERARY` — días del viaje
- `HOTELS` — hoteles
- `FLIGHTS` — vuelos
- `JP_WORDS` — palabras japonesas
