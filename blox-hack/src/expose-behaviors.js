
// custom hack version
class BehaviorScene extends THREE.Scene {
    constructor(args) {
        console.log('@@ BehaviorScene(): hello from custom version');
        THREE.Loader.extractUrlBase = THREE.LoaderUtils.extractUrlBase
        let props = args.description || {}
        let blox = args.blox
        super()
        // this.renderer = blox.add({label:"renderer"})
        // this.camera = blox.add({label:"camera"})
        // this.renderer.reset(this,this.camera,this.camera)
        //========
        // emulate updateScene() of BehaviorRenderer.js
        this.update = (time) => {
            // console.log('@@ updateScene(): time:', time);
            blox.on_event({
                blox: blox,
                name: "on_tick",
                interval: time,
            });
        };
    }
    on_blox_added(args) {
        console.log('@@ BehaviorScene.on_blox_added() hello');
        let scene = this
        let child = args.child
        let objects = child.query({instance:THREE.Object3D,all:true})
        objects.forEach((value)=>{
            if(!scene) console.error("scene is bad")
            if(!scene) return
            scene.add(value)
            if(value instanceof THREE.PerspectiveCamera) {
                // this.renderer.reset(this,value,value)
            }
        })
    }
}

// Basic
import {BehaviorRenderer} from '../../public/js/BehaviorRenderer.js';
// import {BehaviorScene} from '../../public/js/BehaviorScene.js'; // use custom version above
import {BehaviorCamera} from '../../public/js/BehaviorCamera.js';
import {BehaviorLight} from '../../public/js/BehaviorLight.js';
import {BehaviorMesh} from '../../public/js/BehaviorMesh.js';
// Some objects
import {BehaviorSky} from '../../public/js/BehaviorSky.js';
import {BehaviorHeart} from '../../public/js/BehaviorHeart.js';
import {BehaviorText} from '../../public/js/BehaviorText.js';
import {BehaviorTextPanel} from '../../public/js/BehaviorTextPanel.js';
// Motion and physics, some of this may merge together
import {BehaviorIntent} from '../../public/js/BehaviorIntent.js';
import {BehaviorPhysics, BehaviorPhysical} from '../../public/js/BehaviorPhysics.js';
import {BehaviorCollide} from '../../public/js/BehaviorCollide.js';
// Motion models for player
import {BehaviorOrbit} from '../../public/js/BehaviorOrbit.js'; // TODO this one really needs to be rewritten
import {BehaviorWalk} from '../../public/js/BehaviorWalk.js';
// Some other behaviors
import {BehaviorLine, BehaviorBounce, BehaviorOscillate, BehaviorWander, BehaviorStare } from '../../public/js/BehaviorBounce.js';
import {BehaviorParticles} from '../../public/js/BehaviorParticles.js';
import {BehaviorProton} from '../../public/js/BehaviorProton.js';
import {BehaviorEmitter} from '../../public/js/BehaviorEmitter.js';

Object.assign(window, {
    // Basic
    BehaviorRenderer,
    BehaviorScene,
    BehaviorCamera,
    BehaviorLight,
    BehaviorMesh,
    // Some objects
    BehaviorSky,
    BehaviorHeart,
    BehaviorText,
    BehaviorTextPanel,
    // Motion and physics, some of this may merge together
    BehaviorIntent,
    BehaviorPhysics, BehaviorPhysical,
    BehaviorCollide,
    // Motion models for player
    BehaviorOrbit,
    BehaviorWalk,
    // Some other behaviors
    BehaviorLine, BehaviorBounce, BehaviorOscillate, BehaviorWander, BehaviorStare,
    BehaviorParticles,
    BehaviorProton,
    BehaviorEmitter,
});
