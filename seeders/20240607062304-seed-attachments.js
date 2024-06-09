'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Attachments', [
      {
        fileName: '1717904610165.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '1717904610166.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '1717904610167.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '1717904610168.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '1717904610169.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '1717904610170.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '1717904610171.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '1717904610172.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fileName: '1717904610173.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Attachments', null, {});
  }
};
