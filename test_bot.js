/**
 * Created by Kyle Flynn on 9/18/2016.
 */
// "use strict";
//
// var Discord = require('discord.js');
// var mybot = new Discord.Client();
//
// mybot.on('ready', () => {
//     mybot.setStatus("online", "TESTING MODE", error => {
//         console.log("Error: "  + error);
//     });
// });
//
// mybot.on('message', message => {
//     if (message.content === 'ping') {
//         message.reply('pong');
//     }
// });

const Discord = require("discord.js");
const FS = require("fs");
const bot = new Discord.Client({
    status: "TESTING - MAY NOT WORK"
});

bot.on('ready', () => {
    console.log("Bot ready");
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
                                voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
                            });

                            // mybot.joinVoiceChannel(message.author.voiceChannel, function (error, voiceConnection) {
                            //     if (!error) {
                            //         voiceConnection.setVolume(1.0);
                            //         voiceConnection.playFile(clip, 2.0, function (error, intent) {
                            //             if (!error) {
                            //                 intent.on("end", function () {
                            //                     mybot.leaveVoiceChannel(voiceConnection.voiceChannel, self.logError);
                            //                 });
                            //             }
                            //         });
                            //     } else {
                            //         mybot.reply(message.channel, "SHIT");
                            //     }
                            // });
                        }
                    });
                } else {
                    channel.sendMessage(message.author + " Unrecognized command.");
                }
            } else {
                // Do commands that don't require a voice channel
                if (message.content == ".memebox") {
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
                } else {
                    if (message.author != bot) {
                        channel.sendMessage(message.author + " Unrecognized command.");
                    }
                }
            }

        } else {
            channel.sendMessage(message.author + " you must be in a voice channel.");
        }

    if (message.content === "ping") {
        channel.sendMessage(message.author + " NOPE!");
    }

});

bot.login("MTkyMDg3ODM2ODMxMzgzNTUy.CkD4-g.J4vRntgRQYbUKARHlBJMmR3y9x8");