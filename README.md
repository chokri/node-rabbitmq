# 📘 RabbitMQ example with Node JS

This example will send and receive message fron Rabbit MQ's Queue and consume it in the same folder.

To run the example just run `docker-compose up --build` and then, use your REST API client to send curl to `message` like this:

``` shell
curl -X POST  http://localhost:3000/message \
    -H 'Content-Type: application/json' \
    -d '{"message":"hello from Terminal"}'
```