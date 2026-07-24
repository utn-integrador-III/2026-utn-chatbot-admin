# Descripción del proyecto

Este proyecto corresponde al frontend de la aplicación de chatbot desarrollada con React, TypeScript y Vite.  
La interfaz permite la carga de docuemntos desde parte de los administrativos permitiendo contextualizar al LLM.

El proyecto utiliza tecnologías como:

- React
- TypeScript
- Vite
- Bootstrap
- React Router
---

# Implementación de React

## Requisitos previos

Antes de iniciar, asegúrate de tener instalado en tu equipo:

- Node.js (versión LTS recomendada)

Descargar desde:

https://nodejs.org/en

### Verificar instalación

```bash
node --version
npm --version
npx --version
```

### Actualizar npm (opcional)

```bash
npm install -g npm
```

---

## Herramientas recomendadas

### Visual Studio Code

Instalar las siguientes extensiones:

- ESLint
- Prettier

### Navegador

Instalar la extensión:

- React Developer Tools

Disponible para:

- Chrome
- Firefox
- Edge

---

## Instalación de dependencias del proyecto
1. Instalar todas las dependencias necesarias:

```bash
npm install
```

Este comando instalará automáticamente todas las dependencias configuradas en el archivo `package.json`.

---

## Ejecución del proyecto

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Luego abrir en el navegador la URL mostrada por Vite, normalmente:

```bash
http://localhost:5173
```

---

## Construcción para producción

Generar la versión optimizada del proyecto:

```bash
npm run build
```

---

## Vista previa del build

```bash
npm run preview
```

## Estructura del proyecto

La estructura del proyecto es la siguente:

```text
chatbot_admin/
├── node_modules/
├── public/
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── layout/
|   |   |   |── AuthLayout.tsx -- la imagen de fondo
|   |   |   └── DashboardLayout.tsx
│   │   ├── ui/
|   |   |   ├── Button.tsx
│   │   |   |── Input.tsx
|   |   |   |── NovaMark.tsx
|   |   |   └── Card.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── context/ -- Gestiona el estado global de autenticación y la sesión del usuario
│   │   ├── AuthContext.tsx
│   │   └── AuthContextBase.ts
│   │
│   ├── hooks/ -- Contiene lógica reutilizable para acceder a funcionalidades de la aplicación
│   │   └── useAuth.ts
│   │
│   ├── pages/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── upload-archive.tsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── services/
│   │   ├── apiClient.ts
│   │   ├── authService.ts
│   │   └── fileService.ts
│   │
│   ├── styles/
│   │
│   ├── types/
│   │   ├── file.ts
│   │   └── user.ts
│   │
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
