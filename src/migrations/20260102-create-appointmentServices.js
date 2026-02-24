"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AppointmentServices', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      showTime: {
        type: Sequelize.INTEGER
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isRemove: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      ShopId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('AppointmentServices', ['ShopId'], {
      name: 'appointment_services__shop_id'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('AppointmentServices', 'appointment_services__name');
    await queryInterface.dropTable('AppointmentServices');
  }
};
