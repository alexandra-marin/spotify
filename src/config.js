import path from 'path';

/**
 * Default config for all environment types
 * @type {{db: string, apiPort: number}}
 */
const defaultConfig = {
  db: 'mongodb://localhost:27017/songs',
  realMongo: true,
  apiPort: 3000,
  fileUpload: {
    storage: '/tmp',
    maxSize: 50 * 1024 * 1024
  }
};

/**
 * Enviroment specific configuration
 * @type {{prod: {}, dev: {}, test: {apiPort: number}}}
 */
const envConfig = {
  prod: {},
  dev: {},
  test: {
    apiPort: 3100,
    realMongo: false
  },
  testRealMongo: {
    apiPort: 3100,
    fileStorage: '.'
  }
};

/**
 * Loads config based on the current environment
 * @returns {*}
 */
function loadConfig() {
  const env = process.env.NODE_ENV || 'dev';

  if (!envConfig[env]) {
    throw new Error(
      `Environment config for environment '${env}' not found. process.env.NODE_ENV must be one of '${Object.keys(
        envConfig
      )}'`
    );
  }
  console.log('[INFO] config loaded for environment: ', env);

  // merge default config with environment specific config
  const myConfig = Object.assign({}, defaultConfig, envConfig[env]);
  if (myConfig.fileUpload.storage.indexOf('/')) {
    myConfig.fileUpload.storage = path.resolve(__dirname, myConfig.fileUpload.storage);
  }
  return myConfig;
}

export default loadConfig();
