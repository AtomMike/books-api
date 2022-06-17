'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Books', [{
      name: 'The Frog Band and the Onion Seller',
      isbn: '978-1907700019',
      datePublished: '2011-11-01 00:00:00',
      authorId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', null, {});
  }
};
