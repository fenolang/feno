const express = require('express');
const app = express();

module.exports = {
    $on: () => {
        app.use('/',express.static('./app/public/'));
        app.listen(8080);
    }
}