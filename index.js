const mineflayer = require('mineflayer')
const cmd = require('mineflayer-cmd').plugin
const fs = require('fs');
let rawdata = fs.readFileSync('config.json');
let data = JSON.parse(rawdata);
let lasttime = -1;
let moving = 0;
let connected = 0;
let actions = [ 'forward', 'back', 'left', 'right']
let lastaction;
let pi = Math.PI;
let moveinterval = 2; // 2 second movement interval
let maxrandom = 5; // 0-5 seconds added to movement interval (randomly)
let host = data["ip"];
let username = data["name"]
let nightskip = data["auto-night-skip"]

const bot = mineflayer.createBot({
  host: host,
  username: username
});

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

bot.loadPlugin(cmd)

bot.on('login', function() {
	console.log("Logged In")
	bot.chat("hello");
});

bot.on('time', function(time) {
	if (nightskip == "true") {
	if (bot.time.timeOfDay >= 13000) {
	bot.chat('/time set day')
	}}
    if (connected <1) {
        return;
    }
    if (lasttime<0) {
        lasttime = bot.time.age;
    } else {
        let randomadd = Math.random() * maxrandom * 20;
        let interval = moveinterval * 20 + randomadd;
        if (bot.time.age - lasttime > interval) {
            if (moving == 1) {
                bot.setControlState(lastaction,false);
                moving = 0;
                lasttime = bot.time.age;
            } else {
                let yaw = Math.random() * pi - (0.5 * pi);
                let pitch = Math.random() * pi - (0.5 * pi);
                bot.look(yaw,pitch,false);
                lastaction = actions[Math.floor(Math.random() * actions.length)];
                bot.setControlState(lastaction,true);
                moving = 1;
                lasttime = bot.time.age;
                bot.activateItem();
            }
        }
    }
});

bot.on('spawn',function() {
    connected=1;
});

bot.on('death',function() {
    bot.emit("respawn")
});