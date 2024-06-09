'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'john_doe',
        fullName: 'John Doe',
        avatar: '1717904610165.jpg',
        hashedPassword: '$2b$10$Fhso7jTp2gQiuptOsPPHMeaAiIbqgLUnTwfZvCV0cotsf3k6wg9z.',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'jane_doe',
        fullName: 'Jane Doe',
        avatar: null,
        hashedPassword: '$2b$10$Fhso7jTp2gQiuptOsPPHMeaAiIbqgLUnTwfZvCV0cotsf3k6wg9z.',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'janna',
        fullName: 'Janna Doe',
        avatar: '1717904610166.jpg',
        hashedPassword: '$2b$10$Fhso7jTp2gQiuptOsPPHMeaAiIbqgLUnTwfZvCV0cotsf3k6wg9z.',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'jimmy_doe',
        fullName: 'Jimmy Doe',
        avatar: '1717904610170.jpg',
        hashedPassword: '$2b$10$Fhso7jTp2gQiuptOsPPHMeaAiIbqgLUnTwfZvCV0cotsf3k6wg9z.',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'lisan',
        fullName: 'Lisan al Gaib',
        hashedPassword: '$2b$10$Fhso7jTp2gQiuptOsPPHMeaAiIbqgLUnTwfZvCV0cotsf3k6wg9z.',
        avatar: null,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'johnw',
        fullName: 'John Wick',
        avatar: '1717904610169.jpg',
        hashedPassword: '$2b$10$Fhso7jTp2gQiuptOsPPHMeaAiIbqgLUnTwfZvCV0cotsf3k6wg9z.',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'ak1',
        fullName: 'Aki',
        avatar: '1717904610171.jpg',
        hashedPassword: '$2b$10$Fhso7jTp2gQiuptOsPPHMeaAiIbqgLUnTwfZvCV0cotsf3k6wg9z.',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'tomr',
        fullName: 'Tom Riddle',
        avatar: '1717904610172.jpg',
        hashedPassword: '$2b$10$Fhso7jTp2gQiuptOsPPHMeaAiIbqgLUnTwfZvCV0cotsf3k6wg9z.',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'maninblack',
        fullName: 'William',
        avatar: '1717904610176.jpg',
        hashedPassword: '$2b$10$Fhso7jTp2gQiuptOsPPHMeaAiIbqgLUnTwfZvCV0cotsf3k6wg9z.',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'thinh2',
        fullName: 'P0k3rK1ng',
        avatar: '1717937161902.png',
        hashedPassword: '$2b$10$Fhso7jTp2gQiuptOsPPHMeaAiIbqgLUnTwfZvCV0cotsf3k6wg9z.',
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
