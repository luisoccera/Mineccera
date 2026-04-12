# Guia Minecraft Pro (Android + iOS)

App movil hecha con Expo + React Native para guias de Minecraft:

- Guia de respuestas rapidas (diamantes, capas, semillas, encantamientos).
- Calculadora de medidas para estructuras.
- Calculadora de diamantes para herramientas y armadura.
- Guia de encantamientos con orden optimizado para menos gasto de XP.
- Mapa de seed integrado y buscador de estructuras cercanas.

## Ejecutar local

```bash
npm install
npm run start
```

Luego abre en:

- Android: tecla `a` (emulador) o escanear QR en Expo Go.
- iOS: tecla `i` (en macOS) o escanear QR en Expo Go.

## Fuentes usadas para mecanicas y seed map

- https://minecraft.wiki/w/Diamond_Ore
- https://minecraft.wiki/w/Anvil_mechanics
- https://www.chunkbase.com/apps/seed-map

## Notas

- El modulo de seed/estructuras usa `WebView` con Chunkbase.
- El optimizador de encantamientos aplica costo de penalizacion de yunque y costo por libro.
