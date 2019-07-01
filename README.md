## Getting Started

### Clone project & install dependencies
```bash
$ git clone git@github.com:alexandra-marin/spotify.git
$ cd spotify
$ npm install
```

### Test
Tests are created with Mocha, Chai and mongo-unit.

```bash
$ npm test
```

### Run
Build and run locally (default port is 3000)
```bash
$ npm run build
$ node build/server.js
```

### Storage
We use Mongo to store metadata and a configurable folder to store songs.
You can overwrite these default settings for each environment in `src/config.js`.

### Improvements:
- add minifier to reduce bundle size
- find better to import folders and subfolders
- add CI/CD
- add static analysis tool
- replace content api with static server (e.g. nginX)