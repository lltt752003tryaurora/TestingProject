'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Attachments', [
      {
        url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        url: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Attachments', null, {});
  }
};
