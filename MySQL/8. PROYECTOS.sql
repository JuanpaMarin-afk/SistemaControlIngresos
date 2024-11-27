/* SCRIPT PARA LA CREACIÓN DE PROCEDIMIENTOS PARA PROJECT */

USE SISTEMA_CONTROL_INGRESOS;

/* PROCEDIMIENTO PARA LISTAR TODOS LOS ATTENDANT */
DELIMITER $$

CREATE PROCEDURE GetProjects()
BEGIN
    SELECT 
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
        P.NOTES,
        P.PROJECT_NUMBER
    FROM 
        PROJECTS P
    LEFT JOIN 
        CLIENTS C ON P.ID_CLIENT = C.ID_CLIENT
    LEFT JOIN 
        ATTENDANT A ON P.ID_ATTENDANT = A.ID_ATTENDANT
    LEFT JOIN 
        TYPE_WORK TW ON P.ID_TYPEWORK = TW.ID_TYPE_WORK;
END$$

DELIMITER ;

-- /* PROCEDIMIENTO PARA LISTAR ATTENDANT POR ID */
DELIMITER $$

CREATE PROCEDURE GetProjectById(
    IN p_id_project INT
)
BEGIN
    SELECT 
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
        P.DATE_BEGIN,
        P.DATE_END,
        P.OFFICIAL_VISIT,
        P.PROJECT_NUMBER
    FROM 
        PROJECTS P
    LEFT JOIN 
        CLIENTS C ON P.ID_CLIENT = C.ID_CLIENT
    LEFT JOIN 
        ATTENDANT A ON P.ID_ATTENDANT = A.ID_ATTENDANT
    LEFT JOIN 
        TYPE_WORK TW ON P.ID_TYPEWORK = TW.ID_TYPE_WORK
    WHERE ID_PROJECT = p_id_project;
END$$

DELIMITER ;

/* PROCEDIMIENTO PARA INSERTAR PROYECTO */
DELIMITER $$

CREATE PROCEDURE InsertProject(
    IN p_id_client INT,
    IN p_id_attendant INT,
    IN p_id_typework INT,
    IN p_contract_mount DECIMAL(18, 3),
    IN p_type_mount VARCHAR(50),
    IN p_project_year VARCHAR(50),
    IN p_audit_year VARCHAR(50),
    IN p_hours VARCHAR(50),
    IN p_payment_estimation VARCHAR(50),
    IN p_date_aprobation DATE,
    IN p_date_begin DATE,
    IN p_date_end DATE,
    IN p_official_visit VARCHAR(255),
    IN p_notes VARCHAR(255)
)
BEGIN
    INSERT INTO PROJECTS(
        ID_CLIENT, ID_ATTENDANT, ID_TYPEWORK, CONTRACT_MOUNT, TYPE_MOUNT, PROJECT_YEAR, AUDIT_YEAR, HOURS, PAYMENT_ESTIMATION,DATE_APROBATION, DATE_BEGIN, DATE_END, OFFICIAL_VISIT, NOTES
    )
    VALUES (
        p_id_client, p_id_attendant, p_id_typework, p_contract_mount, p_type_mount, p_project_year, p_audit_year, p_hours, p_payment_estimation, p_payment_estimation, p_date_begin, p_date_end, p_official_visit, p_notes
    );
END$$

DELIMITER ;

/* PROCEDIMIENTO PARA ACTUALIZAR PROYECTO */

DELIMITER $$

CREATE PROCEDURE UpdateProject(
    IN p_id_project INT,
    IN p_id_client INT,
    IN p_id_attendant INT,
    IN p_id_typework INT,
    IN p_contract_mount DECIMAL(18, 3),
    IN p_type_mount VARCHAR(50),
    IN p_project_year VARCHAR(50),
    IN p_audit_year VARCHAR(50),
    IN p_hours VARCHAR(50),
    IN p_payment_estimation VARCHAR(50),
    IN p_date_aprobation DATE,
    IN p_date_begin DATE,
    IN p_date_end DATE,
    IN p_official_visit VARCHAR(255),
    IN p_notes VARCHAR(255)
)
BEGIN
    UPDATE PROJECTS
    SET 
        ID_CLIENT = p_id_client,
        ID_ATTENDANT = p_id_attendant,
        ID_TYPEWORK = p_id_typework,
        CONTRACT_MOUNT = p_contract_mount,
        TYPE_MOUNT = p_type_mount,
        PROJECT_YEAR = p_project_year,
        AUDIT_YEAR = p_audit_year,
        HOURS = p_hours,
        PAYMENT_ESTIMATION = p_payment_estimation,
        DATE_APROBATION = p_date_aprobation,
        DATE_BEGIN = p_date_begin,
        DATE_END = p_date_end,
        OFFICIAL_VISIT = p_official_visit,
        NOTES = p_notes
    WHERE ID_PROJECT = p_id_project;
END$$

DELIMITER ;
