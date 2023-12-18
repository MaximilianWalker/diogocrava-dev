import fs from 'fs';
import path from 'path';
import { createInterface } from 'readline/promises';

const cmd = createInterface({
    input: process.stdin,
    output: process.stdout
});

const toKebabCase = (str) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const toPascalCase = (str) => str.replace(/\w+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
const toCamelCase = (str) => str.replace(/([-_]\w)/g, (g) => g[1].toUpperCase());

const updateImportStatements = (directoryPath, oldFileName, newFileName) => {
    const oldBaseName = path.basename(oldFileName, path.extname(oldFileName));
    const newBaseName = path.basename(newFileName, path.extname(newFileName));

    fs.readdirSync(directoryPath, { withFileTypes: true }).forEach(entry => {
        if (entry.isFile()) {
            const filePath = path.join(directoryPath, entry.name);
            let fileContent = fs.readFileSync(filePath, 'utf8');

            // Regex to match various import styles, considering optional file extensions
            const importRegex = new RegExp(`from ['"](.*/)?${oldBaseName}(\\.\\w+)?['"]`, 'g');
            fileContent = fileContent.replace(importRegex, `from '$1${newBaseName}'`);

            fs.writeFileSync(filePath, fileContent, 'utf8');
        }
    });
};

const renameFile = (directoryPath, originalName, caseType) => {
    let newName;
    switch (caseType) {
        case 'kebab':
            newName = toKebabCase(originalName);
            break;
        case 'pascal':
            newName = toPascalCase(originalName);
            break;
        case 'camel':
            newName = toCamelCase(originalName);
            break;
        default:
            newName = originalName;
    }

    if (newName !== originalName) {
        const originalPath = path.join(directoryPath, originalName);
        const newPath = path.join(directoryPath, newName);
        fs.renameSync(originalPath, newPath);
        updateImportStatements(directoryPath, originalName, newName);
    }
};

const processDirectory = (directoryPath, caseType) => {
    fs.readdirSync(directoryPath, { withFileTypes: true }).forEach(entry => {
        const entryPath = path.join(directoryPath, entry.name);
        if (entry.isDirectory()) {
            processDirectory(entryPath, caseType);
        } else if (entry.isFile()) {
            renameFile(directoryPath, entry.name, caseType);
        }
    });
};

const renameFiles = (caseType, directory) => {
    const projectRoot = process.cwd();
    const directoryPath = directory ? path.join(projectRoot, directory) : projectRoot;
    processDirectory(directoryPath, caseType);
};

const directory = process.argv[3] || 'src'; // Default to 'src' if no directory is provided

// IMPROVEMENT: ask if the user want import updates
async function main() {
    try {
        console.log('Rename files to:');
        console.log('   1. Kebab Case');
        console.log('   2. Pascal Blob');
        console.log('   3. Camel Blob');

        const option = await cmd.question('Option: ');

        if (option == 1) renameFiles('kebab', directory);
        else if (option == 2) renameFiles('pascal', directory);
        else if (option == 3) renameFiles('camel', directory);
        else console.log('Invalid option!');
    } catch (ex) {
        console.log(ex);
    } finally {
        cmd.close();
    }
}

main();