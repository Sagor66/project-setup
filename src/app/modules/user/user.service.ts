import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //   if (await User.isUserExists(studentData.id)) {
  //     throw new Error('User already exists!');
  //   }

  const userData: Partial<TUser> = {};

  userData.role = 'student';
  userData.password = password || (config.default_password as string);

  const admissionSemester = await AcademicSemesterModel.findById(
    payload.admissionSemester,
  );

  userData.id = await generateStudentId(admissionSemester);

  // create a user
  const newUser = await User.create(userData);

  // create a student
  if (Object.keys(newUser).length) {
    payload.id = newUser.id;
    payload.user = newUser._id;

    const newStudent = await Student.create(payload);
    return newStudent;
  }

  return newUser;
};

export const UserServices = {
  createStudentIntoDB,
};
