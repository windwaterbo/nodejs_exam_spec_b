import 'dotenv/config';
import { Sequelize, DataTypes } from 'sequelize';
import User from '../models/user';
import AppointmentService from '../models/appointmentService';

let sequelize: Sequelize;

// Use SQLite for tests
if (process.env.NODE_ENV === 'test' || process.env.jest) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  });
} else {
  const config = require('./index').default;
  sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
      host: config.db.host,
      port: config.db.port,
      dialect: 'postgres',
      logging: false
    }
  );
}

User.initialize(sequelize, DataTypes);
AppointmentService.initialize(sequelize, DataTypes);
(User as any).associate?.();
(AppointmentService as any).associate?.();

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

afterEach(async () => {
  // Clear all tables after each test suite
  await User.destroy({ where: {} });
  await AppointmentService.destroy({ where: {} });
});

export default sequelize;
