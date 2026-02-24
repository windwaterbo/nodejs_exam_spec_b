import User from '../models/user';

const createUser = async (data: { email: string; password: string; name: string }) => {
  const user = await User.create(data);
  return user;
};

const findByEmail = async (email: string) => {
  return User.findOne({ where: { email } });
};

const findById = async (id: string) => {
  return User.findByPk(id);
};

export default { createUser, findByEmail, findById };
