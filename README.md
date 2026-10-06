# 🛸 Estación Versalles // Station Versailles

<div align="center">

![Versalles Banner](public/assets/Mapa%20General%20Estaci%C3%B3n%20Versalles.png)

[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC.svg)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Simulador de Ingeniería Aeroespacial y Programación Orbital**  
*Simulateur d'Ingénierie Aérospatiale & Programmation Orbitale*

[ 🇻🇪 Español (Venezuela) | 🇫🇷 Français ]

</div>

---

## 🌟 Características Principales // Fonctionnalités Clés

- 🌐 **Completamente Bilingüe (ES 🇻🇪 / FR 🇫🇷)**:
  - Selector interactivo de idioma en el arranque y en la barra superior HUD.
  - Soporte de comandos CLI: `lang fr`, `lang es`, `aide`, `effacer`, `man`, `clear`.
  - Persistencia automática de idioma en `localStorage`.

- 💻 **Consola Interactiva & Entorno de Ejecución Determinista**:
  - Simulador de terminal UNIX (`ls`, `cd`, `pwd`, `cat`, `grep`, `nano`, `python`, `javac`, `java`).
  - Intérprete determinista en tiempo real para scripts de Python y Java orientados a aviónica.
  - Editor de código integrado con snippets listos para insertar y ejecutar.

- 🚀 **Cartografía & Exploración Interplanetaria**:
  - Salto hiperespacial hacia múltiples destinos: **Estación Versalles**, **Acorazado Hyperion**, **Puesto Titán-IV** y **Laboratorio Helios**.
  - Plano general de distribución interactivo con acceso directo por compartimentos.

- 🎵 **Banda Sonora Dinámica & Jukebox Estelar**:
  - Reproductor con 5 pistas oficiales originales en formato estéreo 320 kbps.
  - Modo bucle continuo, visualizador gráfico de frecuencias y panel táctico multimedia.

- 🚨 **Modo Crisis & Supervivencia en Tiempo Real**:
  - Fusión de plasma, desestabilización magnética, inyección de malware y decaimiento orbital.
  - Minijuego de diagnóstico físico y calibración de hardware en tiempo real.

---

## 🚀 Despliegue en Vercel (Plug-and-Play)

El repositorio incluye un archivo [`vercel.json`](vercel.json) optimizado para despliegue instantáneo con 0 configuración:

1. Haz un **Fork** o sube este repositorio a tu cuenta de **GitHub**.
2. Entra en [vercel.com](https://vercel.com) e inicia sesión con tu GitHub.
3. Haz clic en **"Add New Project"** y selecciona este repositorio.
4. Pulsa **"Deploy"** (Vercel detecta automáticamente Vite).
5. ¡Listo! En menos de un minuto tendrás tu enlace público `https://tu-juego.vercel.app`.

---

## 🛠️ Instalación y Ejecución Local

**Requisitos previos:** [Node.js](https://nodejs.org/) (versión 18 o superior).

```bash
# 1. Clonar el repositorio
git clone https://github.com/Zhailox/estacion-versalles.git

# 2. Entrar al directorio
cd estacion-versalles

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo
npm run dev

# 5. Compilar para producción
npm run build
```

---

## 🎮 Comandos Rápidos del Terminal

| Comando | Acción | Action (FR) |
|---|---|---|
| `AYUDA()` o `man` | Muestra el manual de aviónica | Affiche le manuel avionique (`aide`) |
| `DIAGNOSTICO()` | Diagnóstico de telemetría del sector | Diagnostic de télémétrie du secteur |
| `AUTO_ESTABILIZAR()` | Estabiliza automáticamente el sector | Stabilisation autonome du secteur |
| `VITALES()` | Muestra estado de energía y soporte vital | Bilan d'énergie et constantes |
| `lang <es\|fr>` | Alterna entre Español y Francés | Basculer entre Espagnol et Français |
| `clear` / `effacer` | Limpia la consola | Nettoie la console |

---

## 📄 Licencia

Desarrollado bajo licencia **MIT**. ¡Siéntete libre de clonarlo, mejorarlo y explorarlo! 🛰️
