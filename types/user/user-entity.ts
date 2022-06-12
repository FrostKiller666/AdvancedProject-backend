export interface UserEntity {
    id: string;
    username: string;
    email: string;
    password: string;
    activated: '0' | '1';
    logged: '0' | '1';
}
