import 'dotenv/config';
import app from './app';
import { initModels } from './models';

// Initialize all Sequelize models before starting server
initModels();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});
