const { execSync } = require('child_process');

try {
  console.log('Starting build...');
  execSync('npm run build', { 
    cwd: process.cwd(), 
    stdio: 'inherit',
    shell: 'cmd.exe'
  });
  console.log('✓ Build successful!');
  process.exit(0);
} catch (error) {
  console.log('Build failed:', error.message);
  process.exit(1);
}
