'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const issuesSeedData = [
      {
        name: 'Issue 1',
        description: 'Description for Issue 1',
        projectId: 1,
        creatorUserId: 2,
        assignedUserId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Issue 2',
        description: 'Description for Issue 2',
        projectId: 1,
        creatorUserId: 2,
        assignedUserId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Issue 3',
        description: 'Description for Issue 3',
        projectId: 2,
        creatorUserId: 3,
        assignedUserId: 9,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Issue 4',
        description: 'Description for Issue 4',
        projectId: 1,
        creatorUserId: 3,
        assignedUserId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Issue 5',
        description: 'Description for Issue 5',
        projectId: 1,
        creatorUserId: 3,
        assignedUserId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Issues', issuesSeedData, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Issues', null, {});
  }
};
