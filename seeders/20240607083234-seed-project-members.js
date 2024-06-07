'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ProjectMembers', [
      {
        role: 'manager',
        projectId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'manager',
        projectId: 2,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'manager',
        projectId: 3,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'manager',
        projectId: 4,
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'manager',
        projectId: 5,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'tester',
        projectId: 1,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'tester',
        projectId: 1,
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'developer',
        projectId: 1,
        userId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'developer',
        projectId: 1,
        userId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'tester',
        projectId: 2,
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'developer',
        projectId: 2,
        userId: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProjectMembers', null, {});
  }
};
