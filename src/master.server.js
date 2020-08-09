const cluster = require('cluster');
const os = require('os');
const numCpus = os.cpus().length;

if (cluster.isMaster) {
    cluster.on('online', (worker) => {
        console.log('Worker with id ', worker.id, ' is now online');
    });
    cluster.on('exit', (worker) => {
        console.log('Worker with id ', worker.id, ' is now Dead');
        cluster.fork();
    });
    for (let i = 0; i < numCpus; i++) {
        cluster.fork();
    }
} else {
    require('./restapi').app;
}

