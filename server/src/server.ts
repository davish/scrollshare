import { WebSocketServer, WebSocket } from "ws";
import * as UUID from "uuid";

const wss = new WebSocketServer({ port: 8080 });

let connections: Map<string, WebSocket> = new Map();

let rooms = [];

wss.on("connection", (ws, request) => {
  const url = new URL(request.url, "https://example.com/");
  const room = url.searchParams.get("room");
  let id = UUID.v4();
  connections.set(id, ws);
  console.log("opening connection", id);
  ws.on("close", () => {
    console.log("closing connection", id);
    connections.delete(id);
  });
  ws.on("error", console.error);

  ws.on("message", (data) => {
    let message = data.toString();
    console.log("receiving message", { from: id, message });
    connections.forEach((conn, conn_id) => {
      if (conn_id != id) {
        console.log("sending message", { to: conn_id });
        conn.send(message);
      }
    });
  });
});
