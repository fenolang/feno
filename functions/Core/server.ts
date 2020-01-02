const express = require('express');
const path = require('path');
const app = express();
const { getPublic } = require('../../config/env');

module.exports = {
    $on: () => {
        app.use('/',express.static(
            /*'./public/',*/
            /*path.join(path.dirname(require.resolve('graphtml')),`/public/`)*/
            getPublic()
        ));
        app.listen(8080);
    }
}

export {}