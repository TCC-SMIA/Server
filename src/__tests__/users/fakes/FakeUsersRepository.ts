import User from '@domains/users/infra/typeorm/entities/User';
import IUsersRepository from '@domains/users/rules/IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async save(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const userExists = this.users.find(user => user.email === email);

    return userExists;
  }

  public async findByNickname(nickname: string): Promise<User | undefined> {
    const userExists = this.users.find(user => user.nickname === nickname);

    return userExists;
  }

  public async findById(id: string): Promise<User | undefined> {
    const userExists = this.users.find(user => user.id === id);

    return userExists;
  }

  public async create(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }
}

export default FakeUsersRepository;
