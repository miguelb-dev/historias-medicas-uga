-- Tabla para los Médicos
CREATE TABLE medico (
    cedula_medico INTEGER PRIMARY KEY,
    nombres VARCHAR(70),
    apellidos VARCHAR(70),
    telefono VARCHAR(20),
    especialidad VARCHAR(100) -- * 100 por si tiene varias especialidades
);


-- Tabla para los Pacientes
CREATE TABLE paciente (
    cedula_paciente INTEGER PRIMARY KEY,
    nombres VARCHAR(70),
    apellidos VARCHAR(70),
    telefono VARCHAR(20)
);


-- Tabla para las Historias Médicas
CREATE TABLE historia (
    id_historia SERIAL PRIMARY KEY,
    cedula_medico INTEGER NOT NULL,
    cedula_paciente INTEGER NOT NULL,
    fecha_ingreso DATE,
    fecha_egreso DATE,
    tipo_ingreso VARCHAR(20) CHECK (tipo_ingreso IN ('EMPRESA', 'PARTICULAR')),
    diagnostico TEXT,
    cirugias VARCHAR(2) CHECK (cirugias IN ('SI', 'NO')),
    CONSTRAINT fk_historia_medico FOREIGN KEY (cedula_medico) REFERENCES medico (cedula_medico),
    CONSTRAINT fk_historia_paciente FOREIGN KEY (cedula_paciente) REFERENCES paciente (cedula_paciente)
);


-- Tabla para las Facturas
CREATE TABLE factura (
    id_factura INTEGER PRIMARY KEY,
    id_historia INTEGER NOT NULL,
    codigo_control VARCHAR(20),
    fecha_emision DATE,
    titular VARCHAR(100), -- Nombre del responsable del pago (Persona/Empresa)
    forma_pago VARCHAR(20) CHECK (forma_pago IN ('PARTICULAR', 'EMPRESA')),
    -- * Detalles de la Factura
    suministros_hospitalarios DECIMAL(10, 4),
    servicios_cobrables DECIMAL(10, 4),
    medicamentos DECIMAL(10, 4),
    honorarios_medicos DECIMAL(10, 4),
    tasa_dolar_bcv DECIMAL(6, 4),
    estatus VARCHAR(20) CHECK (estatus IN ('PROCESADA', 'ANULADA')),
    motivo TEXT NULL, -- * Solo es diferente a NULL si estatus es ANULADA
    plan_qx VARCHAR(50),
    CONSTRAINT fk_factura_historia FOREIGN KEY (id_historia) REFERENCES historia (id_historia)
);
