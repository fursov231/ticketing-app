module.exports = {
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300 // фикс проблемы обнаружения изменения файлов при запуске приложения в контейнере
        return config
    }
}