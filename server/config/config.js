const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  SERVER_URL: Joi.string()
      .default('http://localhost:4050'),
  SERVER_PORT: Joi.number()
    .default(4050),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false)
    }),
  JWT_SECRET: Joi.string().required()
    .description('JWT Secret required to sign'),
  MONGO_HOST: Joi.string().required()
    .description('Mongo DB host url'),
  MONGO_PORT: Joi.number()
    .default(27019)
}).unknown()
  .required();//

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  serverURL: envVars.SERVER_URL,
  port: envVars.SERVER_PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  twitchClientId: envVars.TWITCH_CLIENT_ID || '',
  twitchClientSecret: envVars.TWITCH_CLIENT_SECRET || '',
  twitchBroadcasterId: envVars.BROADCASTER_ID || '',
  twitchScope: envVars.TWITCH_SCOPE ? envVars.TWITCH_SCOPE.split(" ") : ['user_read', 'user:read:email'],
  frontend: envVars.MEAN_FRONTEND || 'angular',
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT
  },
	contactEmail: envVars.CONTACT_EMAIL,
  //firebaseCert:envVars.FIREBASE_CERT_PART_A + envVars.FIREBASE_CERT_PART_B + envVars.FIREBASE_CERT_PART_C + envVars.FIREBASE_CERT_PART_D + envVars.FIREBASE_CERT_PART_E + envVars.FIREBASE_CERT_PART_F
  firebase: {
    type: envVars.FIREBASE_TYPE,
    project_id: envVars.FIREBASE_PROJECT_ID,
    private_key_id: envVars.FIREBASE_PRIVATE_KEY_ID,
    private_key: envVars.FIREBASE_PRIVATE_KEY.split('\\n').concat().join('\n'),
    client_email: envVars.FIREBASE_CLIENT_EMAIL,
    client_id: envVars.FIREBASE_CLIENT_ID,
    auth_uri: envVars.FIREBASE_AUTH_URI,
    token_uri: envVars.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: envVars.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: envVars.FIREBASE_CLIENT_X509_CERT_URL

  }
};

module.exports = config;
