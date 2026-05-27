const mineflayer = require('mineflayer')
const fs = require('fs')

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
        console.log('Bot joined the server!')
    })

    bot.on('spawn', () => {
        console.log('Bot spawned!')
    })

    bot.on('end', () => {
        console.log('Disconnected. Reconnecting in 5 seconds...')

        setTimeout(() => {
            startBot()
        }, 5000)
    })

    bot.on('kicked', (reason) => {
        console.log('Kicked:', reason)
    })

    bot.on('error', (err) => {
        console.log('Error:', err)
    })

    setInterval(() => {

        if (!bot.entity) return

        const actions = [
            'forward',
            'back',
            'left',
            'right'
        ]

        const action =
            actions[Math.floor(Math.random() * actions.length)]

        bot.setControlState(action, true)

        setTimeout(() => {
            bot.setControlState(action, false)
        }, 2000)

    }, 30000)
}

startBot()
