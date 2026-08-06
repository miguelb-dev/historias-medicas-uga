-- Políticas públicas temporales para que funcione el CRUD


-- Para la tabla medico
CREATE POLICY "Acceso público total medico" ON medico
FOR ALL USING (true);

-- Para la tabla paciente
CREATE POLICY "Acceso público total paciente" ON paciente
FOR ALL USING (true);

-- Para la tabla historia
CREATE POLICY "Acceso público total historia" ON historia
FOR ALL USING (true);

-- Para la tabla empresa
CREATE POLICY "Acceso público total empresa" ON empresa
FOR ALL USING (true);

-- Para la tabla seguro
CREATE POLICY "Acceso público total seguro" ON seguro
FOR ALL USING (true);

-- Para la tabla factura
CREATE POLICY "Acceso público total factura" ON factura
FOR ALL USING (true);