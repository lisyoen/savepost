const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  platform: 'node',
  sourcemap: true,
  external: ['/.*/', '/data', '/logs', '/config', '/client', '.idea', '.prompts', '.vscode'] // 기존 제외 폴더와 추가 폴더 유지
}).catch(() => process.exit(1));