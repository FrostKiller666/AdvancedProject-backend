import {AddEntity} from "../types";
import {ValidationError} from "../utils/errrors";

interface NewAddEntity extends Omit<AddEntity, 'id'> {
    id?: string;
}

class AddRecord implements AddEntity {
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

        this.name = obj.name;
        this.price = obj.price;
        this.description = obj.description;
        this.url = obj.url;
        this.lon = obj.lon;
        this.lat = obj.lat;

    }
}

export {
    AddRecord,
}
