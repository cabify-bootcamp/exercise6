const http = require("http");

const sendMessage = require("./sendMessage");
const uuidv4 = require('uuid/v4')

var Queue = require('bull');


module.exports = function(req, res) {

    let uuid = uuidv4();
    let messageObj = req.body;
    messageObj.uuid = uuid;

    const messageQueue = new Queue('message queue');

    messageQueue.add(messageObj).then( () => res.status(200).send(`Message send successfully, you can check the your message status using /messages/${uuid}/status`))

    messageQueue.process(async (job, data) => {

        await sendMessage({...messageObj, status: "PROCESSING"})

    })


};


