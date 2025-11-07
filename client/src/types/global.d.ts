/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly API_BASEURL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
