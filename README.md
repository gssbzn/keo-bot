# Kudos Bot

A test Slack bot that counts kudos to your team mates.

## Configuration

Make sure you configure the needed env variables
- TOKEN
  > Slack authentication token.

- KUDOS_WORD
  > The word you wish to use to congratulate your team mates.

- LOCALE
  > Locale for messages from the bot, right now only spanish and english are supported.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and [MongoDB](https://www.mongodb.org/).

```sh
$ git clone https://github.com/gssbzn/kudos-bot # or clone your own fork
$ cd kudos-bot
$ npm install
$ npm start
```

Run it with foreman:

```sh
$ foreman start -f Procfile.dev
```

## Contributing

1. Fork it ( https://github.com/gssbzn/kudos-bot/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## License

MIT License. Copyright 2015 Gustavo Bazan. http://gustavobazan.com
