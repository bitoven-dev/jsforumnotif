const { registerJoystreamTypes } = require('@joystream/types');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather (talk to him to get the token 😁 )
const token = 'yourtoken';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
//get chat id here https://stackoverflow.com/questions/32423837/telegram-bot-how-to-get-a-group-chat-id
const chatid = 'yourchatid';

async function main () {
  // register types before creating the api
  registerJoystreamTypes();
  // Create the API and wait until ready
  const api = await ApiPromise.create({
    provider: new WsProvider() 
    });

    //set (initial) lastnotification sent by bot, set it to near current PostID   
    let lastnotif = 242;

    //subscribing to new heads of the chain
    const unsubscribe = await api.rpc.chain.subscribeNewHeads(async (header) => {
    //query nextPostId
    const nextpostid = await api.query.forum.nextPostId()
    //latest/current post id
    const currentpostid = nextpostid.toNumber()-1
    //monitor block
    const block = header.number.toNumber()
    console.log('Block now is at',block, 'Latest post id is',currentpostid)
	
	//doing check to notify telegram or not
    if (currentpostid>lastnotif) {
		console.log(currentpostid-lastnotif, ' new posts')
		//group the message to not send it per post
		const newpost = []
		//loop notification for every new post published since lasnotif
		for (lastnotif+1; lastnotif<currentpostid; lastnotif++) {
			//begin chaining query info
			const postbyid = await api.query.forum.postById(lastnotif+1)
			const message = postbyid.current_text
			//limit characters for message on telegram
			const excerpt = message.substring(0,100)
			const currentthreadid = postbyid.thread_id.toNumber()
			const threadtitleid = await api.query.forum.threadById(currentthreadid)
			const threadtitle = threadtitleid.title
			const authoraddress = postbyid.author_id.toJSON()
			const member = await api.query.members.memberIdsByRootAccountId(authoraddress)
			const rawmemberid = member[0].toNumber()
			const memberprofile = await api.query.members.memberProfile(rawmemberid)
			const handler = memberprofile.raw.handle.toJSON()
			console.log('Notify post',lastnotif+1, 'to Telegram')
			//sent to array			
			newpost.push(`🤩<b> New post (id:${lastnotif+1}) by ${handler} at:\r\n<a href="https://testnet.joystream.org/#/forum/threads/${currentthreadid}">"${threadtitle}"</a></b><i>\r\n"${excerpt}..."</i>\r\n`)
			}
		//console.log(newpost.join("\r\n\r\n"))
		bot.sendMessage(chatid, newpost.join("\r\n\r\n"), { parse_mode: 'html' })
		//update lastnotif
		lastnotif=currentpostid
		}
		  
	});
}



main()