import { v2 as cloudinary } from 'cloudinary';

export const StorageProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'dgmsllh4p',
      api_key: '913169579677528',
      api_secret: '2oTYfF5D5oeNEzoYADr7UHXREfE',
    });
  },
};
