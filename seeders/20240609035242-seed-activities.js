'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Activities', [
      {
        projectId: 1,
        userId: 1,
        type: 'project creation',
        detail: 'user=1 created project=1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        projectId: 1,
        userId: 1,
        type: 'project member assignment',
        detail: 'user=1 assigned user=1 as role=manager in project=1',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Activities', null, {});
  }
};
