var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AdRecord } from "../records/ad.record";
import { pool } from "../utils/db";
const defaultObject = {
    name: 'testowy',
    price: 0,
    description: 'Testowy Opis',
    url: 'https://test.com',
    lat: 24,
    lon: 55,
};
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield pool.end();
}));
test('getOne in AdRecord returns data form database for one entry', () => __awaiter(void 0, void 0, void 0, function* () {
    const ad = yield AdRecord.getOne('48f03b34-d6d4-11ec-bbb2-00d8613123ad');
    expect(ad).toBeDefined();
    expect(ad.id).toBe('48f03b34-d6d4-11ec-bbb2-00d8613123ad');
    expect(ad.name).toBe('Test');
    expect(ad.price).toBe(99);
}));
test('AdRecord returns null if you pass un-existing ID', () => __awaiter(void 0, void 0, void 0, function* () {
    const ad = yield AdRecord.getOne('48f03b34');
    expect(ad).toBeNull();
}));
test('Insert record to database', () => __awaiter(void 0, void 0, void 0, function* () {
    const ad = yield new AdRecord(Object.assign({}, defaultObject));
    expect(yield ad.insert()).toContain(ad.id);
}));
// @TODO: Fix this problem with expect
// test('Insert record to database if name is null', async() => {
//     const ad = await new AdRecord({
//         ...defaultObject,
//         name: '',
//     });
//
//     expect(await ad.insert()).toThrow('Nazwa ogłoszenie nie może być pusta oraz przekraczać 100 znaków.');
// });
test('getAll in AdRecord should get all results with written parameters', () => __awaiter(void 0, void 0, void 0, function* () {
    const ad = yield AdRecord.getAll('y');
    expect(ad).not.toEqual([]);
    expect(ad[0].id).toBeDefined();
}));
//# sourceMappingURL=ad.test.js.map