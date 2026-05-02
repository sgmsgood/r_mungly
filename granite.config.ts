import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'r_mungly', // 앱인토스 콘솔에서 등록한 앱 이름으로 바꿔주세요.
  brand: {
    displayName: 'r_mungly', // 앱인토스 콘솔에 등록한 앱의 한글 이름으로 바꿔주세요.
    primaryColor: '#F6F4FF', // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: '', // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
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
