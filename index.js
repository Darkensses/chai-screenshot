const { AssertionError } = require('chai');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

// Author: github.com/tawfiknouri
// The original function was taken from:
// https://github.com/webdriverio/webdriverio/issues/5208#issuecomment-613029075
function isBase64(str) {
  let notBase64 = /[^A-Z0-9+\/=]/i;
  //const isString = (typeof str === 'string' || str instanceof String);

  // if (!isString) {
  //   let invalidType;
  //   if (str === null) {
  //     invalidType = 'null';
  //   } else {
  //     invalidType = typeof str;
  //     if (invalidType === 'object' && str.constructor && str.constructor.hasOwnProperty('name')) {
  //       invalidType = str.constructor.name;
  //     } else {
  //       invalidType = `a ${invalidType}`;
  //     }
  //   }
  //   throw new TypeError(`Expected string but received ${invalidType}.`);
  // }

  const len = str.length;
  if (!len || len % 4 !== 0 || notBase64.test(str)) {
    return false;
  }
  const firstPaddingChar = str.indexOf('=');
  return firstPaddingChar === -1 ||
    firstPaddingChar === len - 1 ||
    (firstPaddingChar === len - 2 && str[len - 1] === '=');

}

function checkValues(value, type) {
  if(typeof value === 'string') {
    if(isBase64(value) === true) {
      try {
        return PNG.sync.read(Buffer.from(value, 'base64'));
      } catch (error) {
        throw new AssertionError(`${type} string is not a valid PNG encoded in Base64.\n\r${error}`)
      }
    } else if(fs.existsSync(value)) {
      try {
        return PNG.sync.read(Buffer.from(fs.readFileSync(value)));
      } catch (error) {
        throw new AssertionError(`${type} file is not a PNG.\n\r${error}`)
      }
    } else {
      throw new AssertionError(`${type} string is neither a valid Base64 string nor a valid file path.`)
    }
  }
  else { // (Buffer.isBuffer(value))
    try {
      return PNG.sync.read(value);
    } catch (error) {
      throw new AssertionError(`${type} file is not a PNG.\n\rPNG ${error}`)
    }
  }
}

module.exports = (chai) => {

  chai.Assertion.addMethod('matchScreenshot', function(expected, options={diff: {threshold: 0.1}}){
    const DEFAULT = {
      output: {
        dir: 'screenshot-output',
        name: `diff_${Date.now()}.png`
      }
    }

    const dir = options.output.dir ? options.output.dir : DEFAULT.output.dir;
    const name = options.output.name ? options.output.name : DEFAULT.output.name;
    const actual = this._obj;

    chai.assert(typeof actual === 'string' || Buffer.isBuffer(actual), `Actual screenshot should be an encoded Base64 string, file path string or a Buffer but received a ${typeof actual}`);

    const img1 = checkValues(expected, 'Expected');
    const img2 = checkValues(actual, 'Actual');
    const {width, height} = img1;
    const diff = new PNG({width, height});
    const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, options.diff);
    const filename = `${dir}/${name}`;

    if(numDiffPixels > 0) {
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(filename, PNG.sync.write(diff));
    }

    this.assert(
      numDiffPixels === 0,
      `expected the screenshot to match the image, but DiffPixels = ${numDiffPixels}. Output diff saved to ${filename}`,
      `expected the screenshot not to match the image`,
      0,
      numDiffPixels,
      chai.config.showDiff
    );
  });
}