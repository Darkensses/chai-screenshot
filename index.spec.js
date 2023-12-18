const { expect, use, AssertionError } = require('chai');
const fs = require('fs');

use(require('./index.js'));

describe('chai-screenshot', function() {
    context("When actual is not a base64 string", function() {
        it('should throw an AssertionError', function() {
            expect(() =>{
                expect(btoa('Hello world')).to.matchScreenshot('assets/canvas.png')
            }).to.throw(AssertionError)
            .with.property('message', 'Actual string is not a valid PNG encoded in Base64.\n\rError: unrecognised content at end of stream')
        });
    });

    context("When expected is not a base64 string", function() {
        it('should throw an AssertionError', function() {
            expect(() =>{
                expect('assets/canvas.png').to.matchScreenshot(btoa('Hello world'))
            }).to.throw(AssertionError)
            .with.property('message', 'Expected string is not a valid PNG encoded in Base64.\n\rError: unrecognised content at end of stream')
        });
    });

    context("When actual image is a JPG", function() {
        it('should throw an AssertionError', function() {
            expect(() =>{
                expect('assets/canvas.jpg').to.matchScreenshot('assets/canvas.png')
            }).to.throw(AssertionError)
            .with.property('message', 'Actual file is not a PNG.\n\rError: unrecognised content at end of stream')
        });
    });

    context("When expected image is a JPG", function() {
        it('should throw an AssertionError', function() {
            expect(() =>{
                expect('assets/canvas.png').to.matchScreenshot('assets/canvas.jpg')
            }).to.throw(AssertionError)
            .with.property('message', 'Expected file is not a PNG.\n\rError: unrecognised content at end of stream')
        });
    });

    context("When actual file path doesn't exist", function() {
        it('should throw an AssertionError', function() {
            expect(() =>{
                expect('wrong_path.png').to.matchScreenshot('assets/canvas.png')
            }).to.throw(AssertionError)
            .with.property('message', 'Actual string is neither a valid Base64 string nor a valid file path.')
        });
    });

    context("When expected file path doesn't exist", function() {
        it('should throw an AssertionError', function() {
            expect(() =>{
                expect('assets/canvas.png').to.matchScreenshot('wrong_path.png')
            }).to.throw(AssertionError)
            .with.property('message', 'Expected string is neither a valid Base64 string nor a valid file path.')
        });
    });

    context("When actual file doesn't match the expected image", function() {
        it.only('Should save outputs', function() {
            try {
                expect('assets/canvas_test01.png').to.matchScreenshot('assets/canvas.png', {output: {name: 'test.png'}});
            } catch (error) {}

            expect(() =>
                fs.statSync('screenshot-output/test.png')
            ).to.not.throw(Error);
        });
    });
});