import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { createToken } from './auth.utils';

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByCustomId(payload.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (!(await User.isPasswordMatched(payload.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password did not match!');
  }
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  //   const isPasswordMatched = await bcrypt.compare(
  //     payload.password,
  //     isUserExists.password,

  const jwtPayload = {
    userId: user?.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_secret as string,
    config.jwt_access_expires as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires as string,
  );
  //   );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  const user = await User.isUserExistsByCustomId(userData.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password did not match!');
  }
  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  const isDeleted = user?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted!');
  }

  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  const jwtPayload = {
    userId: user?.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_secret as string,
    config.jwt_access_expires as string,
  );

  return {
    accessToken,
  };
};

export const AuthService = {
  loginUser,
  changePassword,
  refreshToken,
};
