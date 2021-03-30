import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import authConfig from '../config/auth';
import User from '../models/User';

import AppError from '../error/AppError';

interface Request {
  email: string;
  password: string;
}

interface IUserWithoutPassword {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

interface response {
  userWithoutPassword: IUserWithoutPassword;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<response> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    }

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { userWithoutPassword, token };
  }
}

export default AuthenticateUserService;
