let flag = true;
let count = 0;

const c = g();
stop();
setInterval(() => {
    console.log(c.next().value);
}, 0);

function stop() {
    setTimeout(() => {
        process.exit(0);
    }, 60000);
}

function* g() {
    while (true) {
        count++;
        yield count;
    }
}

