const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected");
    server.listen(5000, () => console.log("Server running on port 5000"));
});

// Real-time Socket.IO
io.on('connection', (socket) => {
    console.log("User connected:", socket.id);
    socket.on('update_task', (data) => {
        socket.broadcast.emit('task_updated', data);
    });
});
