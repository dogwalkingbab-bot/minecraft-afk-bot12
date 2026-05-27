const mineflayer = require('mineflayer')
const express = require('express')
const fs = require('fs')

const app = express()

// Render requires a web server on process.env.PORT
const PORT = process.env.PORT || 10000

app.get('/', (req, res) => {
    res.send('Minecraft AFK Bot is running')
})

app.listen(PORT, () => {
    console.log('Web server running on port', PORT)
})

// Load config
const config = JSON.parse(fs.readFileSync('config.json'))

const [host, port] = config.server.split(':')

function startBot() {

    const bot = mineflayer.createBot({
        host: host,
        port: parseInt(port),
        username: config.username,
        auth: 'offline'
    })

    bot.on('login', () => {
        console.log('Bot logged in')
    })

    bot.on('spawn', () => {
        console.log('Bot spawned')
    })

    bot.on('end', () => {
        console.log('Disconnected → reconnecting...')
        setTimeout(startBot, 5000)
    })

    bot.on('kicked', (reason) => {
        console.log('Kicked:', reason)
    })

    bot.on('error', (err) => {
        console.log('Error:', err)
    })

    // Anti-AFK movement
    setInterval(() => {
        if (!bot.entity) return

        const moves = ['forward', 'back', 'left', 'right']
        const move = moves[Math.floor(Math.random() * moves.length)]

        bot.setControlState(move, true)

        setTimeout(() => {
            bot.setControlState(move, false)
        }, 1500)

    }, 30000)
}

startBot()
