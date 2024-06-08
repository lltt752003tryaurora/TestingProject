'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('IssueAttachments', [
      {
        issueId: 1,
        attachmentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        issueId: 1,
        attachmentId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        issueId: 2,
        attachmentId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        issueId: 2,
        attachmentId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        issueId: 1,
        attachmentId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        issueId: 3,
        attachmentId: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        issueId: 4,
        attachmentId: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('IssueAttachments', null, {});
  }
};