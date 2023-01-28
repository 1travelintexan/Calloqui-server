const app = require("./app");
const PORT = process.env.PORT || 5005;
const SOCKET_PORT = process.env.SOCKET_PORT || 6005;
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});

//---------------------------------------------------------
//---------------------------------------------------------

// //-----------------SOCKET.IO SETUP-------------------------------
// let myServer = app.listen(SOCKET_PORT, () => {
//   console.log(
//     `Socket Server listening on port http://localhost:${SOCKET_PORT}`
//   );
// });

// const { Server } = require("socket.io");
// const io = new Server(myServer, {
//   cors: {
//     origin: "*",
//   },
// });

// //-------------------SOCKET EVENTS -----------------------------

// const MessageModel = require("./models/Message.model");

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });

//   socket.on("join_chat", (data) => {
//     socket.join(data);
//     console.log("User Joined Room: " + data);
//   });

//   socket.on("send_message", async (data) => {
//     const {
//       content: { sender, message },
//       chatId,
//     } = data;
//     let newMessage = {
//       sender: sender,
//       message: message,
//       conversationId: chatId,
//     };

//     // As the conversation happens, keep saving the messages in the DB
//     let newMessageDB = await MessageModel.create(newMessage);
//     let populatedMessage = await MessageModel.findById(
//       newMessageDB._id
//     ).populate("sender");

//     let responseMessage = {
//       sender: {
//         name: populatedMessage.sender.name,
//       },
//       message: populatedMessage.message,
//     };
//     socket.to(data.chatId).emit("receive_message", responseMessage);
//   });
// });

//---------------------------------------------------------------
