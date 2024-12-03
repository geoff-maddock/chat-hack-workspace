/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    // add more env variables types here
    readonly VITE_API_URL: string
    // ... etc
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}