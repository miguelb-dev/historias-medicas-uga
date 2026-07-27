# Documentación de la Base de Datos (BBDD)

## Tablas de la BBDD

- medico
- paciente
- historia
- factura

## Relaciones entre las tablas

- medico --> historia (1:N)
- paciente --> historia (1:N)
- historia --> factura (1:N)

## Preguntas Frecuentes

- ¿Por qué hay tantas tablas?: Aunque los usuarios quieren trabajar nada más con Historias Médicas. Para no romper con la Tercera Forma Normal, he decido crear 4 tablas, Historia (que es la principal y la cual conecta con las demás), Paciente, Medico y Factura. Es decir, el usuario rellena los más de 20 campos de una historia médica, y es el backend en cuestión el que distribuye toda la data a la Base de Datos (BBDD).

- ¿Por qué VARCHAR como tipo de dato para las claves primarias/foráneas?: Así podemos aceptar códigos que empiecen con ceros, sin mencionar que aceptaría tanto códigos numéricos como 00356, 00357, etc. Hasta con letras, como B00222, B000223,etc. Es más flexible y menos propenso a errores si los usuarios quieren colocar códigos diferentes.

- ¿Cómo se borran registros de las tablas?: Aunque en teoría el usuario puede poder borrar una historia médica, no se debe borrar nada de la tabla Paciente y Médico, ya que un Paciente y un Médico pueden aparecer en varios registros de la tabla Historia (o sea, deben seguir apareciendo en los registros de Historia que si sirven, por enden no se deben borrar). Pero a su vez, tampoco se debe borrar una Historia ya que estas están asociadas a la tabla Factura, por lo que causaría un error (la tabla Factura lleva una FOREIGN KEY que apunta a Historia). Y tampoco se puede borrar un registro de Factura (ya que eso sería ilegal, no se realiza en la vida real), en los casos donde haya un problema con la factura, lo que se hace es anularse y ya (lo sea, no la eliminan ni botan). Entonces, en conclusión.
