// config should be imported before importing any other file
const config = require('./config/config');
const cluster = require('cluster');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const numCPUs = process.env.NODE_ENV === 'development' ? 1 : require('os').cpus().length;

if(cluster.isMaster ) {
    console.log(`Master ${process.pid} is running`);

    // form workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    /* require cron jobs */
    /* put cron jobs here so they run only once and they are not clustered */
    require('./jobs');

    // server compress images
    (async() => {
        const files = await imagemin(
            ['assets/img/*.jpg'],
            'assets/img',
            {plugins: [imageminMozjpeg({quality: 50})]}
        );
        console.log('files', files);
    })();

    // exit worker
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });

} else {

    const app = require('./config/express');
    console.log(`Worker ${process.pid} started`);

    if (!module.parent) {
        app.listen(config.port, () => {
            console.info(`server started on port ${config.port} (${config.env})`);
        });
    }

    require('./config/mongoose');
    module.exports = app;
}
