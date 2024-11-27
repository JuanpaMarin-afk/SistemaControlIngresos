/* SCRIPT PARA LA CREACIÓN DE JOBS DE USERS */

USE SISTEMA_CONTROL_INGRESOS

/* JOB PARA EL SELECT DE UN USER AL SISTEMA */
DELIMITER //

CREATE PROCEDURE GetUsers()
BEGIN
    SELECT 
        ID_USER,
        EMAIL,
        CAST(AES_DECRYPT(ENCRYPTED_PASSWORD, 'Carvajal2024') AS CHAR) AS PASSWORD,
        JOB,
        ROL,
        STATUS
    FROM 
        USERS;
END //

DELIMITER ;


/* JOB PARA EL INSERT DE UN USER AL SISTEMA */
DELIMITER //

CREATE PROCEDURE InsertUser(
    IN p_Email VARCHAR(255),
    IN p_Password VARCHAR(255),
    IN p_Job TEXT,
    IN p_Rol VARCHAR(50)
)
BEGIN
        -- Insertar el nuevo registro con encriptación AES
        INSERT INTO USERS (EMAIL, ENCRYPTED_PASSWORD, JOB, ROL, STATUS)
        VALUES (
            p_Email, 
            AES_ENCRYPT(p_Password, 'Carvajal2024'), 
            p_Job, 
            p_Rol, 
            'Active'
        );
END //

DELIMITER ;

SELECT * FROM USERS;

CALL InsertUser('fcordero@carvajalcr.com', 'FabC24$Dic#2024!', 'Administrador del Sistema', 'Administrador');

/* JOB PARA LOGIN AL SISTEMA */
DELIMITER //

CREATE PROCEDURE VerifyUserPassword(
    IN p_Email VARCHAR(255),
    IN p_Password VARCHAR(255)
)
BEGIN
    DECLARE v_EncryptedPassword VARBINARY(4096);
    DECLARE v_DecryptedPassword VARCHAR(255);
    DECLARE v_ID_USER INT;
    DECLARE v_JOB VARCHAR(255);
    DECLARE v_ROL CHAR(50);
    DECLARE v_STATUS VARCHAR(50);

    -- Obtener la contraseña encriptada de la base de datos
    SELECT ENCRYPTED_PASSWORD INTO v_EncryptedPassword 
    FROM USERS 
    WHERE EMAIL = p_Email;

    IF v_EncryptedPassword IS NOT NULL THEN
        -- Desencriptar la contraseña
        SET v_DecryptedPassword = CONVERT(AES_DECRYPT(v_EncryptedPassword, 'Carvajal2024') USING utf8);

        -- Comparar las contraseñas
        IF v_DecryptedPassword = p_Password THEN
            -- Obtener otros detalles del usuario
            SELECT ID_USER, JOB, GENDER, STATUS 
            INTO v_ID_USER, v_JOB, v_ROL, v_STATUS
            FROM USERS 
            WHERE EMAIL = p_Email;

            -- Devolver los datos del usuario
            SELECT v_ID_USER AS ID_USER, p_Email AS EMAIL, "" AS PASSWORD, 
                   v_JOB AS JOB, v_ROL AS ROL, v_STATUS AS STATUS;
        END IF;
    END IF;
END //

DELIMITER ;


/* JOB PARA CAMBIAR EL STATUS DE USER AL SISTEMA */
DELIMITER //

CREATE PROCEDURE ToggleUserStatus(
    IN p_Id INT
)
BEGIN
    DECLARE v_CurrentStatus VARCHAR(50);

    -- Obtener el estado actual del usuario
    SELECT STATUS INTO v_CurrentStatus 
    FROM USERS 
    WHERE ID_USER = p_Id;

    -- Cambiar el estado según el estado actual
    IF v_CurrentStatus = 'Active' THEN
        UPDATE USERS
        SET STATUS = 'Disabled'
        WHERE ID_USER = p_Id;
    ELSEIF v_CurrentStatus = 'Disabled' THEN
        UPDATE USERS
        SET STATUS = 'Active'
        WHERE ID_USER = p_Id;
    END IF;
END //

DELIMITER ;


/* PROCEDIMIENTO PARA MODIFICAR USER */
DELIMITER //

CREATE PROCEDURE UpdateUser(
    IN p_Id INT,
    IN p_Email VARCHAR(255),
    IN p_Password VARCHAR(255),
    IN p_Job VARCHAR(50),
    IN p_Rol VARCHAR(50),
    IN p_Status VARCHAR(50)
)
BEGIN
        UPDATE USERS
        SET 
            EMAIL = p_Email,
            ENCRYPTED_PASSWORD = AES_ENCRYPT(p_Password, 'Carvajal2024'),
            JOB = p_Job,
            ROL = p_Rol,
            STATUS = p_Status
        WHERE ID_USER = p_Id;
END //

DELIMITER ;

