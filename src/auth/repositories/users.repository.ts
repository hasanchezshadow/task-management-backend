import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const genPassword = await bcrypt.hash(password, salt);

    const user = this.create({
      username,
      password: genPassword,
    });

    try {
      await this.save(user);
    } catch (e) {
      if (e.code === '23505') {
        //duplicated username
        throw new ConflictException('Username alreday exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
