import Response from '../utils/response';
import { StatusEnum, HttpStatusCode } from './../utils/shopp.enum';
import { ShopPDataSource } from './../data';
import { User } from '../entities/user';
import { ChatRoom } from '../entities/chatRoom';
import { ArrayContains } from 'typeorm';

const userRepository = ShopPDataSource.getRepository(User);
const chatRoomRepository = ShopPDataSource.getRepository(ChatRoom);
export default class ChatRoomModel {
  static async getUserChatRoom(user: User) {
    const chatRooms = await chatRoomRepository.find({
      relations: {
        members: true,
      },
      where: { members: ArrayContains([user]), status: StatusEnum.ACTIVE },
      select: {
        id: true,
        members: {
          id: true,
          email: true,
          phone: true,
        },
      },
    });
    return chatRooms && chatRooms.length > 0 ? chatRooms : false;
  }

  static async findChatRoomOfUser(user: User, receiverId: number) {
    const receiver = await userRepository.findOne({
      where: { id: receiverId },
    });
    if (receiver == null)
      return false;

    const chatRoom = await chatRoomRepository.findOne({
      relations: {
        members: true,
      },
      where: { members: ArrayContains([user, receiver]), status: StatusEnum.ACTIVE },
      select: {
        id: true,
        members: {
          id: true,
          email: true,
          phone: true,
        },
      },
    });
    return chatRoom ? chatRoom : false;
  }

  static async createChat(sender: User, receiverId: number) {
    const receiver = await userRepository.findOne({
      where: { id: receiverId },
    });
    if (receiver == null)
      return new Response(HttpStatusCode.BAD_REQUEST, 'User not found!');

    const chatRoom = new ChatRoom();
    chatRoom.members = [sender, receiver];
    await chatRoomRepository.save(chatRoom);
    return new Response(HttpStatusCode.OK, `Create Chat Room successfully!`);
  }

  static async findChatRoomById(id: number) {
    const chatRoom = await chatRoomRepository.findOne({
      relations: {
        members: true,
      },
      where: { id: id, status: StatusEnum.ACTIVE },
      select: {
        id: true,
        members: {
          id: true,
          email: true,
          phone: true,
        },
      },
    });
    return chatRoom ? chatRoom : false;
  }
}
