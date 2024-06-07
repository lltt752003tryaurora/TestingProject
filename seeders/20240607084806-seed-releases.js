'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Releases', [
      {
        projectId: 1, // ID of the project
        name: 'Release 1',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-06-30'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: 1,
        name: 'Release 2',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: 2,
        name: 'Release 1',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: 2,
        name: 'Release 2',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: 3,
        name: 'Release 1',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: 4,
        name: 'Release 1',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: 5,
        name: 'Release 1',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-31'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Releases', null, {}); // Rollback data
  }
};
