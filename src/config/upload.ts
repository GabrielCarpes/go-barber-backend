import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const pathFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: pathFolder,
  storage: multer.diskStorage({
    destination: pathFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
