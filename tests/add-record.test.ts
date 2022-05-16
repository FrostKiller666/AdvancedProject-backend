import {AddRecord} from "../records/add.record";

const defaultObject = {
    name: 'testowy',
    price: 0,
    description: 'Testowy Opis',
    url: 'https://test.com',
    lat: 24,
    lon: 55,
};

test('Can build AdRecord', () => {
    const add = new AddRecord(defaultObject);

    expect(add.name).toBe('testowy');
    expect(add.description).toBe('Testowy Opis');
});

test('Validation invalid price', () => {
    expect(() => new AddRecord({
        ...defaultObject,
        price: -2,
    })).toThrow('Cena nie może być ujemna oraz przekraczać jednego miliona polskich złotych!');
});

// @TODO: Create all validations.
