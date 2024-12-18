const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async findRentalsWithPremiseByTenant(tenantId, status = 1) {
    try {
      return await prisma.rental.findMany({
        where: {
          ID_tenant: tenantId,
          Status: status,
        },
        include: {
          Premise: true,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async findRentalsWithPremiseByOwner(ownerId, status = 1) {
    try {
      return await prisma.rental.findMany({
        where: {
          Status: status,
          Premise: {
            ID_owner: ownerId,
          },
        },
        include: {
          Premise: true,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async findRentalsWithPremiseAndTenantByOwner(ownerId, status = 1) {
    try {
      return await prisma.rental.findMany({
        where: {
          Status: status,
          Premise: {
            ID_owner: ownerId,
          },
        },
        include: {
          Premise: true,
          Tenant: true,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async findRentalsByPremiseAndTenant(premiseId, tenantId) {
    try {
      return await prisma.rental.findMany({
        where: {
          ID_premise: premiseId,
          ID_tenant: tenantId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async createRental(premiseId, tenantId) {
    try {
      return await prisma.rental.create({
        data: {
          ID_premise: premiseId,
          ID_tenant: tenantId,
          Status: 0,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async changeRentalStatusToAccepted(rentalId) {
    try {
      return await prisma.rental.update({
        where: {
          ID: rentalId,
        },
        data: {
          Status: 1,
          StartDate: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteRentalsByPremiseAndTenant(premiseId, tenantId) {
    try {
      await prisma.rental.deleteMany({
        where: {
          ID_premise: premiseId,
          ID_tenant: tenantId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteRentalById(rentalId) {
    try {
      await prisma.rental.delete({
        where: {
          ID: rentalId,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteRentalsWithConsideredStatusByPremise(premiseId) {
    try {
      await prisma.rental.deleteMany({
        where: {
          ID_premise: premiseId,
          Status: 0,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};
