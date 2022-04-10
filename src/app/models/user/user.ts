export interface LoginViewModel {
    email: string;
    password: string;
}

export interface UserModel {
    email: string;
    name: string;
    id: string;
    roles: UserRole[]
}

export interface TokenResponse {
    userViewModel: UserModel;
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenRequest {
    userId: string;
    refreshToken: string;
}

export enum UserRole {
    
}