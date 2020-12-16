module.exports = {
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300 // Fix issue file change detection when an app is launched in a container
        return config
    }
}