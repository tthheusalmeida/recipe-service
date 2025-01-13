export const expressConfig = {
  port: process.env.PORT || 8080,
  passkey: process.env.PASSKEY,
  corsOriginStag: process.env.CORS_ORIGIN_STAG,
  corsOriginProd: process.env.CORS_ORIGIN_PROD,
};

export const databaseConfig = {
  uri: process.env.DATABASE_URI,
};
