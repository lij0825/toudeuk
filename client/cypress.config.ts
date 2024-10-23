import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", //테스트할 애플리케이션 URL
    env: {
      API_BASE_URL: '//localhost:3000/api/v1', // 백엔드 API URL을 설정
    },
    setupNodeEvents(on, config) {},
  },
});
