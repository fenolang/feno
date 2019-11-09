const path = require('path');
const fse = require('fs-extra');
const Core = require('./main-process');

module.exports = { $Watch: () => {
    /** Obtener archivos de la carpeta de componentes */
    fse.readdir('./src/components',(err:string,files:string[]) => {
        if (err) console.error(err);
        if (files.length) {
            files.forEach(file => {
                var basename:string = path.basename(file, path.extname(file)); // nombre del componente
                /** Leer cada componente */
                fse.readFile(`./src/components/${file}`,'utf8',(err:string,data:string) => {
                    if (err) console.error(err);
                    fse.readdir('./src/scripts',(err:string,sfiles:string[]) => {
                        if (err) console.error(err);
                        sfiles.forEach(sfile => {
                            const basename_script:string = path.basename(sfile, path.extname(sfile));
                            fse.readFile(`./public/${basename_script}.html`,'utf8',(err:string,sdata:string) => {
                                let lines:string[] = sdata.split(/\n/);
                                lines.forEach(async (line) => {
                                    var call:string = line.split('call(').pop().split(')')[0]; // Buscar llamados a componentes
                                    var word:string;
                                    if (/\b(.*?),{(.*?):"(.*?)"(.*?)}/.test(call)) {
                                        let [name,params_group] = call.split(',{');
                                        let old_params:string = `,{${params_group}`;
                                        params_group = params_group.slice(0,-1);
                                        let params:string[] = params_group.split('",');
                                        params.forEach(param => {
                                            let [param_name,param_value] = param.split(':"');
                                            param_value = param_value.replace(/"/g,'');
                                            data = data.split('${'+param_name+'}').join(param_value);
                                        })
                                        sdata = sdata.split(old_params).join('');
                                        word = name;
                                    } else {
                                        word = call;
                                    }
                                    if (word == basename) {
                                        let tag:string = `call(${word})`;
                                        // Eliminar el llamado en Nue e insertar el contenido del componente
                                        let html:string = await Core.Process(data,'component');
                                        sdata = sdata.split(tag).join(html);
                                        fse.writeFile(`./public/${basename_script}.html`,sdata,(err:string) => {
                                            if (err) console.error(err);
                                            let lines:string[] = sdata.split(/\n/);
                                            lines.forEach(async (line) => {
                                                var call:string = line.split('call(').pop().split(')')[0]; // Buscar llamados a componentes
                                                var word:string;
                                                if (/\b(.*?),{(.*?):"(.*?)"(.*?)}/.test(call)) {
                                                    let [name,params_group] = call.split(',{');
                                                    let old_params:string = `,{${params_group}`;
                                                    params_group = params_group.slice(0,-1);
                                                    let params:string[] = params_group.split('",');
                                                    params.forEach(param => {
                                                        let [param_name,param_value] = param.split(':"');
                                                        param_value = param_value.replace(/"/g,'');
                                                        data = data.split('${'+param_name+'}').join(param_value);
                                                    })
                                                    sdata = sdata.split(old_params).join('');
                                                    word = name;
                                                } else {
                                                    word = call;
                                                }
                                                fse.readdir('./src/components',(err,files) => {
                                                    files.forEach(file => {
                                                        var basename:string = path.basename(file, path.extname(file)); // nombre del componente
                                                        fse.readFile(`./src/components/${file}`,'utf8',async (err,data) => {
                                                            if (word == basename) {
                                                                let tag:string = `call(${word})`;
                                                                // Eliminar el llamado en Nue e insertar el contenido del componente
                                                                let html:string = await Core.Process(data,'component');
                                                                sdata = sdata.split(tag).join(html);
                                                                fse.writeFile(`./public/${basename_script}.html`,sdata,err => {
                                                                    if (err) console.error(err);
                                                                    let lines:string[] = sdata.split(/\n/);
                                                                    lines.forEach(async (line) => {
                                                                        var call:string = line.split('call(').pop().split(')')[0]; // Buscar llamados a componentes
                                                                        var word:string;
                                                                        if (/\b(.*?),{(.*?):"(.*?)"(.*?)}/.test(call)) {
                                                                            let [name,params_group] = call.split(',{');
                                                                            let old_params:string = `,{${params_group}`;
                                                                            params_group = params_group.slice(0,-1);
                                                                            let params:string[] = params_group.split('",');
                                                                            params.forEach(param => {
                                                                                let [param_name,param_value] = param.split(':"');
                                                                                param_value = param_value.replace(/"/g,'');
                                                                                data = data.split('${'+param_name+'}').join(param_value);
                                                                            })
                                                                            sdata = sdata.split(old_params).join('');
                                                                            word = name;
                                                                        } else {
                                                                            word = call;
                                                                        }
                                                                        fse.readdir('./src/components',(err,files) => {
                                                                            files.forEach(file => {
                                                                                var basename:string = path.basename(file, path.extname(file)); // nombre del componente
                                                                                fse.readFile(`./src/components/${file}`,'utf8',async (err,data) => {
                                                                                    if (word == basename) {
                                                                                        let tag:string = `call(${word})`;
                                                                                        // Eliminar el llamado en Nue e insertar el contenido del componente
                                                                                        let html:string = await Core.Process(data,'component');
                                                                                        sdata = sdata.split(tag).join(html);
                                                                                        fse.writeFile(`./public/${basename_script}.html`,sdata,err => {
                                                                                            if (err) console.error(err);
                                                                                            let lines:string[] = sdata.split(/\n/);
                                                                                            lines.forEach(async (line) => {
                                                                                                var call:string = line.split('call(').pop().split(')')[0]; // Buscar llamados a componentes
                                                                                                var word:string;
                                                                                                if (/\b(.*?),{(.*?):"(.*?)"(.*?)}/.test(call)) {
                                                                                                    let [name,params_group] = call.split(',{');
                                                                                                    let old_params:string = `,{${params_group}`;
                                                                                                    params_group = params_group.slice(0,-1);
                                                                                                    let params:string[] = params_group.split('",');
                                                                                                    params.forEach(param => {
                                                                                                        let [param_name,param_value] = param.split(':"');
                                                                                                        param_value = param_value.replace(/"/g,'');
                                                                                                        data = data.split('${'+param_name+'}').join(param_value);
                                                                                                    })
                                                                                                    sdata = sdata.split(old_params).join('');
                                                                                                    word = name;
                                                                                                } else {
                                                                                                    word = call;
                                                                                                }
                                                                                                fse.readdir('./src/components',(err,files) => {
                                                                                                    files.forEach(file => {
                                                                                                        var basename:string = path.basename(file, path.extname(file)); // nombre del componente
                                                                                                        fse.readFile(`./src/components/${file}`,'utf8',async (err,data) => {
                                                                                                            if (word == basename) {
                                                                                                                let tag:string = `call(${word})`;
                                                                                                                // Eliminar el llamado en Nue e insertar el contenido del componente
                                                                                                                let html:string = await Core.Process(data,'component');
                                                                                                                sdata = sdata.split(tag).join(html);
                                                                                                                fse.writeFile(`./public/${basename_script}.html`,sdata,err => {
                                                                                                                    if (err) console.error(err);
                                                                                                                });
                                                                                                            }
                                                                                                        })
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        });
                                                                                    }
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                });
                                                            }
                                                        })
                                                    })
                                                })
                                            })
                                        });
                                    }
                                })
                            })
                        })
                    })
                })
            })
            return true;
        }
    })
}
}