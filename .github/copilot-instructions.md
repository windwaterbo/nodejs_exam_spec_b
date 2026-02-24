# Coding Instructions

- Use layered architecture:
  controllers → services → repositories
- Use async/await only
- No business logic in controllers
- Validate request using Joi
- Use centralized error handler
- Use Sequelize migrations only (no sync)