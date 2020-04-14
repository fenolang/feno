import fse from 'fs-extra'
const base = process.cwd();

interface Packages {
    head: string,
    body: string
}

export async function findPackages() {
    return new Promise((resolve, reject) => {
        fse.pathExists(`${base}/packages.feno`, (err: string, exists: boolean) => {
            if (err) return console.error(err)
            // # If the packages.feno file is defined
            if (exists) {
                fse.readFile(`${base}/packages.feno`, (err: string, packages_data: string) => {
                    if (err) return console.error(err)
                    // # If the packages.feno file is not empty
                    if (packages_data && packages_data.length && packages_data != "") {
                        let packages: Packages = {
                            head: "",
                            body: ""
                        }

                        // # If Jquery is called
                        if (/use ?\("jquery"\);?/.test(packages_data)) {
                            packages.body += `<!-- Jquery -->\n<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>\n`
                        }

                        // # If Font Awesome is called
                        if (/use ?\("font-awesome"\);?/.test(packages_data)) {
                            packages.head += `<!-- Font Awesome -->\n<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/solid.css">\n<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/fontawesome.css">\n`
                        }

                        // # If Material Design Icons is called
                        if (/use ?\("mdi-font"\);?/.test(packages_data)) {
                            packages.head += `<!-- Material Design Icons -->\n<link rel="stylesheet" href="https://cdn.materialdesignicons.com/4.9.95/css/materialdesignicons.min.css">\n`
                        }

                        // # If bootstrap is called
                        if (/use ?\("bootstrap"\);?/.test(packages_data)) {
                            packages.head += `<!-- Bootstrap CSS -->\n<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">\n`;
                            packages.body += `<!-- Bootstrap JS -->\n<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>\n<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>\n`
                        }
                        
                        // # If uikit is called
                        if (/use ?\("uikit"\);?/.test(packages_data)) {
                            packages.head += `<!-- UIkit CSS -->\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.3.2/dist/css/uikit.min.css" />\n`
                            packages.body += `<!-- UIkit JS -->\n<script src="https://cdn.jsdelivr.net/npm/uikit@3.3.2/dist/js/uikit.min.js"></script>\n<script src="https://cdn.jsdelivr.net/npm/uikit@3.3.2/dist/js/uikit-icons.min.js"></script>\n`
                        }

                        // # If BulmaCSS is called
                        if (/use ?\("bulma"\);?/.test(packages_data)) {
                            packages.head += `<!-- Bulma CSS -->\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">\n`
                        }

                        // # If TailwindCSS is called
                        if (/use ?\("tailwind"\);?/.test(packages_data)) {
                            packages.head += `<!-- Tailwind CSS -->\n<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet">\n`
                        }

                        // # If PicnicCSS is called
                        if (/use ?\("picnic-css"\);?/.test(packages_data)) {
                            packages.head += `<!-- Picnic CSS -->\n<link rel="stylesheet" href="https://unpkg.com/picnic">\n`
                        }

                        // # If PureCSS is called
                        if (/use ?\("pure-css"\);?/.test(packages_data)) {
                            packages.head += `<!-- Pure CSS -->\n<link rel="stylesheet" href="https://unpkg.com/purecss@1.0.1/build/pure-min.css" integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47" crossorigin="anonymous">\n`
                        }

                        // # If MaterializeCSS is called
                        if (/use ?\("materialize-css"\);?/.test(packages_data)) {
                            packages.head += `<!-- Materialize CSS -->\n<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">\n`
                            packages.body += `<!-- Materialize JS -->\n<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>\n`
                        }

                        // # If NormalizeCSS is called
                        if (/use ?\("normalize-css"\);?/.test(packages_data)) {
                            packages.head += `<!-- Normalize CSS -->\n<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.css">\n`
                        }

                        // # If MilligramCSS is called
                        if (/use ?\("milligram"\);?/.test(packages_data)) {
                            packages.head += `<!-- Milligram CSS -->\n<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.3.0/milligram.css">\n`
                        }

                        // # If SkeletonCSS is called
                        if (/use ?\("skeleton-css"\);?/.test(packages_data)) {
                            packages.head += `<!-- Skeleton CSS -->\n<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/skeleton-framework/1.1.1/skeleton.min.css">\n`
                        }

                        // # If SpectreCSS is called
                        if (/use ?\("spectre-css"\);?/.test(packages_data)) {
                            packages.head += `<!-- Spectre CSS -->\n<link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre.min.css">\n<link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre-exp.min.css">\n<link rel="stylesheet" href="https://unpkg.com/spectre.css/dist/spectre-icons.min.css">`
                        }

                        // # If BaseCSS is called
                        if (/use ?\("base-css"\);?/.test(packages_data)) {
                            packages.head += `<!-- Base Framework CSS -->\n<link rel="stylesheet" href="https://unpkg.com/@getbase/base/index.css">\n`
                        }

                        // # If MustardCSS is called
                        if (/use ?\("mustard-css"\);?/.test(packages_data)) {
                            packages.head += `<!-- Mustard CSS -->\n<link rel="stylesheet" href="https://unpkg.com/mustard-ui@latest/dist/css/mustard-ui.min.css">\n`
                        }

                        return packages
                    } else
                        resolve()
                })
            } else
                resolve()
        })
    })
}

export function setPackages() {

}