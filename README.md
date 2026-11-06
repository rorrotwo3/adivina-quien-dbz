# Adivina quién · Dragon Ball

Juego de Adivina Quién contra la CPU, con 24 personajes de Dragon Ball.

**Jugar:** [https://adivina-quien-dbz-rho.vercel.app](https://adivina-quien-dbz-rho.vercel.app)

## Cómo se juega

1. Elige tu carta secreta. La CPU sortea la suya del mismo mazo.
2. En tu turno haces una pregunta de sí o no. Las cartas que no encajan se giran y muestran el reverso.
3. La CPU pregunta. Respondes con **Sí**, **No**, **Probablemente sí**, **Probablemente no** o **No lo sé**.
4. Cuando estés seguro, acusa. Si fallas, pierdes. Si aciertas, ganas.
5. La CPU también puede acusar en su turno. Si acierta, gana ella.

## Cómo funciona

Cada personaje tiene atributos de sí o no (saiyajin, calvo, fusión, y el resto del mazo). El tablero del jugador descarta de golpe: si la respuesta es sí o no, las cartas que no coinciden se bajan.

La CPU no tira una pregunta al azar. Elige la que más parte por la mitad a los sospechosos que aún tiene. **Sí** y **No** descartan. **Probablemente sí** y **Probablemente no** no borran a nadie: bajan la probabilidad del lado que no cuadra. **No lo sé** deja el mazo igual. Acusa cuando le queda una carta, o cuando una concentra la mayor parte de la probabilidad.

## Requisitos

- Node.js `^20.19.0` o `>=22.12.0` (lo pide Vite 8)
- npm

## Instalación

```bash
git clone https://github.com/rorrotwo3/adivina-quien-dbz.git
cd adivina-quien-dbz
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://localhost:5173`).

Para generar la carpeta de producción:

```bash
npm run build
npm run preview
```
