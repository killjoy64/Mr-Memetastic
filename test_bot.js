/**
 * Created by Kyle Flynn on 9/18/2016.
 */

const Discord = require("discord.js");
const FS = require("fs");
const APP = require('./package.json');
const bot = new Discord.Client({

});

bot.on('ready', () => {
    bot.user.setStatus('online', 'TESTING MODE - MAY NOT WORK').then(user => console.log('Bot ready')).catch(console.log);
});

bot.on('message', message => {

    if (message.channel != null && message.content.startsWith(".")) {

        var channel = message.channel;

        //Do commands that require a voice channel
        if (message.content.indexOf(" ") > 0) {
            var cmd = message.content.split(" ");

            if (cmd[0] == ".meme") {
                var clip = "sounds/" + cmd[1] + ".mp3";
                FS.access(clip, function (err) {
                    if (err && err.code === 'ENOENT') {
                        channel.sendMessage("Error finding meme clip");
                    } else {

                        return new Promise((resolve, reject) => {
                            var voiceChannel = message.member.voiceChannel;
                            if (!voiceChannel || voiceChannel.type !== 'voice') {
                                channel.sendMessage(message.author + ' could not join voice channel.');
                            }
                            voiceChannel.join().then(connection => {
                                resolve(connection);

                                let dispatcher = connection.playFile(clip);

                                dispatcher.on('end', () => {
                                    connection.channel.leave();
                                });
                                dispatcher.on('error', err => {
                                    return channel.sendMessage("ERROR FUCK");
                                });

                            }).catch(err => reject(err));
                        });

                    }
                });
            } else {
                channel.sendMessage(message.author + " unrecognized command.");
            }

        } else if (message.content == ".memebox") {
            FS.readdir("sounds/", (err, files) => {
                if (!err) {
                    var clips = "";
                    for (var i = 0; i < files.length; i++) {
                        if (i + 1 == files.length) {
                            clips = clips + files[i].replace(".mp3", "");
                        } else {
                            clips = clips + files[i].replace(".mp3", "") + ", ";
                        }
                    }
                    channel.sendMessage("Available clips: [" + clips + "]");
                }
            });
        } else if (message.content == ".rtd") {
            var num = Math.floor((Math.random() * 6) + 1);
            channel.sendMessage("You rolled a " + num);
        } else if (message.content == ".help") {
            // TODO - add help
        } else if (message.content == ".version") {
            channel.sendMessage("Current bot version: v" + APP.version + ". Type .changelog to see what's new.");
        } else if (message.content == ".changelog") {
            FS.readFile("changelog.log", "utf-8", (err, data) => {
                if (err) {
                    return console.log("Error: " + err);
                } else {
                    let versions = data.split("****");
                    channel.sendMessage(versions[0]);
                }
            });
        } else {
            if (message.author != bot) {
                channel.sendMessage(message.author + " unrecognized command.");
            }
        }
    }

    if (message.content === "ping") {
        channel.sendMessage(message.author + " NOPE!");
    }

});

bot.login("MTkyMDg3ODM2ODMxMzgzNTUy.CkD4-g.J4vRntgRQYbUKARHlBJMmR3y9x8");