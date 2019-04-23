# blox-hack.js

**blox-hack** is a wrapper library for [Blox](https://github.com/anselm/blox) that can
- expose the Blox-based scene object to the caller, and
- provide the custom render/update handles of the scene.

## Demo

**1) examples/viewer** ([live](https://j-devel.github.io/blox/blox-hack/examples/viewer/index.html) | [source code](https://github.com/j-devel/blox/tree/master/blox-hack/examples/viewer))

This viewer supports basic features such as scene selection and FPS control.

![ticks](https://j-devel.github.io/blox/blox-hack/examples/viewer/img/ticks.jpg)

## Usage

```html
<script src="dist/blox-hack.min.js"></script>

<script>
let scene = null;
const parent = 0;
const blox = new BloxHack({description: '../public/examples/example_tick.js'}, parent, {
    onBehaviorScene: bs => { // custom callback by blox-hack
        if (bs.isHack) { scene = bs; }
    },
});

const camera = new THREE.PerspectiveCamera(...);
const renderer = new THREE.WebGLRenderer(...);
setTimeout(() => {
    if (!scene) return;
    scene.updateScene(); // custom update method by blox-hack
    renderer.render(scene, camera);
}, 200); // 5 fps
</script>
```

## Build
```sh
$ npm install  # set up build tools
$ npm run build  # generate module files in lib/
```
