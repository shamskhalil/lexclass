const assert = require('chai').assert;
const { add } = require('../add.module');

describe("Add Module Tests", () => {
    it("Adding 2 and 3 should return 5", () => {
        let sum = add(2, 3);
        assert.equal(sum, 5);
    });
})