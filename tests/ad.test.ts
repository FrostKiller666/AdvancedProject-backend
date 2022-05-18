import {AdRecord} from "../records/ad.record";

const defaultObject = {
    name: 'testowy',
    price: 0,
    description: 'Testowy Opis',
    url: 'https://test.com',
    lat: 24,
    lon: 55,
};

test('AdRecord returns data form database for one entry', async () => {

    const ad = await AdRecord.getOne('48f03b34-d6d4-11ec-bbb2-00d8613123ad');

    expect(ad).toBeDefined();
    expect(ad.id).toBe('48f03b34-d6d4-11ec-bbb2-00d8613123ad');
    expect(ad.name).toBe('Test');
    expect(ad.price).toBe(99);
});

test('AdRecord returns null if you pass un-existing ID', async () => {
    const ad = await AdRecord.getOne('48f03b34');

    expect(ad).toBeNull();
});

test('Insert record to database', async () => {
    const ad = await new AdRecord({
        ...defaultObject,
    });

    expect(await ad.insert()).toContain(ad.id);

});
// @TODO: Fix this problem
// test('Insert record to database if name is null', async() => {
//     const ad = await new AdRecord({
//         ...defaultObject,
//         name: '',
//     });
//
//     expect(await ad.insert()).toThrow('Nazwa ogłoszenie nie może być pusta oraz przekraczać 100 znaków.');
// });
