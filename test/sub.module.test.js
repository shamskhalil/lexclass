const assert = require('chai').assert;
const { sub, hello } = require('../sub.module');

describe("Sub Module Tests", () => {
    describe("TESTING SUB FUNCTION >> ", () => {
        it("Subtracting 2 from 5 should return 3", () => {
            let ans = sub(5, 2);
            assert.equal(ans, 3);
        });
    });

    describe("TESTING HELLO FUNCTION >> ", () => {
        it("Passing Shams to hello func should Hello, Shams !", () => {
            let ans = hello();
            assert.typeOf(ans, 'string')
        });
    });

})