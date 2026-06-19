# EFIPER

**EFIPER** es un entrenador offline-first para preparar el **EFIP I de Licenciatura en Informatica de la Universidad Siglo 21**. Centraliza practica teorica, defensa oral, casos, repaso espaciado, progreso por XP y una version portable en un unico archivo HTML.

El proyecto esta pensado para estudiar sin backend, sin cuentas y sin depender de internet. El progreso se guarda localmente en el navegador y puede exportarse/importarse como respaldo JSON.

## Funcionalidades principales

- **Dashboard de progreso** con racha, XP, nivel, rango actual, tema mas debil y accesos rapidos.
- **Sistema de rangos** con progresion por XP, barra visual tipo sable de luz y notificacion de subida de nivel.
- **Test teorico** con preguntas mixtas, multiple choice, respuestas multiples y verdadero/falso.
- **Reglas de seleccion del test** para mantener variedad por tema y por tipo de pregunta.
- **Repaso inteligente tipo Leitner** con cola de vencidas, seguimiento por cajas y distribucion por eje tematico.
- **Defensa oral individual** con respuestas modelo, autoevaluacion y carga automatica al sistema de repaso.
- **Modo Ping-Pong grupal** para practicar oral con hasta 4 participantes sin afectar la cola personal de repaso.
- **Casos practicos** con timer, rubricas, correccion por reglas y soporte de diagramas Mermaid.
- **Simulacro** con ambiente sonoro continuo mientras el usuario permanece en la seccion.
- **Sonidos personalizados** para hover, confirmacion, racha, subida de nivel, respuesta modelo y feedback.
- **Exportar/importar progreso** para respaldar el estado local.
- **PWA instalable** y **archivo autonomo `EFIPER.html`** para abrir con doble clic.

## Abrir sin terminal

La forma mas simple de usar EFIPER es abrir el archivo generado:

1. Descarga o descomprime el proyecto.
2. Haz doble clic en `EFIPER.html`.
3. El navegador abre la app y conserva el progreso en este dispositivo.

Tambien se incluyen accesos directos:

- Windows: `Abrir EFIPER.bat`
- macOS: `Abrir EFIPER.command`

`EFIPER.html` contiene la aplicacion y sus assets embebidos. No requiere servidor para el uso normal.

## Persistencia de progreso

EFIPER guarda el progreso en almacenamiento local del navegador mediante IndexedDB y un espejo en `localStorage`.

Como esos datos pueden borrarse si el usuario limpia el navegador, se recomienda usar periodicamente:

- **Exportar**: descarga un respaldo JSON.
- **Importar**: restaura un respaldo previo.

## Desarrollo

Requisitos:

- Node.js 18 o superior
- npm

Instalacion y comandos:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Comando para regenerar el archivo autonomo:

```bash
npm run build:single
```

Luego copiar `dist-single/index.html` como `EFIPER.html` en la raiz del proyecto.

## Scripts

| Comando | Descripcion |
|---|---|
| `npm run dev` | Inicia Vite para desarrollo local. |
| `npm run build` | Genera la build PWA en `dist/`. |
| `npm run preview` | Previsualiza la build de produccion. |
| `npm run build:single` | Genera una version single-file en `dist-single/`. |

## Stack tecnico

- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Zustand** para estado global
- **Dexie / IndexedDB** para persistencia local
- **Mermaid** para diagramas
- **vite-plugin-pwa** para instalacion/offline
- **vite-plugin-singlefile** para generar `EFIPER.html`

## Estructura del proyecto

```text
src/
  app/                 Router, layout y shell principal
  assets/              Audio, imagenes y recursos embebibles
  components/          UI reutilizable
  data/                Banco de preguntas, oral, teoria y casos
  features/
    cases/             Resolucion de casos practicos
    dashboard/         Inicio, progreso, Siggy y accesos rapidos
    oral/              Defensa oral individual y Ping-Pong
    reviews/           Repaso espaciado
    simulation/        Simulacro
    tests/             Tests teoricos
    teoria/            Lectura de teoria
  lib/
    audio/             Gestion de efectos y musica
    import-export/     Backups y espejo local
    scoring/           Reglas de correccion de casos
    spaced-repetition/ Leitner
    storage/           Dexie e IndexedDB
    theme/             Colores por eje tematico
  store/               Estado global de progreso
  styles/              Estilos globales
  types/               Tipos compartidos
```

