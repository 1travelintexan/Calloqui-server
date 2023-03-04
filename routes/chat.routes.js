const router = require("express").Router();
const Conversation = require("../models/Conversation.model");
const Message = require("../models/Message.model");

router.post("/conversation", async (req, res) => {
  //The user will send an array of participant ids in the chat (usually just two)
  // eg. participants = ['609b63324f3c1632c8ff35f4', '609b63644f3c1632c8ff35f5']
  const { participants } = req.body;
  try {
    let foundConversation = await Conversation.findOne({
      participants: { $all: participants },
    });
    if (foundConversation) {
      //Conversation between those participants already present
      res.status(200).json(foundConversation);
    } else {
      //Create a conversation between them if not present
      Conversation.create({ participants }).then((response) => {
        res.status(200).json(response);
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// A route to get all messages of a certain conversation
router.get("/messages/:conversationId", async (req, res, next) => {
  const { conversationId } = req.params;
  try {
    const messages = await Message.find({ conversationId }).populate("sender");
    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
