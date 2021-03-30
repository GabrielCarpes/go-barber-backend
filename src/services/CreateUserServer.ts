import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import User from '../models/User';

import AppError from '../error/AppError';

interface Request {
  name: string;
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

class CreateUserService {
  public async execute({
    name,
    email,
    password,
  }: Request): Promise<IUserWithoutPassword> {
    const usersRepository = getRepository(User);

    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    const hashadPassword = await hash(password, 8);

    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    const user = usersRepository.create({
      name,
      email,
      password: hashadPassword,
    });

    await usersRepository.save(user);

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return userWithoutPassword;
  }
}

export default CreateUserService;
