// server/socketHandlers.js
const { EVT } = require("../shared/protocol");
const {
  rooms,
  ensureRoom,
  bindSeatSocket,
  unbindSocket,
  broadcastState,
  normName,
  roomIsFull,
  addPlayer,
} = require("./rooms");
const { createDeck, shuffle, cardText } = require("./deck");

function registerSocket(io) {
  io.on("connection", (socket) => {
    console.log("✅ user connected:", socket.id);

    let joined = { roomId: null, seatId: null }; // track membership

    socket.on(EVT.ROOM_CREATE, ({ roomId, displayName }) => {
      if (!roomId) return;
      const room = ensureRoom(roomId);
      if (roomIsFull(room.state)) return;

      socket.join(roomId);
      room.sockets.add(socket.id);

      const seatId = addPlayer(room.state, displayName);
      if (seatId == null) return;
      joined = { roomId, seatId };
      bindSeatSocket(room, seatId, socket.id);

      broadcastState(io, roomId);
    });

    socket.on(EVT.ROOM_JOIN, ({ roomId, displayName }) => {
      if (!roomId) return;
      const room = ensureRoom(roomId);
      if (roomIsFull(room.state)) return;

      socket.join(roomId);
      room.sockets.add(socket.id);

      const seatId = addPlayer(room.state, displayName);
      if (seatId == null) return;
      joined = { roomId, seatId };
      bindSeatSocket(room, seatId, socket.id);

      broadcastState(io, roomId);
    });

    socket.on(EVT.ROOM_REJOIN, ({ roomId, seatId, displayName }) => {
      if (!roomId) return;
      const room = ensureRoom(roomId);

      socket.join(roomId);
      room.sockets.add(socket.id);

      let resolvedSeatId = null;

      const bySeat = room.state.players.find((p) => p.seatId === seatId);
      if (bySeat) {
        resolvedSeatId = bySeat.seatId;
        const nm = normName(displayName);
        if (nm && bySeat.name !== nm) bySeat.name = nm;
      } else {
        const nm = normName(displayName);
        const byName = room.state.players.find((p) => p.name === nm);
        if (byName) resolvedSeatId = byName.seatId;
      }

      if (resolvedSeatId == null) {
        if (roomIsFull(room.state)) return;
        resolvedSeatId = addPlayer(room.state, displayName || "Player");
        if (resolvedSeatId == null) return;
      }

      joined = { roomId, seatId: resolvedSeatId };
      bindSeatSocket(room, resolvedSeatId, socket.id);
      broadcastState(io, roomId);
    });

    // Manual scoring
    socket.on(EVT.PEG_ADD, ({ roomId, seatId, delta }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      const p = room.state.players.find((p) => p.seatId === seatId);
      if (!p) return;
      const n = Number(delta) || 0;
      p.score += n;
      broadcastState(io, roomId);
    });

    // NEW: dealer starts a deal → private hands to each seat
    socket.on(EVT.HOST_DEAL, ({ roomId }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      // must be dealer
      const dealer = room.state.dealerSeat ?? 0;
      if (joined.seatId !== dealer) return;

      // build & shuffle deck
      const deck = shuffle(createDeck());

      // deal 6 to each player present
      room.hands.clear();
      for (const p of room.state.players) {
        const hand = deck.splice(0, 6).map(cardText);
        room.hands.set(p.seatId, hand);

        // send privately to all sockets bound to that seat
        const set = room.seatSockets.get(p.seatId);
        if (set && set.size) {
          for (const sid of set) {
            io.to(sid).emit(EVT.HAND_YOUR, { cards: hand });
          }
        }
      }

      // For now, no public state change is broadcast (hands are private).
      // Optionally, you could broadcast a toast or "phase change" later.
    });

    socket.on("disconnect", () => {
      console.log("❌ user disconnected:", socket.id);
      if (joined.roomId) {
        const room = rooms.get(joined.roomId);
        if (room) {
          room.sockets.delete(socket.id);
          unbindSocket(room, socket.id);
          // MVP: keep players; no auto-remove
        }
      }
    });
  });
}

module.exports = { registerSocket };
