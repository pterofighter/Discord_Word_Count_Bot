const Discord = require('discord.js');

//my token is stored in a file called config, you could just make your token constant to your own
const { token }  = require('./config.json');
//prefix for calling in bot commands 
const prefix = '!';
const bot = new Discord.Client();
bot.login(token);

//insert bad words into this list, so the bot can point out when someone says it and kicks them if kick is enable
var badWords = ["badword"];
var kickEnabled = true;
//displays bot is online into the console when you turn on the bot
bot.once('ready', () => {
    console.log("Bot is now online");
});

//calls this whenever someone sends a message in the discord
bot.on('message', msg =>
{

    //splits the msg into an array by space and makes them all lower case
    let inputMsg = msg.content.toLowerCase().split(" ");
    //this is just the recived message in string form 
    let theMsg = msg.content.toLowerCase();

    if (theMsg.startsWith(prefix))
    {
        //inp will be an array of the message without the prefix at the start
        let inp = msg.content.substring(prefix.length).split(" ");
        //the input to trigger this would be !wordCount toCountWord @personToCount
        if (inp[0] === 'wordCount')
        {
            let toCountWord = inp[1];
            //the person to count will be the person mentioned with an @insertPersonHere
            let personToCount = msg.mentions.members.first();
            msg.channel.messages.fetch().then(messages =>
            {
                //stores their messages into an array
                var count = 0
                messages = messages.filter(m => m.author.id === personToCount.id).array()
                for (i = 0;i < messages.length; i++)
                {
                    if (messages[i].content.toLowerCase().includes(toCountWord))
                    {
                        count++;
                    }
                }

                msg.channel.send("that person has said " + toCountWord + " " + count + " times");
            })

        }

    }
    //if the user is not calling a bot command then it checks if the message recieved contains any bad words
    //and kicks the person who sent it if kick is enabled
    else if (!msg.author.bot)
    {
        for (i = 0; i < badWords.length;i++)
        {
            if(inputMsg.includes(badWords[i]))
            {
                msg.channel.send(msg.author.username + " Do not say that!");
                if (kickEnabled)
                {
                    msg.member.kick("You said a bad word");
                }
                break;
            }
        }
    }

})
