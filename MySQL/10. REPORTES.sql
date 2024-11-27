USE SISTEMA_CONTROL_INGRESOS;


-- Reporte de Proyectos Fechas
DELIMITER $$

CREATE PROCEDURE ReportGetProjectReportByMonth(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        P.ID_PROJECT,
        P.CONTRACT_MOUNT,
        P.DATE_APROBATION,
        P.TYPE_MOUNT,
        P.DATE_BEGIN,
        P.DATE_END,
        TW.NAME AS TYPE_WORK_NAME,  -- Nombre del tipo de trabajo
        C.NAME AS CLIENT_NAME,      -- Nombre del cliente
        SUM(E.EARNING_MOUNT) AS TOTAL_EARNINGS,  -- Sumar todos los ingresos para un proyecto
        MAX(E.DATE_EARNING) AS DATE_EARNING,     -- Obtener la última fecha de earning registrada
        CASE 
            -- Si la suma de ingresos es mayor o igual al monto del contrato, es "Facturado"
            WHEN SUM(E.EARNING_MOUNT) >= P.CONTRACT_MOUNT THEN 'Facturado'
            ELSE 'No Facturado'
        END AS PAGADO
    FROM 
        PROJECTS P
    LEFT JOIN 
        EARNINGS E ON P.ID_PROJECT = E.ID_TRANSACTION
    JOIN 
        TYPE_WORK TW ON P.ID_TYPEWORK = TW.ID_TYPE_WORK  -- Relación con tipo de trabajo
    JOIN 
        CLIENTS C ON P.ID_CLIENT = C.ID_CLIENT  -- Relación con cliente
    WHERE 
        -- Filtrar por el rango de fechas de earning
        (E.DATE_EARNING BETWEEN p_start_date AND p_end_date)
        -- Incluir proyectos sin ingresos pero que fueron iniciados dentro del rango
        OR (E.DATE_EARNING IS NULL AND P.DATE_BEGIN BETWEEN p_start_date AND p_end_date)
    GROUP BY 
        P.ID_PROJECT, P.CONTRACT_MOUNT, P.TYPE_MOUNT, P.DATE_BEGIN, P.DATE_END;
END$$

DELIMITER ;

--  Reporte de Proyectos por Facturado o No Facturado y Fechas
DELIMITER $$

CREATE PROCEDURE ReportGetProjectReportByStatus(
    IN p_is_facturado BOOLEAN,
    IN p_year INT
)
BEGIN
    SELECT 
     P.ID_PROJECT,
	 P.CONTRACT_MOUNT,
	 P.TYPE_MOUNT,
	 P.DATE_APROBATION,
	 P.DATE_BEGIN,
	 P.DATE_END,
	 TW.NAME AS TYPE_WORK_NAME,  -- Nombre del tipo de trabajo
     C.NAME AS CLIENT_NAME,      -- Nombre del cliente
    SUM(E.EARNING_MOUNT) AS TOTAL_EARNINGS,  -- Sumar todos los earnings para un proyecto
    MAX(E.DATE_EARNING) AS DATE_EARNING, 
    CASE 
        -- Si la suma de ingresos es mayor o igual al monto del contrato, es "Facturado"
        WHEN SUM(E.EARNING_MOUNT) >= P.CONTRACT_MOUNT THEN 'Facturado'
        ELSE 'No Facturado'
    END AS PAGADO
	FROM 
		PROJECTS P
	LEFT JOIN 
		EARNINGS E ON P.ID_PROJECT = E.ID_TRANSACTION
    JOIN 
        TYPE_WORK TW ON P.ID_TYPEWORK = TW.ID_TYPE_WORK  -- Relación con tipo de trabajo
    JOIN 
        CLIENTS C ON P.ID_CLIENT = C.ID_CLIENT  -- Relación con cliente
	WHERE 
		P.PROJECT_YEAR = p_year  -- Filtrar por el año dado
	GROUP BY 
		P.ID_PROJECT, P.CONTRACT_MOUNT, P.DATE_BEGIN
	HAVING 
		-- Para proyectos no facturados, incluir los que no tienen ingresos o tienen menos ingresos que el contrato
		((SUM(E.EARNING_MOUNT) IS NULL OR SUM(E.EARNING_MOUNT) < P.CONTRACT_MOUNT) AND p_is_facturado = FALSE)
		-- Para proyectos facturados, incluir solo aquellos con ingresos mayores o iguales al contrato
		OR (SUM(E.EARNING_MOUNT) >= P.CONTRACT_MOUNT AND p_is_facturado = TRUE);
END$$

DELIMITER ;


-- Reporte Control: Sumatoria de Ingresos por Mes menos Monto Cobrado: 
DELIMITER $$

CREATE PROCEDURE ReportGetTotalEarningsMinusAmount(
	IN p_year INT,
    IN p_client_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        SUM(P.CONTRACT_MOUNT) AS Total_Ingresos,  -- Sumar los ingresos totales
        SUM(CASE 
                WHEN E.EARNING_MOUNT IS NOT NULL THEN P.CONTRACT_MOUNT - E.EARNING_MOUNT  -- Proyectos con ingresos
                ELSE P.CONTRACT_MOUNT  -- Proyectos sin ingresos
            END)  AS Monto_Faltante  -- Total faltante para proyectos sin ingresos
    FROM 
        PROJECTS P
    LEFT JOIN 
        EARNINGS E ON P.ID_PROJECT = E.ID_TRANSACTION
    WHERE 
        YEAR(P.DATE_BEGIN) = p_year  -- Filtrar por el año del proyecto
        AND P.ID_CLIENT = p_client_id  -- Filtrar por el ID del cliente
        AND (E.DATE_EARNING BETWEEN p_start_date AND p_end_date OR E.DATE_EARNING IS NULL);  -- Filtrar por el rango de fechas en ingresos
END$$

DELIMITER ;

-- Reporte Control: Sumatoria de Ingresos por Mes menos Monto Cobrado de Todos Los Clientes: 
DELIMITER $$

CREATE PROCEDURE ReportGetControlClients(
	IN p_year INT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        C.NAME,  -- Nombre del cliente
        SUM(P.CONTRACT_MOUNT) AS Total_Ingresos,  -- Sumar los ingresos totales
        SUM(CASE 
                WHEN E.EARNING_MOUNT IS NOT NULL THEN P.CONTRACT_MOUNT - E.EARNING_MOUNT  -- Proyectos con ingresos
                ELSE P.CONTRACT_MOUNT  -- Proyectos sin ingresos
            END) AS Monto_Faltante  -- Total faltante para proyectos sin ingresos
    FROM 
        PROJECTS P
    LEFT JOIN 
        EARNINGS E ON P.ID_PROJECT = E.ID_TRANSACTION
    LEFT JOIN 
        CLIENTS C ON P.ID_CLIENT = C.ID_CLIENT  -- Relacionar con la tabla de clientes para obtener el nombre
    WHERE 
        YEAR(P.DATE_BEGIN) = p_year  -- Filtrar por el año del proyecto
        AND (E.DATE_EARNING BETWEEN p_start_date AND p_end_date OR E.DATE_EARNING IS NULL)  -- Filtrar por el rango de fechas en ingresos
    GROUP BY 
        C.NAME;  -- Agrupar por nombre del cliente
END$$

DELIMITER ;

-- REPORTE DE INGRESOS EN COLONES
DELIMITER $$

CREATE PROCEDURE ReportGetEarningsInColones(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        SUM(E.EARNING_MOUNT) AS Total_Ingresos_Colones
    FROM 
        EARNINGS E
    WHERE 
        E.TYPE_MOUNT = 'CRC' 
        AND E.DATE_EARNING BETWEEN p_start_date AND p_end_date;
END$$

DELIMITER ;

-- REPORTE DE INGRESOS EN Dólares
DELIMITER $$

CREATE PROCEDURE ReportGetEarningsInDollars(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        SUM(E.EARNING_MOUNT) AS Total_Ingresos_Dolares
    FROM 
        EARNINGS E
    WHERE 
        E.TYPE_MOUNT = 'USD' 
        AND E.DATE_EARNING BETWEEN p_start_date AND p_end_date;
END$$

DELIMITER ;


-- REPORTE DE INGRESOS CONSOLIDADO A DOLARES
DELIMITER $$

CREATE PROCEDURE ReportGetConsolidatedEarningsInColones(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        SUM(CASE 
                WHEN E.TYPE_MOUNT = 'USD' THEN E.EARNING_MOUNT * E.DOLAR_VALUE 
                ELSE E.EARNING_MOUNT
            END) AS Total_Ingresos_Consolidados_Colones
    FROM 
        EARNINGS E
    WHERE 
        E.DATE_EARNING BETWEEN p_start_date AND p_end_date;
END$$

DELIMITER ;


-- Reporte de Proyectos por Tipo de trabajo y Fechas
DELIMITER $$

CREATE PROCEDURE ReportGetProjectReportByTypeWorkAndClient(
    IN p_type_work_id INT,  -- ID del tipo de trabajo
    IN p_client_id INT,     -- ID del cliente
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT 
        P.ID_PROJECT,
        P.CONTRACT_MOUNT,
        P.DATE_APROBATION,
        P.TYPE_MOUNT,
        P.DATE_BEGIN,
        P.DATE_END,
        TW.NAME AS TYPE_WORK_NAME,  -- Nombre del tipo de trabajo
        C.NAME AS CLIENT_NAME,      -- Nombre del cliente
        SUM(E.EARNING_MOUNT) AS TOTAL_EARNINGS,  -- Sumar todos los ingresos para un proyecto
        MAX(E.DATE_EARNING) AS DATE_EARNING,     -- Obtener la última fecha de earning registrada
        CASE 
            -- Si la suma de ingresos es mayor o igual al monto del contrato, es "Facturado"
            WHEN SUM(E.EARNING_MOUNT) >= P.CONTRACT_MOUNT THEN 'Facturado'
            ELSE 'No Facturado'
        END AS PAGADO
    FROM 
        PROJECTS P
    LEFT JOIN 
        EARNINGS E ON P.ID_PROJECT = E.ID_TRANSACTION
    JOIN 
        TYPE_WORK TW ON P.ID_TYPEWORK = TW.ID_TYPE_WORK  -- Relación con tipo de trabajo
    JOIN 
        CLIENTS C ON P.ID_CLIENT = C.ID_CLIENT  -- Relación con cliente
    WHERE 
        P.ID_TYPEWORK = p_type_work_id   -- Filtrar por tipo de trabajo
        AND P.ID_CLIENT = p_client_id    -- Filtrar por cliente
        -- Filtrar por el rango de fechas de ingresos o proyectos iniciados en ese rango
        AND (
            (E.DATE_EARNING BETWEEN p_start_date AND p_end_date)  -- Proyectos con ingresos en el rango de fechas
            OR (E.DATE_EARNING IS NULL AND P.DATE_BEGIN BETWEEN p_start_date AND p_end_date)  -- Proyectos sin ingresos pero iniciados en el rango
        )
    GROUP BY 
        P.ID_PROJECT, P.CONTRACT_MOUNT, P.TYPE_MOUNT, P.DATE_BEGIN, P.DATE_END, TW.NAME, C.NAME;
END$$

DELIMITER ;

-- Reporte de Proyectos por Sector y Fechas
DELIMITER $$

CREATE PROCEDURE ReportGetProjectReportByTypeSector(
    IN p_type_sector VARCHAR(50),  -- ID del tipo de trabajo
    IN p_start_date DATE,
    IN p_end_date DATE  
)
BEGIN
    SELECT 
        P.ID_PROJECT,
        P.CONTRACT_MOUNT,
        P.DATE_APROBATION,
        P.TYPE_MOUNT,
        P.DATE_BEGIN,
        P.DATE_END,
        TW.NAME AS TYPE_WORK_NAME,  -- Nombre del tipo de trabajo
        C.NAME AS CLIENT_NAME,      -- Nombre del cliente
        SUM(E.EARNING_MOUNT) AS TOTAL_EARNINGS,  -- Sumar todos los ingresos para un proyecto
        MAX(E.DATE_EARNING) AS DATE_EARNING,     -- Obtener la última fecha de earning registrada
        CASE 
            -- Si la suma de ingresos es mayor o igual al monto del contrato, es "Facturado"
            WHEN SUM(E.EARNING_MOUNT) >= P.CONTRACT_MOUNT THEN 'Facturado'
            ELSE 'No Facturado'
        END AS PAGADO
    FROM 
        PROJECTS P
    LEFT JOIN 
        EARNINGS E ON P.ID_PROJECT = E.ID_TRANSACTION
    JOIN 
        TYPE_WORK TW ON P.ID_TYPEWORK = TW.ID_TYPE_WORK  -- Relación con tipo de trabajo
    JOIN 
        CLIENTS C ON P.ID_CLIENT = C.ID_CLIENT  -- Relación con cliente
    WHERE 
        C.SECTOR = p_type_sector  -- Filtrar por el sector del tipo de trabajo
        -- Filtrar por el rango de fechas de ingresos o proyectos iniciados en ese rango
        AND (
            (E.DATE_EARNING BETWEEN p_start_date AND p_end_date)  -- Proyectos con ingresos en el rango de fechas
            OR (E.DATE_EARNING IS NULL AND P.DATE_BEGIN BETWEEN p_start_date AND p_end_date)  -- Proyectos sin ingresos pero iniciados en el rango
        )
    GROUP BY 
        P.ID_PROJECT, P.CONTRACT_MOUNT, P.TYPE_MOUNT, P.DATE_BEGIN, P.DATE_END, TW.NAME, C.NAME;
END$$

DELIMITER ;
