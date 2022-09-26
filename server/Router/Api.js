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
    const { messageId, sendUser,message } = req.body;
    const Answer = {
      messageId,
      sendUser,
      message,
      answerTime: new Date()
    };
    const insertedId = await AddAnswer(Answer);
    const Answers = await GetAnswerById(Answer.messageId);
    io.emit("answer-added", Answers);
    res.status(200).send("ok");
  } catch (err) {
    console.log(err);
  }
});

function AddAnswer(Message) {
  return new Promise((resolve, reject) => {
    const sqlString =
      "INSERT INTO table_answers(messageId,sendUser,message,answerTime) VALUES(?,?,?,?)";
    database.query(
      sqlString,
      [Message.messageId, Message.sendUser,Message.message, Message.answerTime],
      (err, result, field) => {
        if(err) console.log(err)
        resolve(result);
      }
    );
  });
}

router.get("/getAnswer/:id", async (req, res) => {
  try {
    const messageId = req.params.id;
    const answers = await GetAnswerById(messageId);
    res.status(200).send(answers);
  } catch (err) {
    console.log(err);
  }
});

function GetAnswerById(messageId) {
  return new Promise((resolve, reject) => {
    const sqlString = "SELECT * FROM table_answers WHERE messageId = ?";
    database.query(sqlString,messageId, (err, result, field) => {
      resolve(result);
    });
  });
}


module.exports = router;
