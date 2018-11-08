const http = require("http");

const sendMessage = require("./sendMessage");
const uuidv4 = require('uuid/v4')

var Queue = require('bull');



const messageQueue = new Queue('messageQueue');

const queueMessage = function(req, res, next) {

    let uuid = uuidv4();
    let messageObj = req.body;
    messageObj.uuid = uuid;

    return messageQueue.add(messageObj).then( () => res.status(200).send(`Message send successfully, you can check the your message status using /messages/${uuid}/status`))

}

messageQueue.process(async (job, done) => {
    await sendMessage({...job.data, status: "PROCESSING"})
    done()
    
})

messageQueue.on('completed', (job, result) => {
    console.log(`Job completed with result ${result}`);
  })

messageQueue.on('active', function (job, jobPromise) {
    console.log('New worker started a job');
});

messageQueue.on('drained', function () {
    console.log('Job queue is currently empty');
});

module.exports = { queueMessage }
