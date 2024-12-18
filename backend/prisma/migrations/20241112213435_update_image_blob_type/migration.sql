-- CreateTable
CREATE TABLE `Users` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Login` VARCHAR(255) NOT NULL,
    `Password` VARCHAR(255) NOT NULL,
    `Role` INTEGER NULL DEFAULT 0,
    `Name` VARCHAR(255) NULL,
    `Surname` VARCHAR(255) NULL,
    `PhoneNumber` VARCHAR(255) NULL,
    `Photo` BLOB NULL,

    UNIQUE INDEX `Login`(`Login`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TypePremises` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Name`(`Name`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Premise` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_type` INTEGER NOT NULL,
    `ID_owner` INTEGER NOT NULL,
    `Name` VARCHAR(255) NOT NULL,
    `Image` MEDIUMBLOB NULL,
    `Price` FLOAT NOT NULL,
    `Address` VARCHAR(255) NOT NULL,

    INDEX `ID_owner`(`ID_owner`),
    INDEX `ID_type`(`ID_type`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rental` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_premise` INTEGER NOT NULL,
    `ID_tenant` INTEGER NOT NULL,
    `Status` INTEGER NULL DEFAULT 0,
    `StartDate` DATETIME(0) NULL,

    INDEX `ID_premise`(`ID_premise`),
    INDEX `ID_tenant`(`ID_tenant`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Characteristic` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Name`(`Name`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DescriptionCharacteristic` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `ID_characteristic` INTEGER NOT NULL,
    `ID_premise` INTEGER NOT NULL,
    `Description` TEXT NOT NULL,

    INDEX `ID_characteristic`(`ID_characteristic`),
    INDEX `ID_premise`(`ID_premise`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Characteristic_TypepPemises` (
    `TypePremisesID` INTEGER NOT NULL,
    `CharacteristicID` INTEGER NOT NULL,

    INDEX `CharacteristicID`(`CharacteristicID`),
    PRIMARY KEY (`TypePremisesID`, `CharacteristicID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Premise` ADD CONSTRAINT `premise_ibfk_1` FOREIGN KEY (`ID_type`) REFERENCES `TypePremises`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Premise` ADD CONSTRAINT `premise_ibfk_2` FOREIGN KEY (`ID_owner`) REFERENCES `Users`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `rental_ibfk_1` FOREIGN KEY (`ID_premise`) REFERENCES `Premise`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `rental_ibfk_2` FOREIGN KEY (`ID_tenant`) REFERENCES `Users`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DescriptionCharacteristic` ADD CONSTRAINT `descriptioncharacteristic_ibfk_1` FOREIGN KEY (`ID_characteristic`) REFERENCES `Characteristic`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `DescriptionCharacteristic` ADD CONSTRAINT `descriptioncharacteristic_ibfk_2` FOREIGN KEY (`ID_premise`) REFERENCES `Premise`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `_Characteristic_TypepPemises` ADD CONSTRAINT `_characteristic_typeppemises_ibfk_1` FOREIGN KEY (`TypePremisesID`) REFERENCES `TypePremises`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `_Characteristic_TypepPemises` ADD CONSTRAINT `_characteristic_typeppemises_ibfk_2` FOREIGN KEY (`CharacteristicID`) REFERENCES `Characteristic`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
