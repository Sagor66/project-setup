import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

export const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};

export const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString();
  const lastStudentId = await findLastStudentId();
  console.log(
    '🚀 ~ file: user.utils.ts:25 ~ generateStudentId ~ lastStudentId:',
    lastStudentId,
  );
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  console.log(
    '🚀 ~ file: user.utils.ts:27 ~ generateStudentId ~ lastStudentSemesterCode:',
    lastStudentSemesterCode,
  );
  const lastStudentSemesterYear = lastStudentId?.substring(0, 4);
  console.log(
    '🚀 ~ file: user.utils.ts:29 ~ generateStudentId ~ lastStudentSemesterYear:',
    lastStudentSemesterYear,
  );
  const currentSemesterCode = payload?.code;
  console.log(
    '🚀 ~ file: user.utils.ts:31 ~ generateStudentId ~ currentSemesterCode:',
    currentSemesterCode,
  );
  const currentSemesterYear = payload?.year;
  console.log(
    '🚀 ~ file: user.utils.ts:33 ~ generateStudentId ~ currentSemesterYear:',
    currentSemesterYear,
  );

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentSemesterYear === currentSemesterYear
  ) {
    currentId = lastStudentId.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};
