"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const config_1 = require("./config");
const seed_1 = require("./seed");
const dataContext_1 = require("./dataContext");
const assert = require("power-assert");
function extend(target, source) {
    for (const key in source) {
        target[key] = source[key];
    }
}
exports.extend = extend;
function clearData(data) {
    const result = JSON.parse(JSON.stringify(data));
    delete result._id;
    delete result.queryParam;
    delete result.sqlTemp;
    return result;
}
function asyncWrap(fn) {
    return (done) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield fn(done);
            done();
        }
        catch (error) {
            done(error);
        }
    });
}
;
function deay() {
    return new Promise((resove, reject) => {
        setTimeout(function () {
            resove(1);
        }, 200);
    });
}
describe(' base test for ' + config_1.currentDataBaseType, () => {
    let ctx, seedData;
    before(() => __awaiter(this, void 0, void 0, function* () {
        ctx = dataContext_1.DataContextFactory.GetDataContext(config_1.currentDataBaseType);
        seedData = seed_1.SeedData.getArticle();
        yield Promise.all(Array(10).fill(0).map((_, i) => i + 1).map(x => {
            const seedData = seed_1.SeedData.getArticle();
            seedData.id = seedData.id + x;
            return seedData;
        }).map(seedData => {
            const ctx = dataContext_1.DataContextFactory.GetDataContext("nedb");
            const data = new dataContext_1.Article();
            extend(data, seedData);
            return ctx.Create(data);
        }));
    }));
    after(function () {
    });
    beforeEach(function () {
    });
    afterEach(function () {
    });
    it('ctx.Create', () => __awaiter(this, void 0, void 0, function* () {
        const data = new dataContext_1.Article();
        extend(data, seedData);
        const createdData = yield ctx.Create(data);
        assert.deepStrictEqual(seedData, clearData(createdData));
    }));
    it('ctx.article.First', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield ctx.article.First(x => x.id == seedData.id, ["seedData.id"], [seedData.id]);
        assert.deepStrictEqual(seedData, clearData(data));
    }));
    it('ctx.article.Where', () => __awaiter(this, void 0, void 0, function* () {
        const data = yield ctx.article.Where(x => x.id == seedData.id, ["seedData.id"], [seedData.id]).ToList();
        assert.deepStrictEqual(seedData, clearData(data[data.length - 1]));
    }));
    it('ctx.article.Take', () => __awaiter(this, void 0, void 0, function* () {
        const limit = 2;
        const data = yield ctx.article.Take(limit).ToList();
        assert.deepStrictEqual(data.length, limit);
    }));
    it('ctx.article.OrderBy', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield ctx.article.OrderBy(x => x.id).ToList();
        for (let i = 0, l = result.length; i < l; i++) {
            result[i + 1] && assert.ok(result[i].id <= result[i + 1].id);
        }
    }));
    it('ctx.article.OrderByDesc', () => __awaiter(this, void 0, void 0, function* () {
        const result = yield ctx.article.OrderByDesc(x => x.id).ToList();
        for (let i = 0, l = result.length; i < l; i++) {
            result[i + 1] && assert.ok(result[i].id >= result[i + 1].id);
        }
    }));
    it('ctx.Update', () => __awaiter(this, void 0, void 0, function* () {
        function updateData(targetData) {
            targetData.description = "UpdatedDescription";
            targetData.topics.push("UpdatedTopic");
            targetData.detail.title = "UpdateDetailTitle";
        }
        const preData = yield ctx.article.First(x => x.id == seedData.id, ["seedData.id"], [seedData.id]);
        updateData(preData);
        updateData(seedData);
        const updatedData = yield ctx.Update(preData);
        assert.deepStrictEqual(seedData, clearData(updatedData));
    }));
    it('ctx.Delete', () => __awaiter(this, void 0, void 0, function* () {
        const preData = yield ctx.article.First(x => x.id == seedData.id, ["seedData.id"], [seedData.id]);
        yield ctx.Delete(preData);
        const deleteddata = yield ctx.article.First(x => x.id == seedData.id, ["seedData.id"], [seedData.id]);
        assert(deleteddata == null);
    }));
});
//# sourceMappingURL=index.js.map