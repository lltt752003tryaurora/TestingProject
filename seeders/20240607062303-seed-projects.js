'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Projects', [
      {
        name: 'Project 1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Project 2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Project 3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Project 4',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Project 5',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Projects', null, {});
  }
};
