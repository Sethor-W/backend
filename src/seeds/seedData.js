import { fillUserBusinessTable } from './usersBusinessData.js';
import { fillBusinessTable } from './businessData.js';

const fillTables = async () => {
  await fillUserBusinessTable();
  await fillBusinessTable();
};

fillTables();