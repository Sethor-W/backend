import faker from 'faker';
import { Business } from '../models/common/business.js';

export const generateBusinessData = () => {
  const businesses = [];
  for (let i = 0; i < 10; i++) {
    const business = {
      name: faker.company.companyName(),
      rut_business: faker.finance.routingNumber(),
      tax_code: faker.finance.account(),
      description: faker.lorem.sentence(),
      address: faker.address.streetAddress(),
      profilePicture: faker.image.imageUrl(),
      coverPicture: faker.image.imageUrl(),
      validated_business: faker.random.boolean(),
    };
    businesses.push(business);
  }
  return businesses;
};

export const fillBusinessTable = async () => {
  const businessData = generateBusinessData();
  await Business.bulkCreate(businessData);
};
