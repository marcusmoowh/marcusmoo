/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEB3FORMS_ACCESS_KEY: string;
  readonly VITE_BEHOLD_FEED_ID: string;
  readonly VITE_GISCUS_REPO: string;
  readonly VITE_GISCUS_REPO_ID: string;
  readonly VITE_GISCUS_CATEGORY: string;
  readonly VITE_GISCUS_CATEGORY_ID: string;
  readonly VITE_SITE_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
