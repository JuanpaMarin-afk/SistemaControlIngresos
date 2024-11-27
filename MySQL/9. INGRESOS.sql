/* SCRIPT PARA LA CREACIÓN DE PROCEDIMIENTOS PARA Ingresos */

USE SISTEMA_CONTROL_INGRESOS;


/* PROCEDIMIENTO PARA LISTAR TODOS LOS Ingresos */
DELIMITER $$

CREATE PROCEDURE GetEarnings()
BEGIN
	SELECT 
    ID_EARNING,
	ID_TRANSACTION,
    TYPE_MOUNT,
	DOLAR_VALUE,
	EARNING_MOUNT,
	DATE_EARNING
    FROM EARNINGS;
END$$

DELIMITER ;

/* PROCEDIMIENTO PARA LISTAR Ingresos POR ID */
DELIMITER $$

CREATE PROCEDURE GetEarningById(
    IN p_id_earning INT
)
BEGIN
    SELECT 
    ID_EARNING,
	ID_TRANSACTION,
    TYPE_MOUNT,
	DOLAR_VALUE,
	EARNING_MOUNT,
	DATE_EARNING
    FROM EARNINGS 
    WHERE ID_EARNING = p_id_earning;
END$$

DELIMITER ;

/* PROCEDIMIENTO PARA INSERTAR Ingresos */
DELIMITER $$

CREATE PROCEDURE InsertEarning(
    IN p_id_transaction INT,
    IN p_type_mount VARCHAR(50),
    IN p_dolar_value DECIMAL(10, 3),
    IN p_earning_mount DECIMAL(18, 3),
    IN p_date_earning DATE
)
BEGIN
    INSERT INTO EARNINGS(
        ID_TRANSACTION, TYPE_MOUNT, DOLAR_VALUE, EARNING_MOUNT, DATE_EARNING
    )
    VALUES (
        p_id_transaction, p_type_mount, p_dolar_value, p_earning_mount, p_date_earning
    );
END$$

DELIMITER ;


/* PROCEDIMIENTO PARA ACTUALIZAR Ingresos */
DELIMITER $$

CREATE PROCEDURE UpdateEarning(
    IN p_id_earning INT,
    IN p_id_transaction INT,
    IN p_type_mount VARCHAR(50),
    IN p_dolar_value DECIMAL(10, 3),
    IN p_earning_mount DECIMAL(18, 3),
    IN p_date_earning DATE
)
BEGIN
    UPDATE EARNINGS
    SET 
        ID_TRANSACTION = p_id_transaction,
        TYPE_MOUNT = p_type_mount,
        DOLAR_VALUE = p_dolar_value,
        EARNING_MOUNT = p_earning_mount,
        DATE_EARNING = p_date_earning
    WHERE ID_EARNING = p_id_earning;
END$$

DELIMITER ;

/* PROCEDIMIENTO PARA ELIMINAR Ingresos */
DELIMITER $$

CREATE PROCEDURE DeleteEarning(
    IN p_id_earning INT
)
BEGIN
	DELETE FROM EARNINGS
    WHERE ID_EARNING = p_id_earning;
END$$

DELIMITER ;




