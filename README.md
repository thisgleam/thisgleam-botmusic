[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/thisgleam/thisgleam-botmusic)

<!-- ![logo](https://repository-images.githubusercontent.com/186841818/8aa95700-7730-11e9-84be-e80f28520325) -->

# 🤖 thisgleam-botmusic (Discord Music Bot)
## Penting

1. Discord Bot Token **[Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)**
2. YouTube Data API v3 Key **[Guide](https://developers.google.com/youtube/v3/getting-started)**  
2.1 **(Optional)** Soundcloud Client ID **[Guide](https://github.com/zackradisic/node-soundcloud-downloader#client-id)**  
2.2 **(Optional)** Spotify Client & Secret ID **[Guide](https://developer.spotify.com/documentation/general/guides/app-settings/)**  
2.3 **(Optional)** Genius Client & Secret ID **[Guide](https://genius.com/api-clients)**
3. Node.js v14.0.0 or newer

## 🚀 Mari Kita Mulai!

Jika menggunakan Heroku pastikan membuat config variables

```
git clone https://github.com/thisgleam/thisgleam-botmusic.git
cd thisgleam-botmusic
npm install
```

Jika sudah kamu bisa memulainya dengan `node index.js` untuk menyalakan bot.

## ⚙️ Pengaturan

Copy atau Rename `config.json.example` menjadi `config.json` dan isi semua yang dibutuhkan:

⚠️ **Jangan pernah bagikan TOKEN mu** ⚠️

```json
{
  "TOKEN": "",
  "YOUTUBE_API_KEY": "",
  "MONGODB_URI": "",
  "SOUNDCLOUD_CLIENT_ID": "",
  "SPOTIFY_CLIENT_ID": "",
  "SPOTIFY_SECRET_ID": "",
  "GENIUS_TOKEN": "",
  "MAX_PLAYLIST_SIZE": 500,
  "PREFIX": "tg!",
  "PRUNING": true,
  "LOCALE": "en",
  "STAY_TIME": 90,
  "DEFAULT_VOLUME": 100,
  "CATEGORYVOICE":  "",
  "CHANNELVOICE":  "",
  "CHANNEL_WELCOME": "",
  "CHANNEL_LEAVE": "",
  "ROLES_WELCOME": ["",""]
}
```

Currently available locales are:
- English (en)

![reactions](https://i.imgur.com/qFZuilB.png)
