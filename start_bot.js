/**
 * Created by Kyle Flynn on 6/14/2016.
 */
"use strict";

var Discord = require("discord.js");
var FS = require("fs");

var mybot = new Discord.Client();
var self = this;

mybot.on("ready", function() {
    mybot.setStatus("online", "League of Legends", self.logError);
});

mybot.on("message", function(message) {
    if (message.author.voiceChannel != null) {

        if (message.content.startsWith(".")) {
            if (message.content.indexOf(" ") > 0) {
                var cmd = message.content.split(" ");

                if (cmd[0] == ".meme") {
                    var clip = "sounds/" + cmd[1] + ".flac";
                    FS.access(clip, function (err) {
                        if (err && err.code === 'ENOENT') {
                            mybot.reply(message.channel, "Error finding meme clip");
                        } else {
                            mybot.joinVoiceChannel(message.author.voiceChannel, function (error, voiceConnection) {
                                if (!error) {
                                    voiceConnection.setVolume(1.0);
                                    voiceConnection.playFile(clip, 2.0, function (error, intent) {
                                        if (!error) {
                                            intent.on("end", function () {
                                                mybot.leaveVoiceChannel(voiceConnection.voiceChannel, self.logError);
                                            });
                                        }
                                    });
                                } else {
                                    mybot.reply(message.channel, "SHIT");
                                }
                            });
                        }
                    });
                } else {
                    // Did not recognize the command
                    mybot.reply(message.channel, "Unrecognized command");
                }

            } else if (message.content == ".stop") {
                if (mybot.internal.voiceConnection) {
                    mybot.internal.voiceConnection.stopPlaying();
                }
            } else if (message.content == ".memebox") {
                FS.readdir("sounds/", function(err, files) {
                    if (!err) {
                        var clips = "";
                        for (var i = 0; i < files.length; i++) {
                            if (i + 1 == files.length) {
                                clips = clips + files[i].replace(".mp3", "");
                            } else {
                                clips = clips + files[i].replace(".mp3", "") + ", ";
                            }
                        }
                        mybot.sendMessage(message.channel, "Available clips: [" + clips + "]");
                    }
                });
            } else if (message.content == ".rtd") {
                var num = Math.floor((Math.random() * 6) + 1);
                mybot.sendMessage(message.channel, "You rolled a " + num);
            } else if (message.content == ".help") {
                mybot.sendMessage(message.channel, "--------------------COMMANDS--------------------");
                mybot.sendMessage(message.channel, ".meme [clip] -- plays the specified clip, if it exists");
                mybot.sendMessage(message.channel, ".stop -- stops any sound coming from the bot");
                mybot.sendMessage(message.channel, ".memebox -- shows a list of what's inside the memebox");
                mybot.sendMessage(message.channel, ".rtd -- roll the dice!");
                mybot.sendMessage(message.channel, "--------------------COMMANDS--------------------");
            } else {
                // Did not recognize the command
                mybot.reply(message.channel, "Unrecognized command");
            }
        }

        if (message.content === "ping") {
            mybot.reply(message.channel, "NOPE");
        }
    }
});

function logError(error) {
    if (error) {
        console.log(error);
    }
}

mybot.loginWithToken("MTkyMDg3ODM2ODMxMzgzNTUy.CkD4-g.J4vRntgRQYbUKARHlBJMmR3y9x8");