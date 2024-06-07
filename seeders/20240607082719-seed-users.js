'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'john_doe',
        fullname: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'jane_doe',
        fullname: 'Jane Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'janna',
        fullname: 'Janna Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'jimmy_doe',
        fullname: 'Jimmy Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'lisan',
        fullname: 'Lisan al Gaib',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'johnw',
        fullname: 'John Wick',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'ak1',
        fullname: 'Aki',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'tomr',
        fullname: 'Tom Riddle',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'maninblack',
        fullname: 'William',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
