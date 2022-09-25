const express = require("express");
const io = require("../index");
const router = express.Router();
const database = require("../SQL/sqlconnector");
router.get("/", (req, res) => {
  res.send("hello route");
});

router.get("/getusers", async (req, res) => {
  try {
    const users = await GetUsers();
    res.send(users);
  } catch (err) {
    console.log(err);
  }
});

router.post("/addUser", async (req, res) => {
  try {
    const { username } = req.body;
    const insertedId = await Add(username);
    res.status(200).send("ok");
  } catch (err) {
    console.log(err);
  }
});

function Add(username) {
  return new Promise((resolve, reject) => {
    const sqlString = "INSERT IGNORE INTO user(user_name) VALUES(?)";
    database.query(sqlString, username, (err, result, field) => {
      resolve(result);
    });
  });
}

function GetUsers() {
  return new Promise((resolve, reject) => {
    const sqlString = "SELECT * FROM user";
    database.query(sqlString, (err, result, field) => {
      resolve(result);
    });
  });
}
router.post("/addMessage", async (req, res) => {
  try {
    const { toUser, fromUser, messageTitle, messageText } = req.body;
    const user = {
      toUser,
      fromUser,
      messageTitle,
      messageText,
    };
    const insertedId = await AddMessage(user);
    const messages = await GetAllMessages();
    io.emit("message-added", messages);
    res.status(200).send("ok");
  } catch (err) {
    console.log(err);
  }
});

function AddMessage(User) {
  return new Promise((resolve, reject) => {
    const sqlString =
      "INSERT INTO messages(ToUser,FromUser,MessageTittle,MessageText) VALUES(?,?,?,?)";
    database.query(
      sqlString,
      [User.toUser, User.fromUser, User.messageTitle, User.messageText],
      (err, result, field) => {
        resolve(result);
      }
    );
  });
}

router.get("/getAllMessages", async (req, res) => {
  try {
    const messages = await GetAllMessages();
    res.status(200).send(messages);
  } catch (err) {
    console.log(err);
  }
});

function GetAllMessages() {
  return new Promise((resolve, reject) => {
    const sqlString = "SELECT * FROM messages";
    database.query(sqlString, (err, result, field) => {
      resolve(result);
    });
  });
}

router.post("/addAnswer", async (req, res) => {
  try {
    const { messageId, sendUser, answerTime } = req.body;
    const message = {
      messageId,
      sendUser,
      answerTime,
    };
    const insertedId = await AddAnswer(message);
    res.status(200).send("ok");
  } catch (err) {
    console.log(err);
  }
});

function AddAnswer(Message) {
  return new Promise((resolve, reject) => {
    const sqlString =
      "INSERT INTO messages(messageId,sendUser,answerTime) VALUES(?,?,?)";
    database.query(
      sqlString,
      [Message.messageId, Message.sendUser, Message.answerTime],
      (err, result, field) => {
        resolve(result);
      }
    );
  });
}

module.exports = router;
