var postcss = require("postcss");
var pxtorem = require("..");

describe("pxtorem", function() {

    it("should work on the readme example", function() {
        var input =
        "h1 { margin: 0 0 20px; font-size: 32px; line-height: 1.2; letter-spacing: 1px; }";
        var output =
        "h1 { margin: 0 0 40rpx; font-size: 64rpx; line-height: 1.2; letter-spacing: 2rpx; }";
        var processed = postcss(pxtorem()).process(input).css
        // console.log(processed)
        expect(processed).toBe(output);
    })
})