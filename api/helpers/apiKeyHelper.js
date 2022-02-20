const {spawn} = require('child_process');

module.exports = {
    async generateAPIKey() {
        return new Promise((resolve, reject) => {
            var apiKey = '';
            const python = spawn('python', ['crawler.py']);
            // collect data from script
            python.stdout.on('data', function (data) {
                console.log('Pipe data from python script ...');
                apiKey = data.toString();
                apiKey = apiKey.split(':')[1].trim();
                resolve(apiKey);
            });
        });
    }
}
