import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidations } from './OfferedCourse.validation';
import { OfferedCourseControllers } from './OfferedCourse.controller';

const router = express.Router();

router.post(
  '/',
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

// router.get(
//   '/:id',
//   SemesterRegistrationControllers.getSingleSemesterRegistration,
// );

router.patch(
  '/:id',
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

// router.get('/', SemesterRegistrationControllers.getAllSemesterRegistration);

export const OfferedCourseRoutes = router;
