'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('TestCases', [
      {
        moduleId: 1,
        testPlanId: 1,
        name: 'Test Case A',
        description: 'Description for Test Case A',
        type: 'functional',
        priority: 'high',
        detail: 'Detail for Test Case A',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        moduleId: 2,
        testPlanId: 2,
        name: 'Test Case B',
        description: 'Description for Test Case B',
        type: 'functional',
        priority: 'medium',
        detail: 'Detail for Test Case B',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        moduleId: 3,
        testPlanId: 3,
        name: 'Test Case C',
        description: 'Description for Test Case C',
        type: 'performance',
        priority: 'low',
        detail: 'Detail for Test Case C',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        moduleId: 5,
        testPlanId: 4,
        name: 'Test Case D',
        description: 'Description for Test Case D',
        type: 'performance',
        priority: 'high',
        detail: 'Detail for Test Case D',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        moduleId: 5,
        testPlanId: 5,
        name: 'Test Case E',
        description: 'Description for Test Case E',
        type: 'performance',
        priority: 'medium',
        detail: 'Detail for Test Case E',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TestCases', null, {});
  }
};
