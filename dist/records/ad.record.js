var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ValidationError } from "../utils/errrors";
import { v4 as uuid } from "uuid";
import { pool } from "../utils/db";
class AdRecord {
    constructor(obj) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Nazwa ogłoszenie nie może być pusta oraz przekraczać 100 znaków.');
        }
        if (obj.description.length > 1000) {
            throw new ValidationError('Opis ogłoszenia nie może przekraczać 1000 znaków.');
        }
        if (obj.price < 0 || obj.price > 1000000) {
            throw new ValidationError('Cena nie może być ujemna oraz przekraczać jednego miliona polskich złotych!');
        }
        if (!obj.url || obj.name.length > 100) {
            throw new ValidationError('Link ogłosznie nie może być pusty oraz przekraczać 100 znaków!');
        }
        // @TODO: Valid link.
        if (typeof obj.lat !== 'number' || typeof obj.lon !== 'number') {
            throw new ValidationError('Nie można zlokalizować danych geograficznych danego ogłoszenia.');
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
    static getAllAnnouncementOfUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [results] = (yield pool.execute("SELECT * FROM `users_notice` WHERE `userId` = :userId", {
                userId,
            }));
            return results.length === 0 ? null : results.map(result => {
                const { id, name, price, description, url, streetAddress, numberStreet, city, postalCode } = result;
                return {
                    id, name, price, description, url, streetAddress, numberStreet, city, postalCode
                };
            });
        });
    }
    static getOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [results] = (yield pool.execute("SELECT * FROM `users_notice` WHERE `id` = :id", {
                id,
            }));
            return results.length === 0 ? null : new AdRecord(results[0]);
        });
    }
    insert() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.id) {
                this.id = uuid();
            }
            else {
                throw new Error('Cannot insert something that already exist!');
            }
            yield pool.execute("INSERT INTO `users_notice`(`id`, `name`, `price`, `description`, `url`, `lon`, `lat`, `streetAddress`, `numberStreet`, `city`, `postalCode`, `userId`) VALUES(:id, :name, :price, :description, :url, :lon, :lat, :streetAddress, :numberStreet, :city, :postalCode, :userId)", {
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
        });
    }
    static getAll(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const [results] = (yield pool.execute("SELECT * FROM `users_notice` WHERE `name` LIKE :search", {
                search: `%${name}%`,
            }));
            return results.length === 0 ? null : results.map(result => {
                const { id, lat, lon } = result;
                return {
                    id, lat, lon
                };
            });
        });
    }
}
export { AdRecord, };
//# sourceMappingURL=ad.record.js.map