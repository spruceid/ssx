/**
 * Command line usage:
 * `node scripts/toggle-packages.js` // use published package versions
 * `node scripts/toggle-packages.js local` // use local package versions
 * `node scripts/toggle-packages.js local examples` // use local package versions, update examples
 */
const { readJSON, readdir, pathExists, writeJSON } = require('fs-extra');

const writePackages = async packages => {
  for (const package in packages) {
    const { location, data } = packages[package];
    await writeJSON(location, data, { spaces: 2 });
  }
};

const getAllPackageJSON = async (includeExamples=false) => {
  // read package.json
  const packageList = [];
  const packages = {};
  const { workspaces } = await readJSON('package.json');

  // get packages in workspaces
  for (const workspace of workspaces) {
    if (workspace.includes('/*')) {
      const currentWorkspace = workspace.replace('*', '');
      const dirs = await readdir(currentWorkspace);
      packageList.push(
        ...dirs.map(dir => `${currentWorkspace}${dir}/package.json`)
      );
    } else if (workspace.includes('examples/') && includeExamples) {
      // only include packages/* and examples/* for now
      packageList.push(`${workspace}/package.json`);
    }
  }

  // get package json
  for (const package of packageList) {
    if (await pathExists(package)) {
      const data = await readJSON(package);
      packages[data.name] = {
        location: package,
        version: data.version,
        data,
      };
    }
  }

  return packages;
};

const updatePackageVersion = (packages, usePublishedVersion = true) => {
  console.log(
    `Using ${usePublishedVersion ? 'remote' : 'local'} package versions`
  );
  const packageNames = Object.keys(packages);
  for (const package in packages) {
    // in each package, check for package names
    for (const dependency in packages[package].data.dependencies) {
      if (packageNames.includes(dependency)) {
        const newVersion = usePublishedVersion
          ? packages[dependency].version
          : '*';
        packages[package].data.dependencies[dependency] = newVersion;
      }
    }
  }
  return packages;
};

const main = async () => {
  const usePublishedVersion = !process.argv.includes('local');
  const includeExamples = process.argv.includes('examples');
  const packages = await getAllPackageJSON(includeExamples);
  const updatedPackages = updatePackageVersion(packages, usePublishedVersion);
  writePackages(updatedPackages);
};

main();
