var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from "express";
import { AdRecord } from "../records/ad.record";
export const adRouter = Router()
    .get('/search/:name?', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ads = yield AdRecord.getAll((_a = req.params.name) !== null && _a !== void 0 ? _a : '');
    res.json(ads);
}))
    .get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ad = yield AdRecord.getOne(req.params.id);
    res.json(ad);
}))
    .post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ad = new AdRecord(req.body);
    yield ad.insert();
    res.json(ad);
}));
//# sourceMappingURL=ad.router.js.map