## Sistema de progreso

Las respuestas correctas en test y oral suman XP. Los casos practicos tambien pueden sumar XP al entregarse. El nivel determina el rango visible del usuario y la notificacion de subida de nivel.

Rangos actuales:

1. Memorizador de Daypos
2. Picateclas
3. Dev de Tutorial
4. Cazador de Studocus
5. Ingeniero de Chamuyo
6. Arquitecto de Humo
7. Candidato a No Hacer Papelon
8. Leyenda EFIPER

Al llegar a **Leyenda EFIPER**, la barra de progreso queda completa aunque el usuario siga acumulando XP.

## Repaso espaciado

El sistema de repaso usa una variante de Leitner con cinco cajas. Las respuestas se programan para volver a aparecer segun el desempeno del usuario. El objetivo es priorizar lo que se olvida, sin repetir siempre las mismas preguntas ni romper las reglas de variedad del test.

## Contenido

El contenido vive dentro de `src/data/`. Para ampliar el banco, agregar nuevos items respetando los tipos definidos en `src/types/`.

Cada pregunta debe incluir:

- enunciado
- tipo
- opciones cuando corresponda
- respuesta correcta
- explicacion o respuesta modelo
- eje tematico

## Deploy

Para publicar como PWA:

1. Ajustar `base` en `vite.config.ts` segun el destino.
2. Ejecutar `npm run build`.
3. Publicar el contenido de `dist/`.

La app usa `HashRouter`, por lo que funciona bien en GitHub Pages sin reglas de rewrite adicionales.

## EFIPER online con cuentas

La version online usa Cloudflare Pages + Pages Functions + D1. La app sigue funcionando offline con IndexedDB, pero la ruta **Cuenta** permite iniciar sesion y sincronizar el progreso con la nube.

### Cloudflare

1. Crear una cuenta en Cloudflare.
2. Crear una base D1 llamada `efiper`.
3. Reemplazar `database_id` en `wrangler.toml` por el ID real de la base.
4. Aplicar migraciones:

```bash
npm run db:migrate:remote
```

5. En Cloudflare Pages, crear un proyecto conectado al repo.
6. Configurar:

```text
Build command: npm run build
Build output directory: dist
```

7. Agregar el binding D1:

```text
Variable name: DB
D1 database: efiper
```

8. Agregar variables/secretos:

```text
SESSION_SECRET=valor-largo-aleatorio
APP_ORIGIN=https://tu-dominio.pages.dev
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
```

### Google OAuth

En Google Cloud Console crear un OAuth Client Web y agregar:

```text
Authorized redirect URI:
https://tu-dominio.pages.dev/api/auth/oauth/google/callback
```

### Facebook OAuth

En Meta for Developers crear una app con Facebook Login y agregar:

```text
Valid OAuth Redirect URI:
https://tu-dominio.pages.dev/api/auth/oauth/facebook/callback
```

### Sincronizacion

El usuario puede usar EFIPER sin cuenta. Si inicia sesion, desde **Cuenta** puede sincronizar:

- progreso general
- XP y nivel
- intentos
- cola de repaso
- entregas de casos

La nube guarda un snapshot completo por usuario en D1. Si el snapshot remoto es mas nuevo que el local, se restaura; si no, se sube el progreso local.

## Nota

EFIPER puede usarse como herramienta local de estudio sin autenticacion. Si el usuario decide iniciar sesion, el progreso se envia a la base D1 configurada para poder sincronizar entre dispositivos. Los sonidos y recursos multimedia incluidos forman parte de la experiencia personalizada del proyecto.
