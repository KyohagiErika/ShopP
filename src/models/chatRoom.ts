import Response from '../utils/response';
import { StatusEnum, HttpStatusCode } from './../utils/shopp.enum';
import { ShopPDataSource } from './../data';
import { User } from '../entities/user';
import { ChatRoom } from '../entities/chatRoom';
import { Shop } from '../entities/shop';
import { Customer } from '../entities/customer';

const userRepository = ShopPDataSource.getRepository(User);
const chatRoomRepository = ShopPDataSource.getRepository(ChatRoom);

export default class ChatRoomModel {
  static async getShopChatRoom(user: User) {
    const chatRooms = await chatRoomRepository.find({
      relations: {
        customer: true,
      },
      where: { status: StatusEnum.ACTIVE, shop: { id: user.shop.id } },
    });
    return chatRooms && chatRooms.length > 0 ? chatRooms : false;
  }

  static async getCustomerChatRoom(user: User) {
    const chatRooms = await chatRoomRepository.find({
      relations: {
        shop: true,
      },
      where: { status: StatusEnum.ACTIVE, customer: { id: user.customer.id } },
    });
    return chatRooms && chatRooms.length > 0 ? chatRooms : false;
  }

  static async findChatRoom(shop: Shop, customer: Customer) {
    const chatRoom = await chatRoomRepository.findOne({
      where: {
        status: StatusEnum.ACTIVE,
        shop: { id: shop.id },
        customer: { id: customer.id },
      },
    });
    return chatRoom ? chatRoom : false;
  }

  static async createChat(shop: Shop, customer: Customer) {
    const chatRoom = new ChatRoom();
    chatRoom.shop = shop;
    chatRoom.customer = customer;
    const chatRoomEntity = await chatRoomRepository.save(chatRoom);
    return new Response(
      HttpStatusCode.OK,
      `Create Chat Room successfully!`,
      chatRoomEntity
    );
  }

  static async findChatRoomById(id: number, user: User) {
    const chatRoom = await chatRoomRepository.findOne({
      relations: {
        shop: true,
        customer: true,
      },
      where: { id: id, status: StatusEnum.ACTIVE },
    });
    if (chatRoom != null) {
      // Check if user is in this chat room
      if (
        user.customer == null ||
        (user.customer != null && chatRoom.customer.id !== user.customer.id) ||
        user.shop == null ||
        (user.shop != null && chatRoom.shop.id !== user.shop.id)
      )
        return false;
      else return chatRoom;
    }
    return false;
  }

  static async deleteChatRoomById(id: number) {
    return await chatRoomRepository.update(id, { status: StatusEnum.INACTIVE });
  }
}
