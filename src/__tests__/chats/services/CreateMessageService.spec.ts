import IChatsRepository from '@domains/chats/rules/IChatsRepository';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import CreateMessageService from '@domains/chats/services/CreateMessageService';
import FakeUsersRepository from '@tests/users/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import IMessagesRepository from '@domains/chats/rules/IMessagesRepository';
import FakeChatsRepository from '../fakes/FakeChatsRepository';
import FakeMessagesRepository from '../fakes/FakeMessagesRepository';

let fakeChatsRepository: IChatsRepository;
let fakeUsersRepository: IUsersRepository;
let fakeMessagesRepository: IMessagesRepository;
let createMessageService: CreateMessageService;

describe('CreateMessageService', () => {
  beforeEach(() => {
    fakeChatsRepository = new FakeChatsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeMessagesRepository = new FakeMessagesRepository();

    createMessageService = new CreateMessageService(
      fakeChatsRepository,
      fakeMessagesRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to create a new message', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    const contact = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'tre@tre.com',
      nickname: 'trezins',
      password: '123123',
    });

    const chat = await fakeChatsRepository.create({
      users: [user, contact],
    });

    const newMessage = await createMessageService.execute({
      user_id: user.id,
      chat_id: chat.id,
      content: 'Nova Mensagem',
    });

    expect(newMessage.user_id).toBe(user.id);
    expect(newMessage.chat_id).toBe(chat.id);
    expect(newMessage.content).toBe('Nova Mensagem');
  });

  it('should not be able to create a message with non existing user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    const contact = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'tre@tre.com',
      nickname: 'trezins',
      password: '123123',
    });

    const chat = await fakeChatsRepository.create({
      users: [user, contact],
    });

    await expect(
      createMessageService.execute({
        user_id: 'InvalidId',
        chat_id: chat.id,
        content: 'Nova Mensagem',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a message with non existing chat', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    await expect(
      createMessageService.execute({
        user_id: user.id,
        chat_id: 'InvalidId',
        content: 'Nova Mensagem',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});