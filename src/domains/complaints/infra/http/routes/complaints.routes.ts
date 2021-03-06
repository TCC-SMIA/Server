import { Router } from 'express';
import multer from 'multer';
import multerConfig from '@config/multerConfig';

import ComplaintsController from '@domains/complaints/infra/http/controllers/ComplaintsController';
import ImageComplaintController from '@domains/complaints/infra/http/controllers/ImageComplaintController';

import ensureAuthenticate from '@domains/users/infra/http/middlewares/ensureAuthenticate';
import ComplaintStatusController from '../controllers/ComplaintStatusController';
import resolveComplaintValidator from '../validators/ResolveComplaintValidator';
import ComplaintsByUserController from '../controllers/ComplaintsByUserController';
import ComplaintsTypeController from '../controllers/ComplaintsTypeController';

const complaintsRoutes = Router();
const upload = multer(multerConfig.multer);

complaintsRoutes.get('/types', ComplaintsTypeController.index);

complaintsRoutes.use(ensureAuthenticate);

complaintsRoutes.post('/', upload.single('image'), ComplaintsController.create);

complaintsRoutes.put('/update', ComplaintsController.update);

complaintsRoutes.patch(
  '/resolve',
  resolveComplaintValidator,
  ComplaintStatusController.update,
);

complaintsRoutes.get('/', ComplaintsController.index);
complaintsRoutes.get('/mycomplaints', ComplaintsByUserController.index);

complaintsRoutes.delete('/delete', ComplaintsController.delete);

complaintsRoutes.get('/:complaint_id', ComplaintsController.show);

complaintsRoutes.get('/activities/resume', ComplaintsByUserController.show);

complaintsRoutes.patch(
  '/image',
  upload.single('image'),
  ImageComplaintController.update,
);

export default complaintsRoutes;
