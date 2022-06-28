import {AdEntity, AnnouncementsForUser, NewAddEntity, SimpleAdEntity} from "../types";
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
    public streetAddress: string;
    public numberStreet: string;
    public city: string;
    public postalCode: string;
    public lat: number;
    public lon: number;
    public userId: string;

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

        if (obj.streetAddress.length > 56) {
            throw new ValidationError('Nie ma w Polsce miasta o podanej długośći!');
        }

        if (!obj.streetAddress && obj.numberStreet) {
            throw new ValidationError('Nie możesz podać numeru ulicy/miszkania jeśli nie podałeś nazwy ulicy!');
        }

        if (obj.numberStreet.length > 7) {
            throw new ValidationError('W Polsce nie ma kombinacji numeru ulic/mieszkań o takiej ilości znaków!');
        }

        if (obj.city.length > 30) {
            throw new ValidationError('W Polsce nie ma miasta o tak dużej ilości znaków, zapraszamy do Wikipedii ( :');
        }

        if (!obj.city || obj.city.length > 30) {
            throw new ValidationError('Pole miasta jest wymagane oraz ilość znaków nie może być większa niż 30.');
        }

        if (!obj.postalCode || obj.postalCode.length > 6) {
            throw new ValidationError('Pole kodu pocztowego jest wymagane oraz ilość znaków nie może być większa niż 6.');
        }

        if (!obj.userId) {
            throw new ValidationError('Wystąpił nieoczekiwany problem z Twoim kontem, proszę spróbować za klilka chwil.');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.price = obj.price;
        this.description = obj.description;
        this.url = obj.url;
        this.lon = obj.lon;
        this.lat = obj.lat;
        this.postalCode = obj.postalCode;
        this.city = obj.city;
        this.streetAddress = obj.streetAddress;
        this.numberStreet = obj.numberStreet;
        this.userId = obj.userId;
    }

    static async getAllAnnouncementOfUser(userId: string): Promise<AnnouncementsForUser[] | null> {

        const [results] = (await pool.execute("SELECT * FROM `users_notice` WHERE `userId` = :userId", {
            userId,
        })) as typeExecuteHandler;

        return results.length === 0 ? null : results.map(result => {
            const {
                name, price, description, url, streetAddress, numberStreet, city, postalCode
            } = result;
            return {
                name, price, description, url, streetAddress, numberStreet, city, postalCode
            };
        });
    }

    static async getOne(id: string): Promise<AdRecord | null> {

        const [results] = (await pool.execute("SELECT * FROM `users_notice` WHERE `id` = :id", {
            id,
        })) as typeExecuteHandler;

        return results.length === 0 ? null : new AdRecord(results[0]);
    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new Error('Cannot insert something that already exist!');
        }

        await pool.execute("INSERT INTO `users_notice`(`id`, `name`, `price`, `description`, `url`, `lon`, `lat`, `streetAddress`, `numberStreet`, `city`, `postalCode`, `userId`) VALUES(:id, :name, :price, :description, :url, :lon, :lat, :streetAddress, :numberStreet, :city, :postalCode, :userId)", {
            id: this.id,
            name: this.name,
            price: this.price,
            description: this.description,
            url: this.url,
            lon: this.lon,
            lat: this.lat,
            streetAddress: this.streetAddress,
            numberStreet: this.numberStreet,
            city: this.city,
            postalCode: this.postalCode,
            userId: this.userId,
        });

        return this.id;
    }

    static async getAll(name: string): Promise<SimpleAdEntity[] | null> {
        const [results] = (await pool.execute("SELECT * FROM `users_notice` WHERE `name` LIKE :search", {
            search: `%${name}%`,
        })) as typeExecuteHandler;

        return results.length === 0 ? null : results.map(result => {
            const {
                id, lat, lon
            } = result;
            return {
                id, lat, lon
            };
        });
    }

}

export {
    AdRecord,
}
