-- ============================================
-- TRANSACCIÓN: Registrar Historia Médica Completa
-- ============================================

BEGIN; -- Inicia la transacción

-- 1. Insertar o verificar el MÉDICO
-- (Si ya existe, solo obtenemos su cédula; si no, lo insertamos)
WITH medico_data AS (
    INSERT INTO medico (cedula_medico, nombres, apellidos, telefono, especialidad)
    VALUES (
        12345678,           -- cédula del médico
        'Carlos',           -- nombres
        'Rodríguez',        -- apellidos
        '0412-5551234',     -- teléfono
        'Cardiología'       -- especialidad
    )
    ON CONFLICT (cedula_medico) DO NOTHING
    RETURNING cedula_medico
),

-- 2. Insertar o verificar el PACIENTE
paciente_data AS (
    INSERT INTO paciente (cedula_paciente, nombres, apellidos, telefono)
    VALUES (
        87654321,           -- cédula del paciente
        'María',            -- nombres
        'González',         -- apellidos
        '0416-7778888'      -- teléfono
    )
    ON CONFLICT (cedula_paciente) DO NOTHING
    RETURNING cedula_paciente
),

-- 3. Insertar la HISTORIA MÉDICA
historia_data AS (
    INSERT INTO historia (
        cedula_medico,
        cedula_paciente,
        fecha_ingreso,
        fecha_egreso,
        tipo_ingreso,
        diagnostico,
        cirugias
    )
    VALUES (
        (SELECT cedula_medico FROM medico_data UNION SELECT 12345678 LIMIT 1),
        (SELECT cedula_paciente FROM paciente_data UNION SELECT 87654321 LIMIT 1),
        '2024-01-15',       -- fecha_ingreso
        '2024-01-20',       -- fecha_egreso
        'PARTICULAR',       -- tipo_ingreso (PARTICULAR o EMPRESA)
        'Infarto agudo de miocardio', -- diagnostico
        'SI'                -- cirugias (SI o NO)
    )
    RETURNING id_historia
),

-- 4. Insertar la FACTURA (usando el id_historia generado)
factura_data AS (
    INSERT INTO factura (
        id_factura,
        id_historia,
        codigo_control,
        fecha_emision,
        titular,
        forma_pago,
        suministros_hospitalarios,
        servicios_cobrables,
        medicamentos,
        honorarios_medicos,
        tasa_dolar_bcv,
        estatus,
        motivo,
        plan_qx
    )
    VALUES (
        1001,               -- id_factura
        (SELECT id_historia FROM historia_data),
        'ABC123XYZ',        -- código_control
        '2024-01-16',       -- fecha_emision
        'María González',   -- titular
        'PARTICULAR',       -- forma_pago
        150.5000,           -- suministros_hospitalarios
        200.0000,           -- servicios_cobrables
        85.7500,            -- medicamentos
        300.0000,           -- honorarios_medicos
        36.5000,            -- tasa_dolar_bcv
        'PROCESADA',        -- estatus
        NULL,               -- motivo (NULL si está procesada)
        'Plan A'            -- plan_qx
    )
    RETURNING id_factura
)

-- Si todo salió bien, confirma la transacción
COMMIT;

-- Si algo falla, la transacción se revertirá automáticamente (no es necesario hacer ROLLBACK explícito)