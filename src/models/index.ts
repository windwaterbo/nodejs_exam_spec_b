import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../db';
import User from './user';
import AppointmentService from './appointmentService';

const initModels = () => {
  User.initialize(sequelize, DataTypes);
  AppointmentService.initialize(sequelize, DataTypes);
  (User as any).associate?.();
  (AppointmentService as any).associate?.();
};

export { sequelize, initModels, User, AppointmentService };
