const fs = require('fs').promises;
const path = require('path');

async function combineFiles(dirPath, outputFile) {
    const filePaths = await findFiles(dirPath);
    let combinedContent = '';

    for (const filePath of filePaths) {
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            combinedContent += `\n\n// File: ${filePath}\n\n${fileContent}`;
        } catch (err) {
            console.error(`Error reading file: ${filePath}`, err);
        }
    }

    try {
        await fs.writeFile(outputFile, combinedContent.trim(), 'utf-8');
        console.log(`Successfully combined files into: ${outputFile}`);
    } catch (err) {
        console.error(`Error writing to output file: ${outputFile}`, err);
    }
}

async function findFiles(dirPath) {
    let filePaths = [];
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
        const itemPath = path.join(dirPath, item.name);
        if (item.isDirectory()) {
            filePaths = filePaths.concat(await findFiles(itemPath));
        } else if (item.isFile() &&
                   (item.name.endsWith('.ts') ||
                    item.name.endsWith('.tsx') ||
                    item.name.endsWith('.js')) &&
                    !isConfigFile(item.name) )
          {
            filePaths.push(itemPath);
        }
    }

    return filePaths;
}

function isConfigFile(fileName) {
    const configFiles = [
        'vite.config.js',
        'vite.config.ts',
        'package.json',
        'tsconfig.json',
        'postcss.config.js',
        'tailwind.config.js',
        'tailwind.config.ts',
        '.env',
        '.env.local',
        '.env.development',
        '.env.production',
      'jest.config.js',
      'jest.config.ts',
        '.eslintrc.js',
        '.eslintrc.cjs',
        '.eslintrc.json',
        '.prettierrc.js',
        '.prettierrc.json',
      '.prettierrc.cjs',
        'webpack.config.js',
        'webpack.config.ts',
        'babel.config.js',
        'babel.config.json',
      'eslint.config.js'

    ];

    return configFiles.includes(fileName);
}

// Get arguments from command line
const args = process.argv.slice(2);

if (args.length !== 2) {
    console.error('Usage: node script.js <directory_path> <output_file>');
    process.exit(1);
}

const directoryPath = args[0];
const outputFilePath = args[1];

combineFiles(directoryPath, outputFilePath);