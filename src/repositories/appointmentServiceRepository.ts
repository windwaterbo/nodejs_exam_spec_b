import AppointmentService from '../models/appointmentService';

const createAppointmentService = async (data: any) => {
  const appointmentService = await AppointmentService.create(data);
  return appointmentService;
};

const findAll = async (filters?: any) => {
  // If no filters provided or empty object, return all records
  if (!filters || Object.keys(filters).length === 0) {
    return AppointmentService.findAll();
  }

  const where: any = {};
  if (filters.isPublic !== undefined) {
    // support boolean or string 'true'/'false'
    where.isPublic = (filters.isPublic === true || filters.isPublic === 'true');
  }
  if (filters.isRemove !== undefined) {
    where.isRemove = (filters.isRemove === true || filters.isRemove === 'true');
  }
  if (filters.shopId !== undefined) {
    where.shopId = filters.shopId;
  }
  if (filters.id !== undefined) {
    where.id = filters.id;
  }

  return AppointmentService.findAll({ where });
};

const findById = async (id: string) => {
  return AppointmentService.findByPk(id);
};

const updateAppointmentService = async (id: string, data: any) => {
  const appointmentService = await AppointmentService.findByPk(id);
  if (!appointmentService) return null;
  return appointmentService.update(data);
};

const softDelete = async (id: string) => {
  const appointmentService = await AppointmentService.findByPk(id);
  if (!appointmentService) return null;
  return appointmentService.update({ isRemove: true });
};

export default { createAppointmentService, findAll, findById, updateAppointmentService, softDelete };
