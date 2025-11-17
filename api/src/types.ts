export interface AuthToken {
  userId: string;
  username: string;
}

export interface User {
  userId: string;
  username: string;
  email: string;
  password: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthToken;
    }
  }
}
