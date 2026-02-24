'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('Services', [
      {
        id: uuidv4(),
        name: 'Web Development',
        description: 'Professional web development services',
        price: 5000,
        showTime: 60,
        order: 1,
        isPublic: true,
        isRemove: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Mobile App Development',
        description: 'iOS and Android development',
        price: 8000,
        showTime: 90,
        order: 2,
        isPublic: true,
        isRemove: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Consultation',
        description: 'Technical consultation services',
        price: 1500,
        showTime: 30,
        order: 3,
        isPublic: true,
        isRemove: false,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Services', null, {});
  }
};
