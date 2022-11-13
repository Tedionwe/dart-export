#!/usr/bin/env node
import _fs from 'fs';
const { version } = require("../package.json");



const fs = _fs.promises;




const exportAll = async (path: string): Promise<string | undefined> => {

    const dir = await fs.readdir(path);

    const fileName = path.split('/').pop();

    const length = dir.length;

    const files: Array<string> = [];

    for (let i = 0; i < length; i++) {



        const stat = await fs.stat(path + '/' + dir[i]);

        if (stat.isDirectory()) {
            const exportFile = await exportAll(path + '/' + dir[i]);

            if (exportFile) {
                files.push(exportFile);
            }
        }

        if (dir[i].endsWith('.dart') && !dir[i].endsWith('_' + fileName + '.dart')) {
            files.push(dir[i]);
        }

    }

    if (files.length == 0) return;

    const fileExtension = '.dart';
    const filePath = `${path}/_${fileName}${fileExtension}`;
    const content = files.map((e) => `export '${e}';\n`).join('');

    console.log('exported --> ', filePath);

    await _fs.writeFile(filePath, content, _ => _);

    return `./${fileName}/_${fileName}${fileExtension}`;
}

const statExport = () => {
    const [_, __, path] = process.argv;

    if (path === "-v" || path === "--version") {
        return console.log('Dart Export version ', version);
    }

    if (!path) return console.log("No Path Provider");

    console.log("Exporting")

    console.log('export from: ', path);

    exportAll(path);
}

statExport();
