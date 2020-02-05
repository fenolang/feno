const path = require('path');

// RUTAS PUBLIC
let public_dist: string = "";
let public_dev: string = "./public/";

let env: string = "";

function detectEnv(): void {
    if (process.env.FENO_ENV)
        env = process.env.FENO_ENV;
    else
        env = "dev"
}


export function getPublic() {
    detectEnv();
    if (env == "dev") {
        public_dist = path.join(path.dirname(require.resolve('feno')), '/public/');
        return public_dist;
    } else
        return public_dev;
}

export {}