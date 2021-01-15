const SERVER = process.env.SERVER_CENTIC || '';
let config = {
    secret: 'clave_super_secreta_para_apiserver' + SERVER,
    SERVER,
    USER_COLLECTION: 'users',
    GAME_COLLECTION: 'games',
    GAME_CONFIGS_COLLECTION: 'game_configs'
};
export default config;
