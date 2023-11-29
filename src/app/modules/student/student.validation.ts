// {
//   import Joi from 'Joi';

//   const userNameValidationSchema = Joi.object({
//     firstName: Joi.string()
//       .trim()
//       .required()
//       .max(20)
//       .pattern(/^[A-Z][a-z]*$/, { name: 'capitalized' }),
//     middleName: Joi.string(),
//     lastName: Joi.string()
//       .required()
//       .pattern(/^[A-Za-z]+$/, { name: 'alphabetical' }),
//   });

//   const guardianValidationSchema = Joi.object({
//     fatherName: Joi.string().required(),
//     fatherOccupation: Joi.string().required(),
//     fatherContactNo: Joi.string().required(),
//     motherName: Joi.string().required(),
//     motherOccupation: Joi.string().required(),
//     motherContactNo: Joi.string().required(),
//   });

//   const localGuardianValidationSchema = Joi.object({
//     name: Joi.string().required(),
//     occupation: Joi.string().required(),
//     contactNo: Joi.string().required(),
//     address: Joi.string().required(),
//   });

//   // Define the main Joi schema for the Student model
//   const studentValidationSchema = Joi.object({
//     id: Joi.string().required(),
//     name: userNameValidationSchema.required(),
//     gender: Joi.string().valid('male', 'female', 'others').required(),
//     dateOfBirth: Joi.string().required(),
//     email: Joi.string().email().required(),
//     contactNo: Joi.string().required(),
//     emergencyContactNo: Joi.string().required(),
//     bloodGroup: Joi.string()
//       .valid('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')
//       .required(),
//     presentAddress: Joi.string().required(),
//     permanentAddress: Joi.string().required(),
//     guardian: guardianValidationSchema.required(),
//     localGuardian: localGuardianValidationSchema.required(),
//     profileImg: Joi.string(),
//     isActive: Joi.string().valid('active', 'blocked').default('active'),
//   });
// }

import { z } from 'zod';

const userNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20),
  middleName: z.string(),
  lastName: z.string().min(1),
});

const guardianValidationSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

const localGuardianValidationSchema = z.object({
  name: z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
});

// Define the main Zod schema for the Student model
const studentValidationSchema = z.object({
  id: z.string(),
  password: z.string().max(20),
  name: userNameValidationSchema,
  gender: z.enum(['male', 'female', 'others']),
  dateOfBirth: z.string(),
  email: z.string().email(),
  contactNo: z.string(),
  emergencyContactNo: z.string(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
  presentAddress: z.string(),
  permanentAddress: z.string(),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImg: z.string().optional(),
  isActive: z.enum(['active', 'blocked']).default('active'),
  isDeleted: z.boolean(),
});

export default studentValidationSchema;
