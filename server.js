const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public")); // Раздача клиентских файлов

// Храним всех подключенных клиентов
const clients = new Set();

wss.on("connection", (ws) => {
    console.log("Новый пользователь подключился");
    clients.add(ws);

    ws.on("message", (message) => {
        console.log("Получено сообщение:", message);

        // Рассылаем сообщение всем подключенным клиентам
        for (let client of clients) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        }
    });

    ws.on("close", () => {
        console.log("Пользователь отключился");
        clients.delete(ws);
    });
});

server.listen(3000, () => {
    console.log("Сервер запущен на http://localhost:3000");
});
