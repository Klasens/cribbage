// server/sockets/room.js
const { EVT } = require("../../shared/protocol");
const {
  ensureRoom,
  bindSeatSocket,
  broadcastState,
  normName,
  roomIsFull,
  addPlayer,
} = require("../rooms");

function handleJoin(io, socket, joined, roomId, displayName) {
  if (!roomId) return;
  const room = ensureRoom(roomId);
  if (roomIsFull(room.state)) return;

  socket.join(roomId);
  room.sockets.add(socket.id);

  const seatId = addPlayer(room.state, displayName);
  if (seatId == null) return;

  joined.roomId = roomId;
  joined.seatId = seatId;
  bindSeatSocket(room, seatId, socket.id);

  broadcastState(io, roomId);
}

function register(io, socket, joined) {
  socket.on(EVT.ROOM_CREATE, ({ roomId, displayName }) => {
    handleJoin(io, socket, joined, roomId, displayName);
  });

  socket.on(EVT.ROOM_JOIN, ({ roomId, displayName }) => {
    handleJoin(io, socket, joined, roomId, displayName);
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

    joined.roomId = roomId;
    joined.seatId = resolvedSeatId;
    bindSeatSocket(room, resolvedSeatId, socket.id);
    broadcastState(io, roomId);
  });
}

module.exports = { register };  // ⬅️ critical

