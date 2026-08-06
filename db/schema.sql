-- Base de Datos en PostgreSQL

-- Tabla para los Médicos
CREATE TABLE medico (
    cedula_medico INTEGER PRIMARY KEY,
    nombres VARCHAR(70),
    apellidos VARCHAR(70),
    telefono VARCHAR(20),
    especialidad VARCHAR(100), -- * 100 por si tiene varias especialidades
    estado_medico VARCHAR(10) CHECK (estado_medico IN ('activo', 'inactivo'))
);


-- Tabla para los Pacientes
CREATE TABLE paciente (
    cedula_paciente INTEGER PRIMARY KEY,
    nombres VARCHAR(70),
    apellidos VARCHAR(70),
    fecha_nacimiento DATE,
    edad INTEGER,
    direccion TEXT,
    estado_paciente VARCHAR(10) CHECK (estado_paciente IN ('activo', 'inactivo'))
);


-- Tabla para las Historias Médicas
CREATE TABLE historia (
    id_historia SERIAL PRIMARY KEY,
    cedula_medico INTEGER NOT NULL,
    cedula_paciente INTEGER NOT NULL,
    fecha_ingreso DATE,
    fecha_egreso DATE,
    diagnostico TEXT,
    cirugia VARCHAR(2) CHECK (cirugia IN ('SI', 'NO')),
    plan VARCHAR(50) CHECK (plan IN ('HOSPITALIZACION', 'CASO SOCIAL', 'MATERNIDAD', 'CIRUGIA GENERAL', 'CIRUGIA PEDIATRICA', 'UROLOGIA', 'OFTALMOLOGIA')),
    CONSTRAINT fk_historia_medico FOREIGN KEY (cedula_medico) REFERENCES medico (cedula_medico) ON UPDATE CASCADE,
    CONSTRAINT fk_historia_paciente FOREIGN KEY (cedula_paciente) REFERENCES paciente (cedula_paciente) ON UPDATE CASCADE
);


-- Tabla para las Empresas
CREATE TABLE empresa (
    id_empresa SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    ruc VARCHAR(20),
    direccion TEXT,
    telefono VARCHAR(20),
    estado VARCHAR(10) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo'))
);


-- Tabla para los Seguros
CREATE TABLE seguro (
    id_seguro SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    tipo VARCHAR(50),
    direccion TEXT,
    telefono VARCHAR(20),
    estado VARCHAR(10) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo'))
);


-- Tabla para las Facturas
CREATE TABLE factura (
    id_factura VARCHAR(20) PRIMARY KEY,
    id_historia INTEGER NULL, -- * Permite NULL porque pueden haber facturas sin historias medicas
    id_empresa INTEGER NULL,
    id_seguro INTEGER NULL,
    nuevo_titular VARCHAR(100) NULL, --  * Para NUEVA EMPRESA, NUEVO SEGURO o PARTICULAR
    codigo_control VARCHAR(20) UNIQUE,
    fecha_emision DATE,
    titular VARCHAR(100), -- Nombre del responsable del pago (Persona/Empresa)
    tipo_ingreso VARCHAR(20) CHECK (tipo_ingreso IN ('EMPRESA', 'PARTICULAR', 'SEGURO')),
    forma_pago VARCHAR(20) CHECK (forma_pago IN ('PARTICULAR', 'EMPRESA', 'SEGURO')),
    suministros_hospitalarios DECIMAL(20, 4),
    servicios_cobrables DECIMAL(20, 4),
    medicamentos DECIMAL(20, 4),
    honorarios_medicos_y_servicios_auxiliares DECIMAL(20, 4),
    tasa_dolar_bcv DECIMAL(20, 4),
    estatus VARCHAR(20) CHECK (estatus IN ('PROCESADA', 'ANULADA', 'NOTA DE CREDITO')),
    motivo TEXT NULL, -- * Solo es diferente a NULL si estatus es ANULADA o NOTA DE CREDITO
    CONSTRAINT fk_factura_historia FOREIGN KEY (id_historia) REFERENCES historia (id_historia),
    CONSTRAINT fk_factura_empresa FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa),CONSTRAINT fk_factura_seguro FOREIGN KEY (id_seguro) REFERENCES seguro (id_seguro)
);
