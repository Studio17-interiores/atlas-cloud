# Guía rápida - Claves de Supabase

El error:

```text
Your project's URL and Key are required to create a Supabase client
```

significa que falta crear el archivo:

```text
.env.local
```

en la carpeta:

```text
atlas-cloud
```

## 1. Dónde están las claves

Entra en Supabase:

```text
https://supabase.com/dashboard
```

Abre tu proyecto y ve a:

```text
Project Settings > API
```

Necesitas copiar:

- Project URL
- anon public key
- service_role key

## 2. Crea `.env.local`

En la carpeta `atlas-cloud`, crea un archivo llamado:

```text
.env.local
```

con este contenido:

```env
NEXT_PUBLIC_SUPABASE_URL=pega_aqui_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=pega_aqui_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=pega_aqui_service_role_key
OPENAI_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

La clave de OpenAI puede quedarse vacía por ahora.

## 3. Reinicia ATLAS

Cierra la ventana donde está corriendo ATLAS Cloud y vuelve a abrir:

```text
02-iniciar-atlas-cloud.bat
```

Luego abre:

```text
http://localhost:3000
```

## Importante

No compartas la `service_role key`. Es privada.

