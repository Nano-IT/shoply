import { UserInterface } from '@/ts/interfaces/user';

export interface LoginInterface {
  email: string;
  password: string;
}
export interface RegisterInterface {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface TokensInterface {
  accessToken: string;
  refreshToken: string;
}

export interface CredentialsInterface extends TokensInterface {
  user: UserInterface;
}
