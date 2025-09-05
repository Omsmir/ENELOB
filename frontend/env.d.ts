namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_PORT: string;
      NEXTAUTH_SECRET: string;
      GOOGLE_CLIENT_SECRET:string;
      GOOGLE_CLIENT_ID:string;
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
  