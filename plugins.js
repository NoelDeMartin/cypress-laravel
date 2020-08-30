const fs = require('fs');

module.exports = (on, config) => {
    on('task', {
        activateCypressEnvFile() {
            if (!fs.existsSync('.env.cypress')) {
                return null;
            }

            fs.renameSync('.env', '.env.backup');
            fs.renameSync('.env.cypress', '.env');

            return null;
        },

        restoreBackupEnvFile() {
            if (!fs.existsSync('.env.backup')) {
                return null;
            }

            fs.renameSync('.env', '.env.cypress');
            fs.renameSync('.env.backup', '.env');

            return null;
        },
    });

    config.laravelPluginsRegistered = true;

    return config;
};
