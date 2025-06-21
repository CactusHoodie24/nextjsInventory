import formidable from 'formidable';
import { IncomingMessage } from 'http';

export const parseForm = (req: IncomingMessage): Promise<{ fields: any; files: any }> => {
  const form = formidable({ multiples: false });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};
