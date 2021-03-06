import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import * as socket from '@shared/websocket/websocket';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import CreateNotificationService from '@domains/notifications/services/CreateNotificationService';
import SocketChannels from '@shared/websocket/socket-channels';
import IChatsRepository from '../rules/IChatsRepository';
import Message from '../infra/typeorm/entities/Message';
import IMessagesRepository from '../rules/IMessagesRepository';

interface IRequest {
  user_id: string;
  chat_id: string;
  content: string;
}

@injectable()
class CreateMessageService {
  constructor(
    @inject('ChatsRepository')
    private chatsRepository: IChatsRepository,

    @inject('MessagesRepository')
    private messagesRepository: IMessagesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CreateNotificationService')
    private createNotificationService: CreateNotificationService,
  ) {}

  public async execute({
    user_id,
    chat_id,
    content,
  }: IRequest): Promise<Message> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const chat = await this.chatsRepository.findById(chat_id);

    if (!chat) {
      throw new AppError('Chat was not found.');
    }

    const newMessage = await this.messagesRepository.create({
      content,
      user,
      user_id,
      chat,
    });

    chat.updated_at = new Date();
    await this.chatsRepository.save(chat);

    const user_receiving =
      user_id === chat.user_id ? chat.destinatary.id : chat.user_id;

    await this.createNotificationService.execute({
      user_id: user_receiving,
      content: `Você tem uma nova mensagem de ${user.name}.`,
    });

    const messages = await this.messagesRepository.findAllByChat(chat.id);

    const sendTo = socket.findConnections(user_receiving);

    socket.sendMessage(sendTo, SocketChannels.MessagesChannel, messages);

    return classToClass(newMessage);
  }
}

export default CreateMessageService;
