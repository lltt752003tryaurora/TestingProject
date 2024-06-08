'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ReleaseAttachments', [
      {
        releaseId: 1, // Replace with valid releaseId from your 'Releases' table
        attachmentId: 1, // Replace with valid attachmentId from your 'Attachments' table
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        releaseId: 1, // Replace with valid releaseId from your 'Releases' table
        attachmentId: 2, // Replace with valid attachmentId from your 'Attachments' table
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        releaseId: 2, // Replace with valid releaseId from your 'Releases' table
        attachmentId: 3, // Replace with valid attachmentId from your 'Attachments' table
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more release-attachment associations as needed
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ReleaseAttachments', null, {});
  }
};
