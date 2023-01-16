import tmi from 'tmi.js';
import * as generator from './textGenerator.js';

const client = new tmi.Client({
//   options: { debug: true },
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: '',                          //twitch username
    password: "" //https://twitchapps.com/tmi/
  },
  channels: [ '' ]                        // twitch display name
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  if(self || !message.startsWith('!')) {
    return;
  }

  const args = message.slice(1).split(' ');
  const command = args.shift().toLowerCase();


  if(command === 'question' || command === 'gpt3') {
    (async () => {
      const prompt = args.join(' ');
      if (prompt) {
        client.say(channel, `@${tags.username}, ${await (await generator.generate(`${prompt}`)).replace(`${prompt}`, "\n\n")}`); 
      }
    })();
  } 
});