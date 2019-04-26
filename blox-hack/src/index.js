
// functionality --
// 1) workaround eval(className) errors in Blox.add() due to webpack'ish side effect
//    kludge for usage via <script src="../hack/lib/blox-hack.js"></script>
// 2) this exposes a customized BehaviorScene class; do make sure
//    import {BehaviorScene} is disabled blox.js
import './expose-behaviors.js';

import { Blox } from '../../public/js/Blox.js';
//import { Blox } from '../../public/js/Blox-j.js';

// note - disabled eslint-loader in webpack.config.js for semicolon workaround
// note - per https://stackoverflow.com/questions/36577683/babel-error-class-constructor-foo-cannot-be-invoked-without-new
//        in .babelrc, added "exclude": ["transform-es2015-classes"]
// note - 'npm run build' is failing due to uglify --
//         ERROR in blox-hack.min.js from UglifyJs
//         Unexpected token: name «BehaviorMesh», expected: punc «;» [blox-hack.min.js:111,6]
//     per https://github.com/webpack-contrib/uglifyjs-webpack-plugin/issues/78
//     workaround is: npm i -D uglifyjs-webpack-plugin@beta
//     after that LGTM

class BloxHack extends Blox {
    constructor(args, parent=0, data={}) {
        super(args, parent);
        console.log('@@ setting onBehaviorScene');
        this.onBehaviorScene = data.onBehaviorScene;
    }

    // override
    add(args) {
        console.log('@@ args:', args);
        const out = super.add(args);
        if (args.label === 'scene') {
            console.log('@@ out for scene:', out);
            if (this.onBehaviorScene) { this.onBehaviorScene(out); }
        }

        
        return out;
    }
}

export default BloxHack;
