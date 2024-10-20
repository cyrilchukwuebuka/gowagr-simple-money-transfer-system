const configuration = () => ({
  app: {
    name: process.env.APP_NAME,
    version: process.env.APP_VERSION,
    port: process.env.APP_PORT || 5000,
  },
  postgres: {
    database: process.env.DATABASE,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    host: process.env.DATABASE_HOST,
    db_name: process.env.DATABASE_DBNAME,
  },
});

export const jwt = {
  secret: 'averylongjsonwebtokensecret', // process.env.JWT_SECRET,
  expire: '60d', // process.env.JWT_EXPIRE,
};

export default configuration;
