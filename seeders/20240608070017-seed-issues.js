'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const issuesSeedData = [
      {
        name: 'Issue 1',
        description: 'Description for Issue 1',
        creatorUserId: 2,
        assignedUserId: 4,
        testRunId: 1,
        priority: 'high',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Issue 2',
        description: 'Description for Issue 2',
        creatorUserId: 2,
        assignedUserId: null,
        testRunId: 2,
        priority: 'medium',
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Issue 3',
        description: 'Description for Issue 3',
        creatorUserId: 3,
        assignedUserId: 9,
        testRunId: 5,
        priority: 'low',
        status: 'closed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Issue 4',
        description: 'Description for Issue 4',
        creatorUserId: 3,
        assignedUserId: 9,
        testRunId: 6,
        priority: 'medium',
        status: 'closed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Issue 5',
        description: 'Description for Issue 5',
        creatorUserId: 3,
        assignedUserId: 5,
        testRunId: 3,
        priority: 'high',
        status: 'open',
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
