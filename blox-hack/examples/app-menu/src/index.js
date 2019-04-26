const SDK = window.requirejs('w3reality-sdk');
const THREE = window.THREE;

const __pathBloxPathDev = '/media/w3reality/threejs/blox-hack';

class App extends SDK.App {
    // override
    static createWorld() {
        const world = new World(8, 16, 32);
        world.setSpawnPose([4, 2, 4+0, 0, 0]);
        world.setChunkSize(4);

        const addPlane = (mx, my, z, mat, offx=0, offy=0) => {
            for (let x = 0; x < mx; x++) {
                for (let y = 0; y < my; y++) {
                    world.blocks[offx+x][offy+y][z] = mat;
                }
            }
        };

        addPlane(8, 16, 0, BLOCK.GLASS);
        world.addBlock(2, 5, 2, BLOCK.MODEL_ANCHOR, {href: "", text: "hello_world.js"});
        world.addBlock(5, 7, 2, BLOCK.MODEL_ANCHOR, {href: "", text: "bouncing_scene.js"});
        world.addBlock(5, 8, 2, BLOCK.MODEL_ANCHOR, {href: "", text: "example_tick.js"});
        addPlane(2, 2, 0, BLOCK.MODEL_TEST, 4, 12); // rockets
        world.addBlock(2, 13, 2, BLOCK.MODEL_ANCHOR, {href: "", text: "proximity_events.js"});

        return world;
    }

    async loadModules() { // for dev mode
        const req = (path) => new Promise((res, rej) => window.requirejs([path], res));
        const __pathBloxPathDev = '/media/w3reality/threejs/blox-hack';

        const libs = [ // TODO localize these somehow...
            'OrbitControls-fixed.js',
            'hilbert3D.js',
            'WebGL.js',
            'LineSegmentsGeometry.js',
            'LineGeometry.js',
            'WireframeGeometry2.js',
            'LineMaterial.js',
            'LineSegments2.js',
            'Line2.js',
            'Wireframe.js',
            // 'three-gltf-loader.js',
            'three-gltf-loader--debug.js',
            'ammo.js',
            'XRSupport.js',
            'three.proton.js',
        ];
        for (let lib of libs) {
            const ret = await req(`${__pathBloxPathDev}/public/lib/${lib}`);
            // console.log('@@', ret); // e.g. undefined, Ammo, ...
        }
        // return (await import(`${__pathBloxPathDev}/blox-hack/src/index.js`)).default;
        return (await req(`${__pathBloxPathDev}/blox-hack/dist/blox-hack.esm.min.js`)).default;
    }

    // override
    constructor(data, name) {
        super(data, name);

        // const scene = new THREE.Scene();
        // this.setScene(scene); // the scene set is auto cleared on free()
        // setTimeout(() => { this.pauseLoop(); }, 2000);
        // return;//!!!!!!

        this.blox = null;
        this.bs = null;

        (async () => {
            const BloxHack = await this.loadModules();
            // console.log('@@ BloxHack:', BloxHack);

            const ex = 'hello_world.js'; // ok
            // const ex = 'bouncing_scene.js'; // TODO
            // const ex = 'example_tick.js'; // TODO; how to shim path for fonts/ ????
            // const filePath = `${__pathBloxPathDev}/public/examples/${ex}`;
            const filePath = `${__pathBloxPathDev}/blox-hack/examples/app-menu/blox-examples/${ex}`;

            const parent = 0;
            this.blox = new BloxHack({description: filePath}, parent, {
                onBehaviorScene: bs => {
                    bs.rotation.x = Math.PI/2;
                    this.setScene(bs); // the scene set is auto cleared on free()
                    this.bs = bs;
                },
            });
        })(); // end of async () => {}
    }

    // override
    onClick(mx, my, rm) {
        // console.log('@@ onClick():', mx, my, rm);
        // if (this.adapter) {
        //     const isec = this.render.raycastFromCamera(
        //         mx, my, [this.adapter.modelContext,], true);
        //     // console.log('@@ isec:', isec);
        //     const isects = isec ? [isec,] : [];
        //
        //     this.adapter.onHover(isects); // update lines
        //     if (! rm) {
        //         this.adapter.onClick(isects);
        //     }
        // }
    }

    // override
    update(t, dt) {
        super.update(t, dt);
        if (this.bs) {
            this.bs.update(t/1000.0);
        }
    }

    // override
    free() {
        // TODO clear blox stuff
        super.free();
    }

    static isAjaxSuccessful(stat) {
        // console.log('stat:', stat);
        // https://stackoverflow.com/questions/21756910/how-to-use-status-codes-200-404-300-how-jquery-done-and-fail-work-internally
        return stat >= 200 && stat < 300 || stat === 304;
    }
}

export default App;
