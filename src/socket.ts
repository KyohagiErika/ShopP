import { Server } from 'socket.io';
import ShopPConfig from './utils/shopp.config';
import server from '.';
import jwt from 'jsonwebtoken';
import { User } from './entities/user';
import UserModel from './models/user';
import ChatRoomModel from './models/chatRoom';
import { HttpStatusCode } from './utils/shopp.enum';
import { Message } from './entities/message';
import { ShopPDataSource } from './data';

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:8081', ShopPConfig.CLIENT_SOCKET_ENDPOINT],
    credentials: true,
  },
});

io.use(async (socket, next) => {
  // fetch token from handshake auth sent by FE
  const token = socket.handshake.auth.token;
  try {
    // verify jwt token and get user data
    const jwtPayload = <any>jwt.verify(token, ShopPConfig.JWT_SECRET);
    const user: User | false = await UserModel.getOneById(jwtPayload.userId);
    if (user === false) {
      return next(new Error('Not authorized'));
    } else {
      console.log('user', user);
      // save the user data into socket object, to be used further
      socket.data.user = user;
      next();
    }
  } catch (e) {
    // if token is invalid, close connection
    console.log('error', e);
    return next(new Error('Not authorized'));
  }
});

io.on('connection', socket => {
  console.log('a user connected');

  socket.on('join', async roomName => {
    //check valid chatRoom of user
    const chatRoom = await ChatRoomModel.findChatRoomById(roomName);
    if (!chatRoom) socket.emit('join-failed', 'Chat room not found!');
    else if (
      chatRoom.members.find(member => member.id === socket.data.user.id) ==
      undefined
    ) {
      socket.emit('join-failed', 'You are not in this chat room!');
    }

    // join chat room
    console.log('User:' + socket.data.user.id + ' join room: ' + roomName);
    socket.join(roomName);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // socket.on('my message', msg => {
  //   console.log('message: ' + msg);
  //   io.emit('my broadcast', `server: ${msg}`);
  // });

  socket.on('message', async ({ text, roomName }, callback) => {
    //check valid chatRoom of user
    const chatRoom = await ChatRoomModel.findChatRoomById(roomName);
    if (!chatRoom) socket.emit('send-failed', 'Chat room not found!');
    else if (
      chatRoom.members.find(member => member.id === socket.data.user.id) ==
      undefined
    ) {
      socket.emit('send-failed', 'You are not in this chat room!');
    }

    console.log('message: ' + text + ' in ' + roomName);
    // generate data to send to receivers
    const message = new Message();
    message.chatRoom = roomName;
    message.sender = socket.data.user;
    message.text = text;
    const outgoingMessage = await ShopPDataSource.getRepository(Message).save(
      message
    );

    // send socket to all in room except sender
    socket.to(roomName).emit('message', outgoingMessage);
    callback({
      status: HttpStatusCode.OK,
    });
  });
});
