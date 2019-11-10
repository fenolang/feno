const express = require('express');
const path = require('path');
const app = express();

module.exports = {
    $on: () => {
        app.use('/',express.static(
            /*'./public/',*/
            path.join(path.dirname(require.resolve('graphtml')),`/public/`)
        ));
        app.listen(8080);
    }
}

export {}