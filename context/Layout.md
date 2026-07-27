# Sobre el Layout

## La Sidebar

La barra de navegación debe estar a la izquierda de la pantalla, con un botón hamburguesa para hacerla aparecer o desaparecerla, y debe incluir los siguientes links:

- Rendimiento
- Historias

## El Header

El Header debe contener el logo y el titulo de la aplicación. El título (un h1) es: Historias Médicas

## El Main

La idea, es que al presionar un link de la sidebar, cambie las pages (para ello es necesario React Router), o sea, tenemos una etiqueta main donde irán todas las pages. Tenemos 2 pages, Rendimiento e Historias.

Los componentes que serán las pages, o sea Rendimiento.tsx e Historias.tsx, deben regresar en su return es una etiqueta section (con su contenido adentro de ese etiqueta por supuesto). De esta manera, en el main se cargará el section.

## El footer

Coloca el nombre de la App, o sea Historias Médicas; los derechos reservados. Y el nombre de la clínica: o sea Clínica UGA, C.A, y justo debajo su RIF: R.I.F.: J-309594117;

## Ubicación

Guarda los componetes Header, Sidebar y Footer en layout/, dentro de una carpeta para cada uno, o sea layout/Header/index.tx, Header.module.css; layout/Sidebar/index.tsx, Sidebar.module.css; layout/Footer/index.tsx, Footer.module.css.
