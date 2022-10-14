const express = require('express')
const bodyParser = require('body-parser');
const amqp = require('amqplib/callback_api');
const PORT = 3000;
const HOST = '0.0.0.0';
const AMQP_URL = 'amqp://rabbitmq'
const QUEUE_NAME = 'node_queue'

const app = express()
app.use(bodyParser.json());

app.post('/message', (req, res) => {
    amqp.connect(AMQP_URL, (err, conn) => {
        if (err) {
            console.error(err)
        }
        console.log(req.body)
        const { message } = req.body

        conn.createChannel((err, ch) => {
            if (err) {
                console.error(err)
            }

            ch.assertQueue(QUEUE_NAME, { durable: false })
            ch.sendToQueue(QUEUE_NAME, new Buffer(message))
            res.json({
                message: `📨 Sent '${message}'`
            })
            // setTimeout(() => {
            //     conn.close()
            //     process.exit(0)
            // }, 500)
        })
    })
})


amqp.connect(AMQP_URL, (err, conn) => {
    // Create channel
    conn.createChannel((err, ch) => {
        // Declare the queue
        ch.assertQueue(QUEUE_NAME, { durable: false })

        // Wait for Queue Messages
        console.log(` [⌛] Waiting for messages in ${QUEUE_NAME}. To exit press CTRL+C`)
        ch.consume(QUEUE_NAME, msg => {
            console.log(` ✅ Received ${msg.content.toString()}`)
        }, { noAck: true }
        )
    })
})


app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
