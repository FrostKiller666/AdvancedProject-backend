import {UserEntity} from "../types";
import {ValidationError} from "../utils/errrors";
import {v4 as uuid} from "uuid";
import {pool} from "../utils/db";


class UserRecord implements UserEntity {
    public id: string;
    public username: string;
    public email: string;
    public password: string;
    public activated: "0" | "1";

    constructor(obj: UserEntity) {
        if (obj.username.length > 50 || obj.username.length < 3) {
            throw new ValidationError('Nazwa użytkownika powinna mieć od 3 do 50 znaków.');
        }

        if (obj.email.length > 320 || obj.email.length < 5) {
            throw new ValidationError('Wprowadziłeś za krótki bądż za długi adres mailowy.');
        }

        // @TODO: We cold valid password better here like letter a-z number 0-9 etc.
        if (obj.password.length > 32 || obj.password.length < 8) {
            throw new ValidationError('Hasło musi być w przedziale od 8 do 32 znaków.');
        }

        if (!obj.username) {
            throw new ValidationError('Nazwa użytkownika nie może być pusta.');
        }

        if (!obj.email) {
            throw new ValidationError('Adres mailowy nie może być pusty.');
        }

        if (!obj.password) {
            throw new ValidationError('Hasło nie może być puste.');
        }

        if (obj.activated !== '0') {
            obj.activated = '0';
        }


        this.id = obj.id;
        this.username = obj.username;
        this.email = obj.email;
        this.password = obj.password;
        this.activated = obj.activated;
    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new Error('Cannot insert something that already exist!');
        }

        await pool.execute("INSERT INTO `users_account`(`id`, `username`, `email`, `password`, `activated`) VALUES(:id, :username, :email, :password, :activated)", {
            id: this.id,
            username: this.username,
            email: this.email,
            password: this.password,
            activated: this.activated,

        });

        return this.id;
    }

}

export {
    UserRecord,
}
