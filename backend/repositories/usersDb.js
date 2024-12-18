const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const bcrypt = require('bcrypt');

const filePath = './uploads/ava.png';

module.exports = {
  async findUserByLogin(login) {
    try {
      return await prisma.user.findUnique({
        where: {
          Login: login,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async findUserById(id) {
    try {
      return await prisma.user.findUnique({
        where: {
          ID: id,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async findAllUsers() {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      throw error;
    }
  },

  async createEmptyUser(login, password, name, surname) {
    try {
      return await prisma.user.create({
        data: {
          Login: login,
          Password: await bcrypt.hash(password, 10),
          Role: 0,
          Name: name,
          Surname: surname,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async createUser(login, password, role, name, surname, phoneNumber) {
    try {
      const user = await prisma.user.create({
        data: {
          Login: login,
          Password: await bcrypt.hash(password, 10),
          Role: role,
          Name: name,
          Surname: surname,
          PhoneNumber: phoneNumber,
          Photo: fs.existsSync(filePath) ? fs.readFileSync(filePath) : null,
        },
      });

      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return user;
    } catch (error) {
      throw error;
    }
  },

  async editUserByLogin(login, name, surname, phoneNumber) {
    const updateData = {
      Name: name,
      Surname: surname,
      PhoneNumber: phoneNumber,
    };

    // Обновляем фото только если файл существует
    if (fs.existsSync(filePath)) {
      updateData.Photo = fs.readFileSync(filePath);
    }

    await prisma.user.update({
      where: { Login: login },
      data: updateData,
    });

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  },

  async editUserById(id, login, password, role, name, surname, phoneNumber) {
    if (password === '') {
      if (fs.existsSync(filePath)) {
        await prisma.user.update({
          where: { ID: id },
          data: {
            Login: login,
            Name: name,
            Surname: surname,
            PhoneNumber: phoneNumber,
            Role: role,
            Photo: fs.readFileSync(filePath),
          },
        });
      } else {
        await prisma.user.update({
          where: { ID: id },
          data: {
            Login: login,
            Name: name,
            Surname: surname,
            PhoneNumber: phoneNumber,
            Role: role,
          },
        });
      }
    } else {
      if (fs.existsSync(filePath)) {
        await prisma.user.update({
          where: { ID: id },
          data: {
            Login: login,
            Name: name,
            Surname: surname,
            PhoneNumber: phoneNumber,
            Role: role,
            Password: await bcrypt.hash(password, 10),
            Photo: fs.readFileSync(filePath),
          },
        });
      } else {
        await prisma.user.update({
          where: { ID: id },
          data: {
            Login: login,
            Name: name,
            Surname: surname,
            PhoneNumber: phoneNumber,
            Role: role,
            Password: await bcrypt.hash(password, 10),
          },
        });
      }
    }

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  },

  async deleteUserById(id) {
    try {
      await prisma.rental.deleteMany({
        where: {
          ID_tenant: parseInt(id),
        },
      });

      const premises = await prisma.premise.findMany({
        where: {
          ID_owner: parseInt(id),
        },
      });
      await Promise.all(
        premises.map(async (premise) => {
          await prisma.rental.deleteMany({
            where: {
              ID_premise: premise.ID,
            },
          });

          await prisma.descriptionCharacteristic.deleteMany({
            where: {
              ID_premise: premise.ID,
            },
          });
        })
      );

      await prisma.premise.deleteMany({
        where: {
          ID_owner: parseInt(id),
        },
      });

      await prisma.user.delete({
        where: {
          ID: parseInt(id),
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
