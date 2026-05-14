import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'moongly', // 앱인토스 콘솔에 등록한 appName과 같아야 해요.
  brand: {
    displayName: '뭉글리',
    primaryColor: '#A78BFA',
    icon: 'https://moongly.apps.tossmini.com/assets/brand/ic_r_moongly.png',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite dev',
      build: 'vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
