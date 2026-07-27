# Historias Médicas (Nombre de la aplicación)

## Descripción general del Proyecto

Es una aplicacin hecha para la Clínica UGA, C.A. Consiste en una plataforma para el registro de las historias médicas de los pacientes (Es en esencia un CRUD, se pueden ver, crear, editar y eliminar historias médicas), para su posterior visualización y análisis de rendimiento de la clínica (En un Dashboard).

## Limitaciones

- Se deben usar las siguientes tecnologías:
  - React en su última versión
  - TypeScrit
  - Estilos en CSS modules
  - Vite (nada de Next.js)

- El tipado de TypeScript se tiene que hacer en src/types/, en un archivo index.ts. No se pueden usar interfaces, solo type

- Las rutas de React Router tienen que estar en src/config/AppRoutes.tsx

## Colores y estilos

- La paleta base de colores debe respetar los colores de la clínica: Azul marino, blanco, y escalas de grises.

- La App debe ser elegante, minimalista, moderna y profesional.

- Los colores los se deben colocar en src/index.css como como variables CSS.

## Conexión con la Base de Datos

El proyecto tiene que estar conectado a la Base de Datos en Supabase. En el archivo .env están las credenciales, usalas para hacer las peticiones HTTP con fetch
