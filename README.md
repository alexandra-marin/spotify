## Getting Started

Backend kata using ExpressJS. Stores songs on a local directory and uses Mongo to save song metadata. Exposes REST API to create, read and delete metadata and to upload binary content. 


### :wave: Clone project & install dependencies
```bash
$ git clone git@github.com:alexandra-marin/spotify.git
$ cd spotify
$ npm install
```

### :bike: Run
Build and run locally (default port is 3000)
```bash
$ npm run build
$ node build/server.js
```

### :muscle: Test
Tests are created with Mocha, Chai and mongo-unit. NYC reports code coverage.

```bash
$ npm test
$ npm run coverage
```

### :floppy_disk: Storage
We use Mongo to store metadata and a configurable folder to store songs.
You can configure the connection and the local path in for each environment in `src/config.js`.

### :dizzy: Improvements:
- add minifier to reduce bundle size
- find a better way to import folders and subfolders
- add CI/CD
- add static analysis tool and reporter
- replace content api with static server (e.g. nginX)
