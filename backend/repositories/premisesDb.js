const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

const filePath = './uploads/premise.png';

async function addCharacteristicsToPremise(premise, descriptions) {
  try {
    const promises = JSON.parse(descriptions).map(async (description) => {
      if (description.des === '') return;
      try {
        const characteristic = await prisma.characteristic.findUnique({
          where: {
            Name: description.char,
          },
          select: {
            ID: true, // Выбрать только ID
          },
        });
        // Создаем новый объект DescriptionCharacteristic
        const newDescriptionCharacteristics =
          await prisma.descriptionCharacteristic.create({
            data: {
              ID_premise: premise.ID,
              ID_characteristic: parseInt(characteristic.ID),
              Description: description.des,
            },
          });
        return newDescriptionCharacteristics; // Возвращаем созданный объект DescriptionCharacteristic
      } catch (error) {
        console.error('Ошибка при создании DescriptionCharacteristic:', error);
        throw error; // Пробрасываем ошибку вверх, чтобы ее можно было обработать
      }
    });

    // Дожидаемся завершения всех операций создания DescriptionCharacteristic
    await Promise.all(promises);
  } catch (error) {
    throw error;
  }
}

module.exports = {
  async findNotRentedPremises() {
    try {
      return await prisma.premise.findMany({
        where: {
          OR: [
            {
              RentalRef: {
                none: {}, // Проверяем, нет ли у помещения аренды
              },
            },
            {
              RentalRef: {
                some: {
                  Status: 0, // Проверяем, есть ли у помещения аренды со статусом 0
                },
              },
            },
          ],
        },
        include: {
          DescriptionCharacteristicRef: {
            include: {
              Characteristic: {
                select: {
                  Name: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async findNotRentedPremisesByType(typeId) {
    try {
      return await prisma.premise.findMany({
        where: {
          ID_type: typeId,
          OR: [
            {
              RentalRef: {
                none: {}, // Проверяем, нет ли у помещения аренды
              },
            },
            {
              RentalRef: {
                some: {
                  Status: 0, // Проверяем, есть ли у помещения аренды со статусом 0
                },
              },
            },
          ],
        },
        include: {
          DescriptionCharacteristicRef: {
            include: {
              Characteristic: {
                select: {
                  Name: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async findPremisesByOwner(ownerId) {
    try {
      return await prisma.premise.findMany({
        where: {
          ID_owner: ownerId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async findRentedPremisesByOwner(ownerId) {
    try {
      return await prisma.premise.findMany({
        where: {
          ID_owner: parseInt(userData.id), // Замените ownerId на ваш ID владельца
          RentalRef: {
            some: {
              Status: 1, // Фильтр по статусу аренды
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async findPremiseById(premiseId) {
    try {
      return await prisma.premise.findUnique({
        where: {
          ID: premiseId,
        },
        include: {
          DescriptionCharacteristicRef: {
            include: {
              Characteristic: {
                select: {
                  Name: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async findPremisesByIdAndOwner(premiseId, ownerId) {
    try {
      return await prisma.premise.findUnique({
        where: {
          ID: premiseId,
          ID_owner: ownerId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async createPremise(name, price, adress, typeId, ownerId, descriptions) {
    try {
      const newPremise = await prisma.premise.create({
        data: {
          ID_type: typeId,
          ID_owner: ownerId,
          Name: name,
          Image: fs.existsSync(filePath) ? fs.readFileSync(filePath) : null,
          Price: price,
          Address: adress,
        },
      });

      await addCharacteristicsToPremise(newPremise, descriptions);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (error) {
      throw error;
    }
  },

  async editPremiseById(premiseId, name, price, adress, typeId, descriptions) {
    try {
      // Удаляем старые характеристики
      await prisma.descriptionCharacteristic.deleteMany({
        where: {
          ID_premise: premiseId,
        },
      });

      // Проверяем наличие файла изображения
      let imageData = null;
      if (fs.existsSync(filePath)) {
        imageData = fs.readFileSync(filePath);
      }

      // Обновляем помещение
      const editedPremise = await prisma.premise.update({
        where: {
          ID: premiseId,
        },
        data: {
          ID_type: typeId,
          Name: name,
          Image: imageData !== null ? imageData : undefined, // Не обновляем, если imageData === null
          Price: price,
          Address: adress,
        },
      });

      // Добавляем характеристики
      await addCharacteristicsToPremise(editedPremise, descriptions);

      // Удаляем файл, если он был прочитан
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      throw error;
    }
  },

  async deletePremiseById(premiseId) {
    try {
      // Удаление связанных записей из DescriptionCharacteristic
      await prisma.descriptionCharacteristic.deleteMany({
        where: {
          ID_premise: premiseId,
        },
      });

      // Удаление связанных записей из Rental
      await prisma.rental.deleteMany({
        where: {
          ID_premise: premiseId,
        },
      });

      // Удаление записи о помещении из Premise
      await prisma.premise.delete({
        where: {
          ID: premiseId,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
