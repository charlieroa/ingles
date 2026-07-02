# English Coach 🇬🇧

App local para aprender inglés hablando, sin miedo y sin cuentas. Funciona en Google Chrome.

## Cómo abrirla

Doble clic en `start.bat` (abre http://localhost:8088 automáticamente).

O manualmente: `py -m http.server 8088` dentro de esta carpeta y abrir http://localhost:8088 en Chrome.

**Importante:** la primera vez, Chrome pedirá permiso para usar el micrófono → clic en "Permitir". El reconocimiento de voz necesita internet (usa los servidores de Google).

## Los 4 modos

| Modo | Qué entrena | Cómo |
|------|-------------|------|
| 🎤 Hablar | Pronunciación | Lees la frase en voz alta y te dice qué % pronunciaste bien, palabra por palabra |
| 🔁 Shadowing | Oído + boca | Escuchas primero sin leer, luego repites imitando el ritmo |
| 🧠 Frases | Memoria | Repetición espaciada: las frases difíciles vuelven pronto, las fáciles en días |
| 💬 Tutor IA | Conversación real | Chateas (con voz o texto) con Alex, un tutor que corrige con cariño |

El Tutor IA necesita una API key de Anthropic (console.anthropic.com) — cuesta centavos al mes con uso diario. Los otros 3 modos son 100% gratis.

## Rutina diaria recomendada (10-15 min)

1. **3 min** — 🧠 Frases: repasa las pendientes del día
2. **4 min** — 🎤 Hablar: 5 frases nuevas en voz alta
3. **3 min** — 🔁 Shadowing: 3 frases imitando al nativo
4. **5 min** — 💬 Tutor: cuéntale a Alex cómo va tu día

La meta diaria son 10 ejercicios (barra verde arriba). La racha 🔥 se mantiene practicando todos los días, aunque sea poquito. **Consistencia > intensidad.**

## Datos

Todo se guarda en tu navegador (localStorage): racha, XP, progreso de frases y la API key. Nada sale de tu computador excepto el audio (Google) y los mensajes del tutor (Anthropic).
