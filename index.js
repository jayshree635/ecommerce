const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('./helpers/global');

const db = require('./config/db.config');
const config = require('./config/config');


app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use('assert', express.static(path.join(__dirname, "public")));


//.............routes.............
const route = require('./routes/index')
app.use('/api/v1/', route)


//.......create server
let server;

if (config.protocol == "https") {
    const https = require('https');
    const options = {
        key: fs.readFileSync(config.sslCertificates.privkey),
        cert: fs.readFileSync(config.sslCertificates.fullchain)
    }
    server = https.createServer(options, app)
} else {
    const http = require('http');
    server = http.createServer(app)
}



server.listen(config.prot, () => {
    console.log(`server running on port ${config.prot}`);
})