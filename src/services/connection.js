import Peer from "peerjs";

const setupConnection = (connection) => {
  connection.on("open", function () {
    // Receive messages
    connection.on("data", function (data) {
      console.log("Received", data);
    });

    // Send messages
    connection.send("Hello!");
  });
};

export const createConnection = (onOpen, onConnection) => {
  const peer = new Peer();
  peer.on("open", function (id) {
    console.log(peer);
    window.history.pushState("", "", `/${id}`);
    onOpen(id);
  });
  peer.on("connection", (conn) => {
    setupConnection(conn);
  });
  return peer;
};

export const getPeerId = () => {
  return window.location.pathname.replace("/", "");
};

export const connectToPeer = () => {
  const peer = new Peer();
  const connectionId = getPeerId();
  if (connectionId) {
    const conn = peer.connect(connectionId);

    setupConnection(conn);
  }
  return peer;
};

export default { createConnection, getPeerId, connectToPeer };
