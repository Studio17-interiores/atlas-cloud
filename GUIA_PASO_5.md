# Paso 5 - Instalar y probar ATLAS Cloud

Este paso sirve para abrir ATLAS Cloud en tu ordenador antes de publicarlo en internet.

## Antes de empezar

Necesitas tener instalado Node.js.

Descarga recomendada:

```text
https://nodejs.org
```

Instala la versión LTS.

## Forma fácil

Dentro de esta carpeta:

```text
atlas-cloud
```

haz doble clic en:

```text
01-instalar-atlas-cloud.bat
```

Espera a que termine.

Después haz doble clic en:

```text
02-iniciar-atlas-cloud.bat
```

Cuando veas que está arrancado, abre en el navegador:

```text
http://localhost:3000
```

## Si aparece un error

Lo más habitual es una de estas cosas:

- Node.js no está instalado.
- Falta el archivo `.env.local`.
- Las claves de Supabase no están bien copiadas.
- No hay conexión a internet para instalar dependencias.

## Archivo `.env.local`

Debe estar en la carpeta `atlas-cloud` y tener este formato:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

La clave de OpenAI puede quedarse vacía al principio.

