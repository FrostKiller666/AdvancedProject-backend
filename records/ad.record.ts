import {AdEntity, NewAddEntity} from "../types";
import {ValidationError} from "../utils/errrors";
import {v4 as uuid} from "uuid";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type typeExecuteHandler = [AdRecord[], FieldPacket[]];

class AdRecord implements AdEntity {
    public id: string;
    public name: string;
    public price: number;
    public description: string;
    public url: string;
    public lat: number;
    public lon: number;

    constructor(obj: NewAddEntity) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Nazwa ogłoszenie nie może być pusta oraz przekraczać 100 znaków.');
        }

        if (obj.description.length > 1000) {
            throw new ValidationError('Opis ogłoszenia nie może przekraczać 1000 znaków.');
        }

        if (obj.price < 0 || obj.price > 1000000) {
            throw new ValidationError('Cena nie może być ujemna oraz przekraczać jednego miliona polskich złotych!')
        }

        if (!obj.url || obj.name.length > 100) {
            throw new ValidationError('Link ogłosznie nie może być pusty oraz przekraczać 100 znaków!');
        }

        // @TODO: Valid link.

        if (typeof obj.lat !== 'number' || typeof obj.lon !== 'number') {
            throw new ValidationError('Nie można zlokalizować danych geograficznych danego ogłoszenia.')
        }

        this.id = obj.id;
        this.name = obj.name;
        this.price = obj.price;
        this.description = obj.description;
        this.url = obj.url;
        this.lon = obj.lon;
        this.lat = obj.lat;
    }

    static async getOne(id: string): Promise<AdRecord | null> {

        const [results] = (await pool.execute("SELECT * FROM `users_notice` WHERE `id` = :id", {
            id,
        })) as typeExecuteHandler;

        return results.length === 0 ? null : new AdRecord(results[0]);
    }

    static async getAll(): Promise<AdRecord[] | null> {
        const [results] = (await pool.execute("SELECT * FROM `users_notice`")) as typeExecuteHandler;

        return results.length === 0 ? null : results.map((obj) => new AdRecord(obj));
    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }

        await pool.execute("INSERT INTO `users_notice`(`id`, `name`, `price`, `description`, `url`, `lon`, `lat`) VALUES(:id, :name, :price, :description, :url, :lon, :lat)", {
            id: this.id,
            name: this.name,
            price: this.price,
            description: this.description,
            url: this.url,
            lon: this.lon,
            lat: this.lat,
        });

        return this.id;
    }

}

export {
    AdRecord,
}
