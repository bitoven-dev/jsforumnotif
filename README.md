# Joystream Forum Post Notification Tool

Many thanks to [imOnlineMonitor](https://github.com/fkbenjamin/imOnlineMonitor) for providing example with polkadot chain (Kusama).
This script will notify any new post on [Joystream forum](https://testnet.joystream.org/#/forum/) to Telegram group/channel/chat of your choice.
Current demo is https://t.me/jsforumnotification

## Getting Started
### Requirements

1. [Joystream Node](https://github.com/Joystream/helpdesk/tree/master/roles/validators#instructions)
2. [Yarn and Nodejs](https://github.com/Joystream/helpdesk/tree/master/roles/storage-providers#install-yarn-and-node-on-linux)

### Run
1. 
   ```
   git clone https://github.com/bitoven-dev/jsforumnotif
   cd jsforumnotif
   yarn install
   ```
2. Replace `yourtoken` with your Telgram bot token. You can get it by talking to @botfather 
   `const token = 'yourtoken';`
You can edit fast using sed (change yourowntoken)
`sed -i -e 's/yourtoken/yourowntoken/g' index.js`

3. Replace `yourchatid` with your group/channel the bot will notify into. [How to get chatid](https://stackoverflow.com/questions/32423837/telegram-bot-how-to-get-a-group-chat-id)
    `const chatid = 'yourchatid';`
You can edit fast using sed (change yourownchatid)
`sed -i -e 's/yourchatid/yourownchatid/g' index.js`

4. Optional. Change `let lastnotif = 242;`. Don't put it too far from current post id.
5. Run `node index.js`
### Notes

I've just started to learn JS, so any suggestion or PR is greatly appreciated 😁