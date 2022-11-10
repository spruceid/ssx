const { readJson, readdir, pathExists, writeJSON } = require('fs-extra');


const packageJSON = "package.json" 


const writePackages = async (packages) => {
    for (const package in packages) {
        const { location, data } = packages[package];
        await writeJSON(location, data, { spaces: 2 })      
    }
}

const getAllPackageJSON = async () => {
    // read package.json
    const packageList = []
    const packages = {};
    const { workspaces } = await readJson(packageJSON);

    // get packages in workspaces
    for (const workspace of workspaces){
        if (workspace.includes("/*")) {
            const currentWorkspace = workspace.replace("*", "");
            const dirs = await readdir(currentWorkspace)
            packageList.push(...dirs.map((dir) => `${currentWorkspace}${dir}/${packageJSON}`))
        } else {
            packageList.push(`${workspace}/${packageJSON}`)
        }
    }
    
    // get package json
    for (const package of packageList) {
        if (await pathExists(package)) {
            const data = await readJson(package)
            packages[data.name] = {
                location: package,
                version: data.version,
                data
            };
        }
    }

    // writePackages(packages)
    // console.log(packages)
    return packages;
}

const updatePackageVersion = (packages, usePublishedVersion = true) => {
    console.log("Using local package versions");
    const packageNames = Object.keys(packages);
    // console.log(packages);
    console.log(packageNames);
    for (const package in packages) {
        // console.log(package)
        // in each package, check for package names
        for (const dependency in packages[package].data.dependencies) {
            // console.log(packageNames)
            if (packageNames.includes(dependency)) {
                let newVersion = "*";
                if (usePublishedVersion) {
                    newVersion = packages[dependency].version;
                }
                console.log(dependency)
                packages[package].data.dependencies[dependency] = newVersion;
                // if found, set to *
                // or set to version
            }
        }
    }
    return packages;
    
}

const usePublicPackages = (packages) => {
    console.log("Using public package versions");
}

const main = async () => {
    const usePublishedVersion = !process.argv.includes("local");
    const packages = await getAllPackageJSON();
    // console.log(packages)
    const updatedPackages = updatePackageVersion(packages, usePublishedVersion);
    writePackages(updatedPackages);
}

main();