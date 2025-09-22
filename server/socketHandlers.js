// server/socketHandlers.js
const { EVT } = require("../shared/protocol");
const {
  rooms,
  ensureRoom,
  broadcastState,
  normName,
  roomIsFull,
  addPlayer,
} = require("./rooms");

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
      broadcastState(io, roomId);
    });

    socket.on(EVT.PEG_ADD, ({ roomId, seatId, delta }) => {
      const room = rooms.get(roomId);
      if (!room) return;
      const p = room.state.players.find((p) => p.seatId === seatId);
      if (!p) return;
      const n = Number(delta) || 0;
      p.score += n;
      broadcastState(io, roomId);
    });

    socket.on("disconnect", () => {
      console.log("❌ user disconnected:", socket.id);
      if (joined.roomId) {
        const room = rooms.get(joined.roomId);
        if (room) {
          room.sockets.delete(socket.id);
          // MVP: keep players in memory; no auto-remove
        }
      }
    });
  });
}

module.exports = { registerSocket };
