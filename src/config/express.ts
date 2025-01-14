export const expressConfig = {
  port: process.env.PORT || 8080,
  passkey: process.env.PASSKEY,
  corsAllowedOrigins: [
    process.env.CORS_ORIGIN_STAG,
    process.env.CORS_ORIGIN_PROD,
    process.env.CORS_ORIGIN_LOCAL,
  ],
};

export const databaseConfig = {
  uri: process.env.DATABASE_URI,
};
