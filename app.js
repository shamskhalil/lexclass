const express = require('express');
const server = express();

let count = 0;

server.get('/audio', (req, res) => {
    res.send(`Take your audio ${count}`);
})

server.use(express.static(__dirname + "/www"));


server.use((req, res, next) => {
    count++;
    if (count > 5) {
        res.send('Sorry u ran out of Trials! pls try again tomorrow ' + count);
    } else {
        next();
    }
})

server.get('/video', (req, res) => {

    res.send(`Take your video ${count}`);
})

server.get('*', (req, res) => {
    res.send('You requested for global resource ' + count);
})


server.listen(3000, () => {
    console.log('Server listening on port 3000')
});