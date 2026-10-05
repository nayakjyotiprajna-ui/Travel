import { Server, Socket } from 'socket.io';
import { TravelRoom } from '../models/TravelRoom';

export const configureRoomSockets = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // Join room
    socket.on('room:join', async ({ roomCode, user }) => {
      if (!roomCode) return;
      const code = roomCode.toUpperCase().trim();
      socket.join(code);
      console.log(`[Socket] ${user?.name || socket.id} joined room ${code}`);

      // Broadcast presence to room members
      io.to(code).emit('room:participant_joined', {
        userId: user?.id || socket.id,
        name: user?.name || 'Explorer',
        avatar: user?.avatar || '',
        socketId: socket.id,
        joinedAt: new Date(),
      });
    });

    // Leave room
    socket.on('room:leave', ({ roomCode, user }) => {
      if (!roomCode) return;
      const code = roomCode.toUpperCase().trim();
      socket.leave(code);
      io.to(code).emit('room:participant_left', {
        userId: user?.id || socket.id,
        name: user?.name,
      });
    });

    // Shared location updates
    socket.on('journey:update', async ({ roomCode, location, stopIndex }) => {
      if (!roomCode) return;
      const code = roomCode.toUpperCase().trim();

      // Persist to DB asynchronously
      try {
        await TravelRoom.findOneAndUpdate({ roomCode: code }, { currentLocation: location });
      } catch (err) {
        console.error('[Socket] Failed updating room location in DB:', err);
      }

      io.to(code).emit('journey:updated', {
        location,
        stopIndex,
        timestamp: new Date(),
      });
    });

    // Activity synchronization
    socket.on('activity:start', async ({ roomCode, activity }) => {
      if (!roomCode) return;
      const code = roomCode.toUpperCase().trim();

      try {
        await TravelRoom.findOneAndUpdate({ roomCode: code }, { currentActivity: activity.title });
      } catch (err) {
        console.error('[Socket] Failed updating room activity in DB:', err);
      }

      io.to(code).emit('activity:started', { activity, timestamp: new Date() });
    });

    socket.on('activity:complete', ({ roomCode, activity, user, score }) => {
      if (!roomCode) return;
      const code = roomCode.toUpperCase().trim();
      io.to(code).emit('activity:completed', {
        activity,
        user,
        score,
        timestamp: new Date(),
      });
    });

    // Shared Memory creation broadcast
    socket.on('memory:created', ({ roomCode, memory, user }) => {
      if (!roomCode) return;
      const code = roomCode.toUpperCase().trim();
      io.to(code).emit('memory:broadcast', { memory, user, timestamp: new Date() });
    });

    // Chat in room
    socket.on('chat:message', async ({ roomCode, message }) => {
      if (!roomCode || !message) return;
      const code = roomCode.toUpperCase().trim();

      const chatObj = {
        senderId: message.senderId || socket.id,
        senderName: message.senderName || 'Explorer',
        text: message.text,
        timestamp: new Date(),
      };

      try {
        await TravelRoom.findOneAndUpdate(
          { roomCode: code },
          { $push: { chatMessages: chatObj } }
        );
      } catch (err) {
        console.error('[Socket] Failed appending chat message in DB:', err);
      }

      io.to(code).emit('chat:received', chatObj);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });
};
