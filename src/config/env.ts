export const Env = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongodbUri: process.env.MONGODB_URI ?? '',
  apiUrl: process.env.API_URL ?? '',
  glpiToken: process.env.GLPI_APP_TOKEN ?? '',
};
