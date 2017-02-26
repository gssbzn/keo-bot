# Kudos Bot

A test Slack bot that counts kudos to your team mates.

![download](https://cloud.githubusercontent.com/assets/461027/23308099/e546ca48-faa1-11e6-9006-73598d5f5f4b.png)

## Requirements
- [Node.js](http://nodejs.org/)
- [MongoDB](https://www.mongodb.org/)

## Configuration and usage

You may need to setup the following environment variables:
- `SLACK_TOKEN` Slack bot authentication token.
- `KUDOS_WORD` The word you wish to use to congratulate your team mates.
- `LOCALE` Locale for messages to and from the bot, defaults to english (en) if none is given

### Running Locally

```sh
$ git clone https://github.com/gssbzn/kudos-bot # or clone your own fork
$ cd kudos-bot
$ npm install
$ npm start
```

## Contributing

1. Fork it ( https://github.com/gssbzn/kudos-bot/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## License

MIT License. Copyright 2017 Gustavo Bazan. http://gustavobazan.com
