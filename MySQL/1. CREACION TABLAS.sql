/* SCRIPT PARA LA CREACIÓN DE TABLAS */

/* BASE DE DATOS */
CREATE DATABASE SISTEMA_CONTROL_INGRESOS;

USE SISTEMA_CONTROL_INGRESOS;

/* TABLA PARA EL LOGIN DEL SISTEMA */

/* Carvajal2024 */

CREATE TABLE USERS(
    ID_USER INT AUTO_INCREMENT PRIMARY KEY,
    EMAIL VARCHAR(255),
    ENCRYPTED_PASSWORD VARBINARY(4096),
    JOB VARCHAR(255),
    ROL VARCHAR(50),
    STATUS VARCHAR(50)
);

/* TABLA PARA TIPO DE TRABAJO */
CREATE TABLE TYPE_WORK(
    ID_TYPE_WORK INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(255),
    STATUS VARCHAR(50)
);

/* TABLA PARA BITACORAS */
CREATE TABLE LOGS(
    ID_LOGS INT AUTO_INCREMENT PRIMARY KEY,
    DESCRIPTION VARCHAR(255),
    USER VARCHAR(255),
    DATE VARCHAR(255)
);

/* TABLA PARA TIPOS DE CLIENTES */
CREATE TABLE TYPE(
    ID_TYPE INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(255),
    STATUS VARCHAR(50)
);

/* TABLA PARA LOS CLIENTES */ 
CREATE TABLE CLIENTS(
    ID_CLIENT INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(255),
    SECTOR VARCHAR(255), 
    LEGAL_ID VARCHAR(50), -- CEDULA JURÍDICA
    ID_TYPE INT,
    STATUS VARCHAR(50),
    FOREIGN KEY (ID_TYPE) REFERENCES TYPE(ID_TYPE)
);

/* TABLA DE ENCARGADOS */
CREATE TABLE ATTENDANT(
    ID_ATTENDANT INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(255),
    STATUS VARCHAR(50)
);

/* TABLA PARA LOS PROYECTOS */
CREATE TABLE PROJECTS(
    ID_PROJECT INT AUTO_INCREMENT PRIMARY KEY,
    ID_CLIENT INT, -- CLIENTE
    ID_ATTENDANT INT, -- PERSONAL DEL PROYECTO
    ID_TYPEWORK INT, -- TIPO DE TRABAJO
    CONTRACT_MOUNT DECIMAL(18, 3), -- MONTO DE CONTRATO
    TYPE_MOUNT VARCHAR(50), -- DOLAR$ O COLON₡ 
    PROJECT_YEAR VARCHAR(50), -- AÑO EFECTUADO EL PROYECTO
    AUDIT_YEAR VARCHAR(50), -- AÑO AUDITADO
    HOURS VARCHAR(50), -- HORAS PROGRAMADAS
    PAYMENT_ESTIMATION DATE, -- FECHA ESTIMADA DE PAGO
    DATE_APROBATION DATE, -- FECHA DE APROBACION
    DATE_BEGIN DATE,
    DATE_END DATE,
    OFFICIAL_VISIT VARCHAR(255),
    NOTES VARCHAR(255),
    PROJECT_NUMBER INT, -- NÚMERO DE PROYECTO DENTRO DEL AÑO, ESTE VALOR SE VA A REINICIAR CUANDO SE PASE DE AÑO
    FOREIGN KEY (ID_CLIENT) REFERENCES CLIENTS(ID_CLIENT),
    FOREIGN KEY (ID_ATTENDANT) REFERENCES ATTENDANT(ID_ATTENDANT),
    FOREIGN KEY (ID_TYPEWORK) REFERENCES TYPE_WORK(ID_TYPE_WORK)
);
  
/* TABLA DE INGRESOS */
CREATE TABLE EARNINGS(
	ID_EARNING INT AUTO_INCREMENT PRIMARY KEY,
	ID_TRANSACTION INT,
    TYPE_MOUNT VARCHAR(50), -- DOLAR$ O COLON₡ 
    DOLAR_VALUE DECIMAL(10, 3), -- VALOR DOLAR 
    EARNING_MOUNT DECIMAL(18, 3), -- MONTO DE PAGO
    DATE_EARNING DATE, -- FECHA DE INGRESO
	FOREIGN KEY (ID_TRANSACTION) REFERENCES PROJECTS(ID_PROJECT)
);

/* TABLA DE DISTRIBUCION DE INGRESOS */
CREATE TABLE IncomeDistribution (
    IncomeID INT AUTO_INCREMENT PRIMARY KEY,
    EstimatedAmount DECIMAL(10, 2),
    EstimatedAmountPerHour DECIMAL(10, 2),
    DateMonth DATE,
    Remarks VARCHAR(255),
    Status VARCHAR(25),
    ProjectID INT,
    FOREIGN KEY (ProjectID) REFERENCES Projects(ID_Project)
);