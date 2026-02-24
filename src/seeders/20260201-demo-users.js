'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const now = new Date();

    // Seed Users
    await queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        email: 'admin@demo.com',
        password: hashedPassword,
        name: 'Admin User',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        email: 'user@demo.com',
        password: hashedPassword,
        name: 'Demo User',
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
