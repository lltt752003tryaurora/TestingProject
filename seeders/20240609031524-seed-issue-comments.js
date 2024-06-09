'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('IssueComments', [
      {
        issueId: 1,
        userId: 2,
        comment: 'User 2 found a bug.',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        issueId: 1,
        userId: 4,
        comment: 'User 4 attempted to fix it.',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        issueId: 1,
        userId: 2,
        comment: 'User 2 urged user 4 on deadline.',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        issueId: 1,
        userId: 4,
        comment: 'User 4 quitted the project.',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        issueId: 2,
        userId: 2,
        comment: 'User 2 found a bug, but assigned no one to blame.',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        issueId: 3,
        userId: 3,
        comment: 'User 3 initialized the thread.',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        issueId:3,
        userId: 9,
        comment: 'User 9 magically fixed the bug.',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        issueId: 3,
        userId: 3,
        comment: 'User 3 was impressed deeply, then he closed the thread.',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('IssueComments', null, {});
  }
};
