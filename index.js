const { registerJoystreamTypes } = require('@joystream/types');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather
const token = 'token';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
//get chat id here https://stackoverflow.com/questions/32423837/telegram-bot-how-to-get-a-group-chat-id
const chatid = 'chatid';

async function main () {
  // register types before creating the api
  registerJoystreamTypes();
  // Create the API and wait until ready
  const api = await ApiPromise.create({
    provider: new WsProvider('ws://127.0.0.1:9944') 
    });

    //set lastnotification sent by bot    
  let lastnotif = 227;

  //subscribing to new heads of the chain
  const unsubscribe = await api.rpc.chain.subscribeNewHeads(async (header) => {
  //query nextPostId
  let nextpostid = await api.query.forum.nextPostId()
  //latest post id
  let currentpostid = nextpostid.toNumber()-1

  //monitor block
  let block = header.number.toNumber()
  console.log('Block now is at',block, 'Latest post id is',currentpostid)
  if (currentpostid>lastnotif) {
    console.log(currentpostid-lastnotif, ' new posts');
	  let newpost = []
    for (lastnotif+1; lastnotif<currentpostid; lastnotif++) {
      //begin chaining query info
      let postbyid = await api.query.forum.postById(lastnotif+1)
      let message = postbyid.current_text
      let excerpt = message.substring(0,100)
      let currentthreadid = postbyid.thread_id.toNumber()
      let authoraddress = postbyid.author_id.toJSON()
      let member = await api.query.members.memberIdsByRootAccountId(authoraddress)
      let rawmemberid = member[0].toNumber()
      let memberprofile = await api.query.members.memberProfile(rawmemberid)
      let handler = memberprofile.raw.handle.toJSON() 
	  	newpost.push(`🤩 <b>New post (id:${lastnotif+1}) by ${handler} at:</b> https://testnet.joystream.org/#/forum/threads/${currentthreadid} <i> \r\n"${excerpt}..."</i>`)
      }
	console.log(newpost.join("\r\n\r\n"))
	bot.sendMessage(chatid, newpost.join("\r\n\r\n"), { parse_mode: 'HTML' })
    lastnotif=currentpostid
  }
      
  });
}

main()