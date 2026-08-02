-- Creación de la Base de Datos (BBDD)
CREATE DATABASE IF NOT EXISTS historias_medicas_clinica_uga;
USE historias_medicas_clinica_uga;


-- Tabla para los Médicos
CREATE TABLE medico (
    cedula_medico INT PRIMARY KEY,
    nombres VARCHAR(70),
    apellidos VARCHAR(70),
    telefono VARCHAR(20),
    especialidad VARCHAR(100) -- * 100 por si tiene varias especialidades
);


-- Tabla para los Pacientes
CREATE TABLE paciente (
    cedula_paciente INT PRIMARY KEY,
    nombres VARCHAR(70),
    apellidos VARCHAR(70),
    telefono VARCHAR(20)
);


-- Tabla para las Historias Médicas
CREATE TABLE historia (
    id_historia INT AUTO_INCREMENT PRIMARY KEY,
    cedula_medico INT NOT NULL,
    cedula_paciente INT NOT NULL,
    fecha_ingreso DATE,
    fecha_egreso DATE,
    tipo_ingreso ENUM('EMPRESA', 'PARTICULAR'),
    diagnostico TEXT,
    cirugias ENUM('SI', 'NO'),
    CONSTRAINT fk_historia_medico FOREIGN KEY (cedula_medico) REFERENCES medico (cedula_medico),
    CONSTRAINT fk_historia_paciente FOREIGN KEY (cedula_paciente) REFERENCES paciente (cedula_paciente)
);


-- Tabla para las Facturas
CREATE TABLE factura (
    id_factura INT PRIMARY KEY,
    id_historia INT NOT NULL,
    codigo_control VARCHAR(20),
    fecha_emision DATE,
    titular VARCHAR(100), -- Nombre del responsable del pago (Persona/Empresa)
    forma_pago ENUM('PARTICULAR', 'EMPRESA'),
    -- * Detalles de la Factura
    suministros_hospitalarios DECIMAL(10, 4),
    servicios_cobrables DECIMAL(10, 4),
    medicamentos DECIMAL(10, 4),
    honorarios_medicos DECIMAL(10, 4),
    tasa_dolar_bcv DECIMAL(6, 4),
    estatus ENUM('PROCESADA', 'ANULADA'),
    motivo TEXT NULL, -- * Solo es diferente a NULL si estatus es ANULADA
    plan_qx VARCHAR(50),
    CONSTRAINT fk_factura_historia FOREIGN KEY (id_historia) REFERENCES historia (id_historia)
);
