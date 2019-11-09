const express = require('express');
const app = express();

module.exports = {
    $on: () => {
        app.use('/',express.static('./public/'));
        app.listen(8080);
    }
}