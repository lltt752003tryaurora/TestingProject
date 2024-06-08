'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('TestRuns', [
      {
        name: 'Test Run 1',
        assignedUserId: 2,
        testCaseId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Test Run 2',
        assignedUserId: 2,
        testCaseId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Test Run 1',
        assignedUserId: 3,
        testCaseId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Test Run 1',
        assignedUserId: 3,
        testCaseId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Test Run 1',
        assignedUserId: 3,
        testCaseId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Test Run 1',
        assignedUserId: 3,
        testCaseId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TestRuns', null, {});
  }
};
