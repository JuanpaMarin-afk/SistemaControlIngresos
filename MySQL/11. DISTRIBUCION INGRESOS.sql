/* SCRIPT PARA LA CREACIÓN DE PROCEDIMIENTOS PARA DISTRIBUCION DE INGRESOS */

USE SISTEMA_CONTROL_INGRESOS;

/* PROCEDIMIENTO PARA LISTAR TODOS LOS DISTRIBUCION DE INGRESOS */
DELIMITER //
CREATE PROCEDURE GetAllIncomes ()
BEGIN
    SELECT 
    IncomeID,
    EstimatedAmount,
    EstimatedAmountPerHour,
    DateMonth,
    Remarks,
    Status,
    ProjectID
    FROM IncomeDistribution;
END //
DELIMITER ;

/* PROCEDIMIENTO PARA LISTAR TODOS LOS DISTRIBUCION DE INGRESOS */
DELIMITER //
CREATE PROCEDURE AddIncome (
    IN _EstimatedAmount DECIMAL(10, 2),
    IN _EstimatedAmountPerHour DECIMAL(10, 2),
    IN _DateMonth DATE,
    IN _Remarks VARCHAR(255),
    IN _Status VARCHAR(255),
    IN _ProjectID INT
)
BEGIN
    INSERT INTO IncomeDistribution (EstimatedAmount, EstimatedAmountPerHour, DateMonth, Remarks, Status, ProjectID)
    VALUES (_EstimatedAmount, _EstimatedAmountPerHour, _DateMonth, _Remarks, _Status, _ProjectID);
END //
DELIMITER ;

/* PROCEDIMIENTO PARA LISTAR TODOS LOS DISTRIBUCION DE INGRESOS */
DELIMITER //
CREATE PROCEDURE UpdateIncome (
    IN _IncomeID INT,
    IN _EstimatedAmount DECIMAL(10, 2),
    IN _EstimatedAmountPerHour DECIMAL(10, 2),
    IN _DateMonth DATE,
    IN _Remarks VARCHAR(255),
    IN _Status VARCHAR(255),
    IN _ProjectID INT
)
BEGIN
    UPDATE IncomeDistribution
    SET EstimatedAmount = _EstimatedAmount,
        EstimatedAmountPerHour = _EstimatedAmountPerHour,
        DateMonth = _DateMonth,
        Remarks = _Remarks,
        Status = _Status,
        ProjectID = _ProjectID
    WHERE IncomeID = _IncomeID;
END //
DELIMITER ;

/* PROCEDIMIENTO PARA LISTAR TODOS LOS DISTRIBUCION DE INGRESOS */
DELIMITER //
CREATE PROCEDURE DeleteIncome (
    IN _IncomeID INT
)
BEGIN
    DELETE FROM IncomeDistribution WHERE IncomeID = _IncomeID;
END //
DELIMITER ;

/* MOSTRAR */
CALL GetAllIncomes();
CALL GetAllIncomesReport();

/* PROCEDIMIENTO PARA REPORT DE DISTRIBUCION DE INGRESOS */
DELIMITER //
CREATE PROCEDURE GetAllIncomesReport (
IN p_start_date DATE,
IN p_end_date DATE
)
BEGIN
    SELECT 
    IncomeID,
    EstimatedAmount,
    EstimatedAmountPerHour,
    DateMonth,
    Remarks,
    I.Status,
    I.ProjectID,
    P.ID_PROJECT,
	P.ID_CLIENT,
	C.NAME AS CLIENT_NAME,
    P.ID_ATTENDANT,
	A.NAME AS ATTENDANT_NAME,
	P.ID_TYPEWORK,
	TW.NAME AS TYPE_WORK_NAME,
	P.CONTRACT_MOUNT,
	P.TYPE_MOUNT,
	P.PROJECT_YEAR,
	P.AUDIT_YEAR,
	P.HOURS,
	P.PAYMENT_ESTIMATION,
	P.DATE_APROBATION,
	P.DATE_BEGIN,
	P.DATE_END,
	P.OFFICIAL_VISIT,
	P.NOTES
    FROM IncomeDistribution I
    LEFT JOIN 
        PROJECTS P ON I.ProjectID = P.ID_PROJECT
    LEFT JOIN 
        CLIENTS C ON P.ID_CLIENT = C.ID_CLIENT
    LEFT JOIN 
        ATTENDANT A ON P.ID_ATTENDANT = A.ID_ATTENDANT
    LEFT JOIN 
        TYPE_WORK TW ON P.ID_TYPEWORK = TW.ID_TYPE_WORK
	WHERE 
	-- Filtrar por el rango de fechas de earning
	(I.DateMonth BETWEEN p_start_date AND p_end_date);
END //
DELIMITER ;

/* PROCEDIMIENTO PARA UPDATE DE DISTRIBUCION DE INGRESOS */
DELIMITER //
CREATE PROCEDURE UpdateDateForUnpaidIncome()
BEGIN
    -- Actualizar la fecha de los registros con estado 'No Pagado'
    UPDATE IncomeDistribution
    SET DateMonth = DATE_ADD(DateMonth, INTERVAL 1 MONTH)
    WHERE Status = 'No Pagado';
END //

DELIMITER ;