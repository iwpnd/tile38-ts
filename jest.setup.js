module.exports = () => {
    process.env.TILE38_URI =
        process.env.TILE38_URI || 'redis://localhost:9851/';
    process.env.TILE38_FOLLOWER_URI =
        process.env.TILE38_FOLLOWER_URI || 'redis://localhost:9852/';
};
