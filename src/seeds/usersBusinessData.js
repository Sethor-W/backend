import faker from 'faker';
import { UserBusiness } from '../models/usersBusiness.js';

export const generateUserBusinessData = () => {
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = {
      email: faker.internet.email(),
      keyword: faker.internet.password(),
      credential: faker.random.alphaNumeric(10),
      password: faker.internet.password(),
      status: faker.random.arrayElement(['active', 'deactivated']),
    };
    users.push(user);
  }
  return users;
};

export const fillUserBusinessTable = async () => {
  const userBusinessData = generateUserBusinessData();
  await UserBusiness.bulkCreate(userBusinessData);
};
