import AppError from '@shared/errors/AppError';
import ResetPasswordService from '@domains/users/services/ResetPasswordService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IUserTokensRepository from '@domains/users/rules/IUserTokensRepository';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import FakeUsersRepository from '../fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../fakes/FakeUserTokensRepository';
import FakeHashProvider from '../fakes/FakeHashProvider';

let fakeUsersRepository: IUsersRepository;
let fakeUserTokensRepository: IUserTokensRepository;
let fakeHashProvider: IHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    fakeUserTokensRepository = new FakeUserTokensRepository();

    fakeHashProvider = new FakeHashProvider();

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123456',
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      token: userToken.token,
      password: '123123',
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existingToken',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'nonExistingUser',
    );

    await expect(
      resetPasswordService.execute({
        token,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
