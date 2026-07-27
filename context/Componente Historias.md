# Módulo de Historias Médicas

## Descripción del módulo

Es un componente llamarado Historias.tsx. Dicho componente es basicamente como un panel para la vista de las historias médicas. O sea es un section con la clase historiasRegistradas, con un section y un table.

- El section hijo debe tener:
  1. Un input para buscar una historia en base a los nombres y apellidos del paciente (por ahora solo pon el input, no lo hagas funcional).
  2. Un botón para Crear una historia.
  3. Paginación: es imposible colocar todos los registros en la table (supón que son 10.000, sería una locura), para ello utilizaremos una paginacion como la de Gmail, o sea, se muestra el intervalo en el que vamos (ej: 1-50) + de + número total de registros coincidentes. Por ejemplo: 1-50 de 4328. Obviamente tambien debes colocar dos botones, para retroceder o avanzar en el intervalo, pueden ser algo como "<" y ">", y por ende va avanzando o retrocediendo intervalos, ejemplo: 1-50 de 4328, 51-100 de 4328, etc. O sea el tope de registros que se pueden mostrar a la vez son 50.

- La table debe tener los siguientes campos:
  - Código de la Historia
  - Código del Control
  - Código de la Factura.
  - Cédula - Paciente.
  - Nombres
  - Apellidos
  - Titular

Los datos de la table deberían cargarse en base a la información que regresa la base de datos en supabase con una petición fetch. Fijate en el archivo schema.sql para que veas cómo está construida la base de datos en supabase.

Al presionar el botón de Agregar Usuario, debe desaparecer el section con la clase historiasRegistradas, y en su lugar aparecer un formulario con los siguientes campos:

- Estos campos ponlos dentro de un Fieldset con el Legend de: Datos de la Factura:
  - Código de la Factura (string)
  - Código del Control (string).
  - Fecha de emisión (fecha).
  - Titular (string)
  - Forma de Pago (un select, con las opciones: PARTICULAR o EMPRESA)
  - Suministros Hospitalarios (imput de number)
  - Servicios Cobrables (imput de number)
  - Medicamentos (imput de number)
  - Honorarios médicos (imput de number)
  - Tasa dolar BCV (imput de number)
  - Estatus de la Factura (un select con dos opciones: PROCESADA o ANULADA)
  - Motivo (es un textarea opcional, y solo está disponible si Estatus de la Factura está en ANULADA)
  - Plan QX (select con las siguientes opciones: HOSPITALIZACIÓN, PLAN CRG, PLAN URL, PLAN OFT)

- Estos campos ponlos dentro de un Fieldset con el Legend de: Datos del la Admisión:
  - Fecha de Ingreso (fecha)
  - Fecha de Egreso (fecha)
  - Tipo de Ingreso (un select con las opciones: EMPRESA o PARTICULAR)
  - Cirugias (un inptu de tipo radio con: SI o NO)
  - Diagnóstico (un textarea)

- Estos campos ponlos dentro de un Fieldset con el Legend de: Datos del Paciente:
  - Cédula (text)
  - Nombres (text)
  - Apellidos (text)
  - Números de teléfono (input de teléfono)

- Estos campos ponlos dentro de un Fieldset con el Legend de: Datos del Médico:
  - Cédula (text)
  - Nombres (text)
  - Apellidos (text)
  - Especialidad (un select con las siguientes opciones: Ginecobstetra, Traumatólogo, Cirujano General, Internista, Urólogo, Oftalmólogo)
