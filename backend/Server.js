const app = require('express')();
const http = require('http').createServer(app);
const PORT = 3001;
const io = require('socket.io')(http);
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const qs = require('qs')
let id
const STATIC_CHANNEL = {
    name: 'Global chat',
    participants: 0,
    id: 1,
};

function randomColor() {
    return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});


http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

io.on('connection', (socket) => {
    socket.emit('connection', null);
    STATIC_CHANNEL.participants++;

    socket.on('send-message', async (message, userid) => {
        console.log('Message received', message, userid)
        const main = async (message, user) => {
            return await find(message, user)
        }
        const find = async (message, user) => {
            id = await prisma.user.findMany({
                where: {
                    id: user
                }
            })
            let time = new Date()
            await prisma.messages.create({
                data: {
                    text: message,
                    userId: user,
                    created: time
                }
            })
            return time
        }
        const time = await main(message, userid)
        io.emit('message', await message, await time);
    });

    socket.on('change-user', async message => {
        const main = async (message) => {
            return await find(message)
        }
        const find = async (message) => {
            let query
            query = await prisma.user.findMany({
                where: {
                    username: message
                }
            })
            if (Array.isArray(query) && query.length === 0) {
                const color = randomColor()
                await prisma.user.create({
                    data: {
                        username: message,
                        color: color
                    }
                })
                query = await prisma.user.findMany({
                    where: {
                        username: message
                    }
                })
            }
            return query
        };
        const user = await main(message)
        console.log('User changed to', user)
        io.emit('current-user', await user)
    })

    socket.on('disconnect', () => {
        STATIC_CHANNEL.participants--;
    });
})

app.get('/getChannels', (req, res) => {
    res.json({
        STATIC_CHANNEL
    })
});