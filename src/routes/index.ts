import Router from '@koa/router';
import authController from '../controllers/authController';
import appointmentServiceController from '../controllers/appointmentServiceController';
import { validateBody } from '../middlewares/validate';
import { authRequired } from '../middlewares/auth';
import { registerSchema, loginSchema } from '../validators/authValidators';
import { createAppointmentServiceSchema } from '../validators/appointmentServiceValidators';

const router = new Router();

router.post('/auth/register', validateBody(registerSchema), authController.register);
router.post('/auth/login', validateBody(loginSchema), authController.login);

router.get('/services', appointmentServiceController.list);
router.get('/services/:id', appointmentServiceController.getById);
router.post('/services', authRequired, validateBody(createAppointmentServiceSchema), appointmentServiceController.create);
router.put('/services/:id', authRequired, appointmentServiceController.update);
router.delete('/services/:id', authRequired, appointmentServiceController.remove);

export default router;
