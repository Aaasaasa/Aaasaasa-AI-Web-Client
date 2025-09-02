const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');


async function copyDir(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) await copyDir(s, d);
    else if (e.isFile()) await fs.promises.copyFile(s, d);
  }
}

exports.default = async function beforePack(context) {
  console.log('Running beforePack script...');
  console.log('[beforePack] keys:', Object.keys(context || {}));
  try {
    const fixEntitiesPath = path.join(__dirname, 'fix-entities.cjs');
    console.log('Running:', fixEntitiesPath);
    
    execSync(`node "${fixEntitiesPath}"`, { 
      stdio: 'inherit'
    });
    console.log('beforePack completed successfully!');
  } catch (error) {
    console.error('beforePack failed:', error);
    process.exit(1);
  }

  // 2) copy Nuxt static -> electron/renderer
  const appDir = context.packager.info.appDir;        // npr. /…/electron
  const projectDir = context.packager.projectDir;     // npr. /…/aaasaasa-web-client
  console.log('[beforePack] appDir:', appDir);
  console.log('[beforePack] projectDir:', projectDir);

  // const appDir = context.appDir;                      // npr. /.../electron
  const src = path.join(projectDir, '..', 'app', '.output', 'public');
  const dest = path.join(appDir, 'renderer');
  console.log('[.output] appDir:', src);
  console.log('[renderer] projectDir:', dest);

  if (!fs.existsSync(src)) {
    throw new Error(`Nuxt output not found at ${src}. Run: pnpm -C app generate`);
  }

  await fs.promises.rm(dest, { recursive: true, force: true });
  await copyDir(src, dest);
  console.log('✓ Copied Nuxt public -> renderer');
};
