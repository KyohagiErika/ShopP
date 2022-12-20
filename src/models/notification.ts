import Response from '../utils/response';
import { HttpStatusCode, RoleEnum } from '../utils/shopp.enum';
import { ShopPDataSource } from '../data';
import { User } from '../entities/user';
import { LocalFile } from '../entities/localFile';
import { Notification } from '../entities/notification';

const notificationRepository = ShopPDataSource.getRepository(Notification);
export default class NotificationModel {
  static async getNotifications(user: User, userRole: RoleEnum) {
    const notifications = await notificationRepository.find({
      relations: {
        image: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
      where: {
        roleReceiver: userRole,
        receivers: {
          id: user.id,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return notifications && notifications.length > 0 ? notifications : false;
  }

  static async createNotification(
    title: string,
    content: string,
    image: LocalFile,
    receivers: User[],
    roleReceiver: RoleEnum
  ) {
    const notification = notificationRepository.create({
      title: title,
      content: content,
      image: image,
      receivers: receivers,
      roleReceiver: roleReceiver,
    });
    await notificationRepository.save(notification);
    return new Response(HttpStatusCode.OK, 'Created notification!');
  }
}
