'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Requirements', [
      {
        releaseId: 1, // ID of the project
        name: 'Requirement 1',
        description: 'Description for Requirement 1',
        parentRequirementId: null, // No parent requirement
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        releaseId: 1,
        name: 'Requirement 2',
        description: 'Description for Requirement 2',
        parentRequirementId: 1, // ID of parent requirement, if any
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        releaseId: 1,
        name: 'Requirement 3',
        description: 'Description for Requirement 3',
        parentRequirementId: 1, // ID of parent requirement, if any
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        releaseId: 1,
        name: 'Requirement 4',
        description: 'Description for Requirement 4',
        parentRequirementId: null, // ID of parent requirement, if any
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        releaseId: 2,
        name: 'Requirement 5',
        description: 'Description for Requirement 5',
        parentRequirementId: null, // ID of parent requirement, if any
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        releaseId: 2,
        name: 'Requirement 6',
        description: 'Description for Requirement 6',
        parentRequirementId: null, // ID of parent requirement, if any
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        releaseId: 3,
        name: 'Requirement 7',
        description: 'Description for Requirement 7',
        parentRequirementId: null, // ID of parent requirement, if any
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        releaseId: 4,
        name: 'Requirement 8',
        description: 'Description for Requirement 8',
        parentRequirementId: null, // ID of parent requirement, if any
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Requirements', null, {}); // Rollback data
  }
};
