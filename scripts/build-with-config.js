#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const environment = process.argv[2] || 'development';
const configSourcePath = path.join(__dirname, '..', 'src', 'assets', 'config', `app-config.${environment}.json`);
const configTargetPath = path.join(__dirname, '..', 'src', 'assets', 'config', 'app-config.json');

console.log(`Building for environment: ${environment}`);
console.log(`Copying config from: ${configSourcePath}`);
console.log(`Copying config to: ${configTargetPath}`);

try {
  if (fs.existsSync(configSourcePath)) {
    fs.copyFileSync(configSourcePath, configTargetPath);
    console.log('✅ Configuration file copied successfully');
  } else {
    console.warn(`⚠️  Configuration file not found: ${configSourcePath}`);
    console.log('Using default configuration');
  }
} catch (error) {
  console.error('❌ Error copying configuration file:', error);
  process.exit(1);
}
