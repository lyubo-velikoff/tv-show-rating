declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      OMDB_API_KEY: string;
      VIKI_TOKEN: string;
      CORS_ORIGIN?: string;
    }
  }
}

// Need this to make TypeScript treat this as a module
export {}; 
