const { readJson, readdir, pathExists, writeJSON, readFile } = require('fs-extra');


const packageJSON = "package.json" 


const writePackages = async (packages) => {
    await writeJSON("test.json", packages, { spaces: 2 })
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
    writePackages(packages)
    console.log(packages)
}

const useLocalPackages = () => {
    console.log("Using local package versions");
    getAllPackageJSON();
}

const usePublicPackages = () => {
    console.log("Using public package versions");

}

const main = () => {
    useLocalPackages();
}

main();