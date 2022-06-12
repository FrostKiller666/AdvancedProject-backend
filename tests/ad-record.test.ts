import {AdRecord} from "../records/ad.record";
import {NewAddEntity} from "../types";

const defaultObject: NewAddEntity = {
    name: 'testowy',
    price: 0,
    description: 'Testowy Opis',
    url: 'https://test.com',
    lat: 24,
    lon: 55,
    city: 'Warszawa',
    postalCode: '000-01',
};

test('Can build AdRecord', () => {
    const ad = new AdRecord(defaultObject);

    expect(ad.name).toBe('testowy');
    expect(ad.description).toBe('Testowy Opis');
});

test('Validation invalid price', () => {
    expect(() => new AdRecord({
        ...defaultObject,
        price: -2,
    })).toThrow('Cena nie może być ujemna oraz przekraczać jednego miliona polskich złotych!');
});

// @TODO: Create all validations.
