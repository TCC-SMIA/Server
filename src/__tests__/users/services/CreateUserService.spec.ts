import CreateUserService from '@domains/users/services/CreateUserService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import UserTypes from '@domains/users/enums/UserEnums';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import FakeUsersRepository from '../fakes/FakeUsersRepository';
import FakeHashProvider from '../fakes/FakeHashProvider';

describe('CreateUserService', () => {
  let fakeUsersRepository: IUsersRepository;
  let createUserService: CreateUserService;
  let fakeHashProvider: IHashProvider;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Should be able to create a new reporter', async () => {
    const user = await createUserService.execute({
      name: 'jhon',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
      type: UserTypes.Reporter,
    });

    expect(user.name).toBe('jhon');
  });
});
