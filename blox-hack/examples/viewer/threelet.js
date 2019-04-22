// A lightweight viewer for THREE objects - https://github.com/w3reality

class Threelet {
    constructor(params) {
        const defaults = {
            canvas: null,
            optClassControls: null,
            optClassStats: null,
            optScene: null,
        };
        const actual = Object.assign({}, defaults, params);

        const canvas = actual.canvas;
        const classControls = actual.optClassControls;
        const classStats = actual.optClassStats;
        const optScene = actual.optScene;

        if (! canvas) {
            console.log('error: canvas not provided');
            return;
        }

        [this.camera, this.scene, this.renderer, this.render] =
            Threelet._init(canvas, classControls, classStats, optScene);

        this.onCreate();
    }
    onCreate() {
        this.render(); // first time
    }
    onDestroy() {
        //!!!!!!!!! TODO
    }

    // log with time splits
    log(...args) {
        if (! this._last) { // first time
            this._last = performance.now()/1000;
        }
        let now = performance.now()/1000;
        console.log(`==== ${now.toFixed(3)} +${(now - this._last).toFixed(3)} ====`);
        console.log(...args);
        console.log(`========`);
        this._last = now;
    }

    static _init(canvas, classControls, classStats, optScene) {
        const camera = new THREE.PerspectiveCamera(75, canvas.width/canvas.height, 0.001, 1000);
        camera.position.set(0, 0, 1.0);
        camera.up.set(0, 0, 1); // important for OrbitControls

        const renderer = new THREE.WebGLRenderer({
            // alpha: true,
            canvas: canvas,
        });
        console.log('renderer:', renderer);

        const resizeCanvas = (force=false) => {
            Threelet._resizeCanvasToDisplaySize(
                renderer, canvas, camera, force);
        };
        resizeCanvas(true); // first time

        // init basic objects --------
        const scene = optScene ? optScene : new THREE.Scene();
        const walls = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.BoxBufferGeometry(1, 1, 1)),
            new THREE.LineBasicMaterial({color: 0xcccccc}));
        walls.position.set(0, 0, 0);
        walls.name = 'walls';
        scene.add(walls);
        const axes = new THREE.AxesHelper(1);
        axes.name = 'axes';
        scene.add(axes);

        // init render stuff --------
        let stats = null;
        if (classStats) {
            stats = new classStats();
            stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            const statsDom = stats.dom;
            // statsDom.style.top = '90%';
            document.body.appendChild(statsDom);
        }
        const render = () => {
            if (stats) {
                stats.update();
            }
            resizeCanvas();
            renderer.render(scene, camera);
        };

        if (classControls) {
            const controls = new classControls(camera, renderer.domElement);
            controls.addEventListener('change', render);
        }

        return [camera, scene, renderer, render];
    }

    //!!!!!!!!!!!!!!!!!!!
    // TODO should have a cleanup method that's equivalent of
    // @freeRendererAndScenes() of w3reality-sdk.js

    // https://stackoverflow.com/questions/29884485/threejs-canvas-size-based-on-container
    static _resizeCanvasToDisplaySize(renderer, canvas, camera, force=false) {
        let width = canvas.clientWidth;
        let height = canvas.clientHeight;

        // adjust displayBuffer size to match
        if (force || canvas.width != width || canvas.height != height) {
            // you must pass false here or three.js sadly fights the browser
            // console.log "resizing: #{canvas.width} #{canvas.height} -> #{width} #{height}"
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    };

    static freeObjects(scene, namePrefix) {
        // https://stackoverflow.com/questions/35060831/how-to-remove-all-mesh-objects-from-the-scene-in-three-js
        for (let i = scene.children.length - 1; i >= 0; i--) {
            let ch = scene.children[i];
            if (ch.name.startsWith(namePrefix)) {
                scene.remove(ch);
                Threelet.disposeObject(ch);
            }
        }
    }
    static disposeMaterial(mat) {
        if (mat.map) mat.map.dispose();
        mat.dispose();
    }
    static disposeObject(obj) { // cf. https://gist.github.com/j-devel/6d0323264b6a1e47e2ee38bc8647c726
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) Threelet.disposeMaterial(obj.material);
        if (obj.texture) obj.texture.dispose();
    }
}
export default Threelet;
