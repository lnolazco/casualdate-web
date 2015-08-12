# selectCircular
Select element with a circular design

## Installation

Use bower to install package select-circular.
```bash
  bower install select-circular --save
```

Then in your page add the following references:
```html-
  <link rel="stylesheet" type="text/css" href="lib/select-circular/selectCircular.css">
  <script src="lib/select-circular/selectCircular.js"></script>
```

## How to Use

In your html page add a select element with the number of options you need.
For example 5 elements:

```html
<select id="selDemo"></select>
```

Then, in your javascript file you will need to initialize the circular element 'SelectCircular' with the following parameters:
- id of the select element. In this example 'selDemo'.
- array with the images.
- size of the radio (optional value, by default is 100px).
- function to be called when an image is selected.

```javascript
var images = ['img/smiley/happy_1.png',
            'img/smiley/happy_2.png',
            'img/smiley/happy_3.png',
            'img/smiley/happy_4.png',
            'img/smiley/happy_5.png'];
SelectCircular('selDemo',images, 100, function(val){
  console.log('image selected: ' + val);
});
```

Thanks :)
