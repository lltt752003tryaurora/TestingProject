'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('TestPlanComponents', [
      {
        testPlanId: 1,
        name: 'Component A',
        description: 'Description for Component A',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        testPlanId: 1,
        name: 'Component B',
        description: 'Description for Component B',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        testPlanId: 2,
        name: 'Component A',
        description: 'Description for Component A',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        testPlanId: 2,
        name: 'Component B',
        description: 'Description for Component B',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        testPlanId: 2,
        name: 'Component C',
        description: 'Description for Component C',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        testPlanId: 3,
        name: 'Component A',
        description: 'Description for Component D',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        testPlanId: 3,
        name: 'Component B',
        description: 'Description for Component B',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        testPlanId: 3,
        name: 'Component C',
        description: 'Description for Component C',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TestPlanComponents', null, {});
  }
};
