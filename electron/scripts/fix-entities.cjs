console.log('=== FIX ENTITIES STARTED ===');
console.log('__dirname:', __dirname);
console.log('process.cwd():', process.cwd());

const fs = require('fs');
const path = require('path');

function fixEntities() {
  try {
    // KLJUČNA PROMENA: Proveri da li smo u packaged verziji
    const basePath = process.resourcesPath 
      ? path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules')
      : path.join(__dirname, '..', 'node_modules');
    
    const entitiesPath = path.join(basePath, 'entities', 'package.json');
    
    console.log('Checking entities at:', entitiesPath);
    
    if (!fs.existsSync(entitiesPath)) {
      console.log('Entities package not found, skipping fix');
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(entitiesPath, 'utf8'));
    
    // Proveri da li već ima decode export
    if (!packageJson.exports['./decode']) {
      packageJson.exports = {
        ...packageJson.exports,
        './decode': {
            "import": "./dist/decode.js",
            "require": "./dist/decode.js" 
        },
        './encode': {
            "import": "./dist/encode.js",
            "require": "./dist/encode.js"
        }
    };
      
      fs.writeFileSync(entitiesPath, JSON.stringify(packageJson, null, 2));
      console.log('✓ Fixed entities package.json exports');
    } else {
      console.log('✓ Entities already fixed');
    }
  } catch (error) {
    console.error('✗ Error fixing entities:', error);
  }
}

fixEntities();