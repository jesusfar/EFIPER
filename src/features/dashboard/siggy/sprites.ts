// Sprites de Siggy referenciados por URL desde public/siggy/ (WebP optimizado).
// Ya no se incrustan como data URI para reducir el tamaño del bundle JS.
const BASE = import.meta.env.BASE_URL + 'siggy/';

export const SIGGY_SPRITES: Record<string, string> = {
  "Corriendo.png": `${BASE}Corriendo.webp`,
  "DeathNote.png": `${BASE}DeathNote.webp`,
  "Frieren.png": `${BASE}Frieren.webp`,
  "Fumando.png": `${BASE}Fumando.webp`,
  "Furry.png": `${BASE}Furry.webp`,
  "Hacker.png": `${BASE}Hacker.webp`,
  "Jujutsu.png": `${BASE}Jujutsu.webp`,
  "Libreta.png": `${BASE}Libreta.webp`,
  "Plomero.png": `${BASE}Plomero.webp`,
  "Profesor.png": `${BASE}Profesor.webp`,
  "Pulgares_Arriba.png": `${BASE}Pulgares_Arriba.webp`,
  "Saludo Inicial.png": `${BASE}Saludo Inicial.webp`,
  "Siggyexe.png": `${BASE}Siggyexe.webp`,
};
