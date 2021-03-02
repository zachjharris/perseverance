const config = {}
if (process.env.NODE_ENV == 'production') {
    config.publicPath = 'https://zachjharris.github.io/perseverance/dist';
}
module.exports = dist;