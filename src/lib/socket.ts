import type { Server as SocketIOServer } from "socket.io";

const globalForIO = globalThis as unknown as { io: SocketIOServer | undefined };

export function setIO(server: SocketIOServer) {
  globalForIO.io = server;
}

export function getIO(): SocketIOServer | null {
  return globalForIO.io ?? null;
}

export function emitOwnerEvent(event: string, payload: unknown) {
  if (!globalForIO.io) {
    console.warn(`[socket] emit skipped, io not ready: ${event}`);
    return;
  }
  globalForIO.io.emit(event, payload);
}
