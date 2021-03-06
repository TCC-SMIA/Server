import { Repository, getRepository } from 'typeorm';

import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import ICreateNotificationDTO from '@domains/notifications/dtos/ICreateNotificationsDTO';
import Notification from '@domains/notifications/infra/typeorm/entities/Notification';

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: Repository<Notification>;

  constructor() {
    this.ormRepository = getRepository(Notification);
  }

  public async findById(
    notification_id: string,
  ): Promise<Notification | undefined> {
    return this.ormRepository.findOne(notification_id, { relations: ['user'] });
  }

  public async update(notification: Notification): Promise<Notification> {
    return this.ormRepository.save(notification);
  }

  public async findByUser(user_id: string): Promise<Notification[]> {
    return this.ormRepository.find({
      where: { user_id, read: false },
      order: { created_at: 'DESC' },
    });
  }

  public async create({
    user_id,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      user_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }

  public async delete(notification_id: string): Promise<void> {
    await this.ormRepository.delete({ id: notification_id });
  }
}

export default NotificationsRepository;
