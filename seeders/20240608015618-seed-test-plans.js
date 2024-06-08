'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('TestPlans', [
      {
        name: 'Test Plan 1',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-15'),
        description: 'Description for Test Plan 1',
        releaseId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Test Plan 2',
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-08-15'),
        description: 'Description for Test Plan 2',
        releaseId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Test Plan 3',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-09-15'),
        description: 'Description for Test Plan 3',
        releaseId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Test Plan 4',
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-10-15'),
        description: 'Description for Test Plan 4',
        releaseId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Test Plan 5',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-15'),
        description: 'Description for Test Plan 5',
        releaseId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TestPlans', null, {});
  }
};
