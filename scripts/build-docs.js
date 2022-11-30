/* eslint-disable */
const { readdir, writeFile, readFile } = require('fs-extra');
const { parse } = require('path');

const getLines = (output, prefix = 'reference/ssx-sdk/', layer = 0) => {
  const lines = [];
  for (const key of Object.keys(output)) {
    const newPrefix = `${prefix}${key}.`;

    lines.push(`${'  '.repeat(layer)}* [${key}](${newPrefix}md)`);
    lines.push(...getLines(output[key], newPrefix, layer + 1));
  }
  return lines;
};

const generateReference = async () => {
  const output = {};
  const dirs = [
    './documentation/reference/ssx-sdk',
    './documentation/reference/ssx-core',
    './documentation/reference/ssx-server',
    './documentation/reference/ssx-serverless',
  ];
  const docFiles = [ ...(await Promise.all(dirs.map(async dir => await readdir(dir)))) ].reduce((p, c) => [...p, ...c], []);
  
  for (const docFile of docFiles) {
    try {
      const { name, ext } = parse(docFile);
      if (ext !== '.md') {
        continue;
      }
      const nameParts = name.split('.');
      //   console.log(name, nameParts, nameParts.length);
      if (nameParts.length === 1) {
        if (!output[name]) {
          output[name] = {};
        }
      } else if (nameParts.length === 2) {
        if (!output[nameParts[0]]) {
          output[nameParts[0]] = {};
        }
        if (!output[nameParts[0]][nameParts[1]]) {
          output[nameParts[0]][nameParts[1]] = {};
        }
      } else if (nameParts.length === 3) {
        if (!output[nameParts[0]]) {
          output[nameParts[0]] = {};
        }
        if (!output[nameParts[0]][nameParts[1]]) {
          output[nameParts[0]][nameParts[1]] = {};
        }
        if (!output[nameParts[0]][nameParts[1]][nameParts[2]]) {
          output[nameParts[0]][nameParts[1]][nameParts[2]] = {};
        }
      } else if (nameParts.length > 3){
        console.log("Error: Not all documentation is being generated. Missing: ", nameParts.join('.'));
      }
    } catch (err) {
      console.error(`Could not process ${docFile}: ${err}`);
    }
  }

  const lines = [
    "## Reference",
    ...getLines({ 'ssx': output['ssx'] }),
    ...getLines({ 'ssx-core': output['ssx-core']}, 'reference/ssx-core/'),
    ...getLines({ 'ssx-server': output['ssx-server']}, 'reference/ssx-server/'),
    ...getLines({ 'ssx-serverless': output['ssx-serverless']}, 'reference/ssx-serverless/'),
  ];

  let reference = lines.join('\n');
  reference = reference.replace('* [ssx]', '* [SSX API Reference]');
  reference = reference.replace('* [ssx-core]', '* [SSX Core API Reference]');
  reference = reference.replace('* [ssx-server]', '* [SSX Server API Reference]');
  reference = reference.replace('* [ssx-serverless]', '* [SSX Serverless API Reference]');
  return reference;
}


const generateSUMMARY = async () => {
  const prevSummary = await readFile('./documentation/SUMMARY.md', 'utf8');
  const previous = prevSummary.split("## Reference")[0];

  let reference = await generateReference();
  reference = reference.replace(/^\* \[ssx\]/, '* [SSX API Reference]');
  reference = reference.replace(/^\* \[ssx-core\]/, '* [SSX Core API Reference]');
  reference = reference.replace(/^\* \[ssx-server\]/, '* [SSX Server API Reference]');
  reference = reference.replace(/^\* \[ssx-serverless\]/, '* [SSX Serverless API Reference]');
  await writeFile('./documentation/SUMMARY.md', previous.concat(reference));
}

generateSUMMARY();
