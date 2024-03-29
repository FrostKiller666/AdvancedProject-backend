import {UserEntity} from "../types";
import {ValidationError} from "../utils/errrors";
import {v4 as uuid} from "uuid";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type typeExecuteHandler = [UserRecord[], FieldPacket[]];

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

        if (obj.password.length > 72) {
            throw new ValidationError('Przepraszamy, proszę wprowadzić poprawne hasło za kilka chwil.');
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

    static async patchPassword(password: string, username: string): Promise<void> {
        await pool.execute("UPDATE `users_account` SET `password` = :password WHERE `username` LIKE :username", {
            password,
            username
        })
    }

    static async getAll(): Promise<UserEntity[] | null> {
        const [results] = (await pool.execute("SELECT * FROM `users_account` ")) as typeExecuteHandler;

        return results.length === 0 ? null : results.map(obj => new UserRecord(obj));
    }

    static async getOne(email: string): Promise<UserEntity | null> {
        const [results] = (await pool.execute("SELECT * FROM `users_account` WHERE `email` LIKE :email", {
            email,
        })) as typeExecuteHandler;

        return results.length === 0 ? null : new UserRecord(results[0]);
    }

    static async getOneUser(username: string): Promise<UserEntity | null> {
        const [results] = (await pool.execute("SELECT * FROM `users_account` WHERE `username` LIKE :username", {
            username,
        })) as typeExecuteHandler;

        return results.length === 0 ? null : new UserRecord(results[0]);
    }

}

export {
    UserRecord,
}
