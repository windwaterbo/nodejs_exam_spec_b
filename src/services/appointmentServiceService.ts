import appointmentServiceRepository from '../repositories/appointmentServiceRepository';

const list = async (filters?: any) => {
  return appointmentServiceRepository.findAll(filters);
};

const create = async (data: any) => {
  return appointmentServiceRepository.createAppointmentService(data);
};

const getById = async (id: string) => {
  return appointmentServiceRepository.findById(id);
};

const update = async (id: string, data: any) => {
  return appointmentServiceRepository.updateAppointmentService(id, data);
};

const remove = async (id: string) => {
  return appointmentServiceRepository.softDelete(id);
};

export default { list, create, getById, update, remove };
