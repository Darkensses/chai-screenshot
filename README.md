# chai-screenshot

This plugin was created to comparing two images using chai as an assertion library.<br>
It's inspired by the `haveScreenShot` method made by Playwright and
[chai-image](https://github.com/mooyoul/chai-image), a repo that seems to be unmaintained.
<br>
<br>

Only PNG images are supported at the moment.

### First steps

Install the plugin using npm:
```bash
npm i chai-screenshot --save-dev
```
Then add it to your test files:
```javascript
const { expect, use } = require('chai');
const chaiScreenshot = require("chai-screenshot");

use(chaiScreenshot);
```
and finally use it in your test scripts (this example uses mocha):
```javascript
it('The screenshot should match the expected image', function() {
    const actual = 'actual.png';
    const expected = 'expected.png';

    expect(actual).to.matchScreenshot(expected);
});
```

if the assertion fails, the plugin create a directory called `screenshot-output` and generates a diff png image there.
<br>
<br>
### How to use it
You can pass either a buffer, a filepath string and even a base64 image string as the actual parameter and the expected one. Feel free to use whatever combination that works for you!

```javascript
// Buffer:
const bufActual = Buffer.from(fs.readFileSync('actual.png'));
const bufExpected = Buffer.from(fs.readFileSync('expected.png'));

expect(bufActual).to.matchScreenshot(bufExpected);

// Filepath
expect('assets/actual.png').to.matchScreenshot('assets/expected.png');

// Base64 (example uses Selenium):
const actual = await driver.findElement({id: 'canvas'}).takeScreenshot(true);

expect(actual).to.matchScreenshot('assets/expected.png');

```

This plugin uses [pixelmatch](https://github.com/mapbox/pixelmatch) under the hood for visual comparison. So, that means that you're also able to configure the options that pixelmatch needs to do the diffing. In this example, let's set the threshold option to be less sensitive:

```javascript

expect("actual.png").to.matchScreenshot('expected.png', {
    diff: { threshold: 0.5 }
});
```

You can see the full pixelmatch's options list [here](https://github.com/mapbox/pixelmatch?tab=readme-ov-file#pixelmatchimg1-img2-output-width-height-options).

If you want to set a different directory to save the outputs after a test fails (image diff) or rename the default filename, you can set the option in this way:

```javascript
expect("actual.png").to.matchScreenshot('expected.png', {
    diff: { threshold: 0.5 },
    output: {
        dir: 'myFolder',
        name: 'test.png'} // Don't forget to add the .png extension
});

```

### Contribute
Wanna contribute? do you see a typo or an horrible line of code that can be fixed?<br>
✨Your PRs are welcome!✨<br>
You can also create an issue and discuss what improvements can be made.