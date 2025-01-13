export const expressConfig = {
  port: process.env.PORT || 8080,
  passkey: process.env.PASSKEY,
};

export const databaseConfig = {
  uri: process.env.DATABASE_URI,
};
