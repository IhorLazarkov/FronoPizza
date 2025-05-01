const http = require('http');
const WebSocketServer = require('websocket').server;
const { Order } = require('./db/models');

const app_ws = http.createServer((req, _res) => {
    console.log(`WS Server : ${req.url}`);
});

const ws = new WebSocketServer({ "httpServer": app_ws });

ws.on('request', function (request) {
    let intervalId;

    console.log(`WS Server : ${request.origin}`);

    const connection = request.accept(null, request.origin);

    connection.on('open', function () {
        console.log(`WS Server : ${connection.remoteAddress}`);
    });

    /**
     * @description Update order status every 5 seconds
     * @returns {order_id: number, status: string}
     */
    connection.on('message', function (message) {
        console.log(`WS Server received: ${message.utf8Data}`);
        const msg = JSON.parse(message.utf8Data)
        const order_id = parseInt(msg.order_id)
        if (!order_id) {
            connection.send(`order_id: ${order_id} is invalid`);
            return;
        }
        console.log(`order id: ${order_id}`);

        intervalId = setInterval(async function () {

            const order = await Order.findByPk(order_id);
            connection.send(JSON.stringify({
                order_id: order.id,
                status: order.status
            }));

            //close when  order's ready
            if (order.status === "ready") {
                clearInterval(intervalId);
                connection.close();
            }

            switch (order.status) {
                case "accepted":
                    order.status = "preparing";
                    order.save();
                    break;
                case "preparing":
                    order.status = "in oven";
                    order.save();
                    break;
                case "in oven":
                    order.status = "ready";
                    order.save();
                    break;
                default:
                    connection.send(`order status ${order.status} is not supported`);
                    clearInterval(intervalId);
                    connection.close();
                    break;
            }

        }, 5000);
    });

    connection.on('close', function (reasonCode, description) {
        console.log(`WS Server : ${reasonCode} ${description}`);
        if (intervalId) {
            console.log("Clearing interval");
            clearInterval(intervalId);
        }
    });

    connection.on('error', function (error) {
        console.log(`WS Server : ${error}`);
    });
});

module.exports = app_ws;