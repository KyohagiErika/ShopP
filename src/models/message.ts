import Response from '../utils/response';
import { HttpStatusCode, TypeTransferEnum } from './../utils/shopp.enum';
import { ShopPDataSource } from './../data';
import { User } from '../entities/user';
import { Message } from '../entities/message';
import ChatRoomModel from '../models/chatRoom';

const messageRepository = ShopPDataSource.getRepository(Message);
export default class MessageModel {
  static async getMessages(chatRoomId: number) {
    const messages = await messageRepository.find({
      where: { chatRoom: { id: chatRoomId } },
      order: {
        createdAt: 'ASC',
      },
    });
    return messages && messages.length > 0 ? messages : false;
  }

  static async addMessage(
    user: User,
    roleSender: TypeTransferEnum,
    chatRoomId: number,
    text: string
  ) {
    const chatRoom = await ChatRoomModel.findChatRoomById(chatRoomId, user);
    if (!chatRoom)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Chat Room not found!');

    const message = new Message();
    message.chatRoom = chatRoom;
    message.roleSender = roleSender;
    message.text = text;
    await messageRepository.save(message);
    return new Response(HttpStatusCode.OK, 'Created Message!');
  }
}
