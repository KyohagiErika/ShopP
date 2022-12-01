import Response from '../utils/response';
import { HttpStatusCode } from './../utils/shopp.enum';
import { ShopPDataSource } from './../data';
import { User } from '../entities/user';
import { Message } from '../entities/message';
import ChatRoomModel from '../models/chatRoom';

const messageRepository = ShopPDataSource.getRepository(Message);
export default class MessageModel {
  static async getMessages(chatRoomId: number) {
    const messages = await messageRepository.find({
      relations: {
        sender: true,
        chatRoom: true,
      },
      where: { chatRoom: { id: chatRoomId } },
      order: {
        createdAt: 'ASC',
      },
    });
    return messages && messages.length > 0 ? messages : false;
  }

  static async addMessage(user: User, chatRoomId: number, text: string) {
    const chatRoom = await ChatRoomModel.findChatRoomById(chatRoomId);
    if (!chatRoom)
      return new Response(HttpStatusCode.BAD_REQUEST, 'Chat Room not found!');

    if (chatRoom.members.find(member => member.id === user.id) == undefined) {
      return new Response(
        HttpStatusCode.BAD_REQUEST,
        'You are not in this chat room!'
      );
    }
    const message = new Message();
    message.chatRoom = chatRoom;
    message.sender = user;
    message.text = text;
    await messageRepository.save(message);
    return new Response(HttpStatusCode.OK, 'Message sent!');
  }
}
