export const envConfig = () => ({
    environment: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3000,
    mongoStringConnection: process.env.MONGO_STRING_CONNECTION || 'mongodb://admin:admin@localhost:27017/pokedex?authSource=admin',
});