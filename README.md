<img src="https://lh6.googleusercontent.com/-xaqyhrkS28k/VDp2lC5qfYI/AAAAAAAAVbk/mUE8GtYSLpQ/w392-h600-no/poppy.jpg" height="150"/>

# Poppy.js

The lightest & fastest alternative to native browser popups.

## Features
* **Zero dependencies:** who needs jQuery/Prototype/Backbone for a simple popup library?
* **Ultra-light:** only **1.79kB** gzipped! Poppy's core logic is really small!
* **Promises pattern:** to handle users's inputs, just hook into Poppy's promises using the `.then` method.
* **.destroy() method:** need to get rid of Poppy? It will get out of your way in the cleanest possible way.
* **JS & basic CSS in the same file:** The minimum CSS rules required for the scaffolding of the popups is pre-included in the `.js` file (an extra CSS theme file needs to be supplied to adjust it to your tastes).
* **Theming via external file:** no need to overwrite any CSS rule because the look doesn't match your property. The library comes with no theme at all. You are free to create you own or use the default one in the repo.

## Limitations
* Browser support: IE9+ and modern browsers only. This is more a design choice as making the library work on older browser would have brought its weight up significantly.

## Demo & sandbox
Check out the live demo [here](http://caccialdo.github.io/poppyjs/demo).  

## How to install? As easy as 1...2...3

You only need to add **3 elements** to the HTML document to get yourself started:

1. Poppy's core logic:
  ```html
  <script src="path/to/poppy.min.js"></script>
  ```

1. a Poppy CSS theme:
  ```html
  <link rel="stylesheet" href="path/to/theme.css"/>
  ```

1. an initialization script:
  ```js
  var poppy = new Poppy(),
      confirm = poppy.confirm("Do you copy?");

  ...
  // Hook both success/failure handlers in one go.
  confirm.then(fulfill, reject);
  ...
  // Just hook the success handler.
  confirm.then(function (promptValue?) {...});
  ...
  // Just hook the failure handler.
  confirm.then(null, function () {...});
  ```

Your final HTML code should look like that:

```html
<!doctype html>
<html lang="en">
<head>
    <...>
    <link rel="stylesheet" href="path/to/theme.css"/>
    <script src="path/to/poppy.min.js"></script>
</head>
<body>
<...>
<script>
    var poppy = new Poppy(),
        confirm = poppy.confirm("Do you copy?");
</script>
</body>
</html>
```

## Poppy's options
When creating a new instance of Poppy, a configuration object can be passed to the constructor. Supported options include:

| Name | Type | Description | Default value |
|------|------|-------------|---------------|
| **theme** | string | The name of the theme you would like to use. The lightbox container will have a class of the same name. | `"default"` |

For e.g. the code needed to setup a custom instance of Poppy with the [darcula](http://ethanschoonover.com/solarized) theme would be:
```js
var poppy = new Poppy({
    theme: "darcula"
});
```

## DIY Poppy
To build Poppy yourself, make sure you have Node.js and NPM working. Then, `git clone` this repository and:

```sh
cd to/Poppy/project
npm install
npm start
```

Edit the files in the `src` directory and new assets will be automatically created in the `build` directory.

## Contribute
**Fork**, create a **Pull Request** and we'll review, discuss and merge it -- provided it's true to Poppy's spirit :-D.
