import { AdRecord } from "../records/ad.record";
const defaultObject = {
    name: 'testowy',
    price: 0,
    description: 'Testowy Opis',
    url: 'https://test.com',
    lat: 24,
    lon: 55,
};
test('Can build AdRecord', () => {
    const ad = new AdRecord(defaultObject);
    expect(ad.name).toBe('testowy');
    expect(ad.description).toBe('Testowy Opis');
});
test('Validation invalid price', () => {
    expect(() => new AdRecord(Object.assign(Object.assign({}, defaultObject), { price: -2 }))).toThrow('Cena nie może być ujemna oraz przekraczać jednego miliona polskich złotych!');
});
// @TODO: Create all validations.
//# sourceMappingURL=ad-record.test.js.map