import dotenv from 'dotenv';

dotenv.config();

const config = {
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  db: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'exam_db',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres'
  }
};

export default config;
