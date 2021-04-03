import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202030);
scene.rotation.y = THREE.Math.degToRad(180)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
var group = new THREE.Group();

var loaded_texture = new THREE.TextureLoader().load("data:image/png;base64," + texture);
loaded_texture.magFilter = THREE.NearestFilter;

var x_val = []
var x_pos = 0
var x_cycle = 0

var y_val = []
var y_pos = 0
var y_cycle = 0

var x_piv = 0
var y_piv = 0
var z_piv = 0

var x_rot = 0
var y_rot = 0
var z_rot = 0

for (var part of model) {

    preProcessCubes(part)

    /* var raw_offset = findOffset(cube)
    var offset = raw_offset[0]
    var render = raw_offset[1]
    if (!render) { continue }*/

    /* for (var cube of part.chld.value.value) {
        if (cube.hasOwnProperty('chld')) {
            for (var cube2 of cube.chld.value.value) { 
                var raw_offset = findOffset(cube2)
                var offset = raw_offset[0]
                var render = raw_offset[1]
                if (!render) { continue }
                addCube(cube2, offset)
            }
            continue
        }
        var raw_offset = findOffset(cube)
        var offset = raw_offset[0]
        var render = raw_offset[1]
        if (!render) { continue }
        addCube(cube, offset)
    } */
}

function preProcessCubes(part) {
    var raw_offset = findOffset(part)
    var offset = raw_offset[0]
    var render = raw_offset[1]
    if (!render) { return }

    processCubes(part, offset)
}

function processCubes(part, offset) {
    if (part.hasOwnProperty('chld')) {
        window[part.nm.value] = new THREE.Group();
        /*window[part.nm.value].position.set(
            part.piv.value.value[0],
            part.piv.value.value[1],
            part.piv.value.value[2]
        )

        x_piv += (part.piv.value.value[0])
        y_piv += (part.piv.value.value[1])
        z_piv += (part.piv.value.value[2])

        if (part.hasOwnProperty('rot')) {
            window[part.nm.value].rotation.set(
                THREE.Math.degToRad( part.rot.value.value[0] ),
                THREE.Math.degToRad( part.rot.value.value[1] ),
                THREE.Math.degToRad( part.rot.value.value[2] )
            )

            x_rot += (THREE.Math.degToRad(part.rot.value.value[0]))
            y_rot += (THREE.Math.degToRad(part.rot.value.value[1]))
            z_rot += (THREE.Math.degToRad(part.rot.value.value[2]))
        }*/

        scene.add( window[part.nm.value] )

        for (var cube of part.chld.value.value) {
            if (cube.hasOwnProperty('chld')) {
                processCubes(cube)
            } else {
//                addCube(cube, offset, window[part.nm.value], [x_piv, y_piv, z_piv], [x_rot, y_rot, z_rot])

                x_piv = 0
                y_piv = 0
                z_piv = 0

                x_rot = 0
                y_rot = 0
                z_rot = 0

                addCube(cube, offset, window[part.nm.value], [x_piv, y_piv, z_piv], [x_rot, y_rot, z_rot])
            }
        }
    } else {
        return
    }
}

function findOffset(cube) {
    var offset = [ 0, 0, 0 ]
    var render = true

    if (part.nm.value.includes("NOLOAD")) {
        render = false
    } else if (part.nm.value.includes("HEAD")) {
        offset = [ 0, 0, 0 ]
    } else if (part.nm.value.includes("TORSO")) {
        offset = [ 0, 0, 0 ]
    } else if (part.nm.value.includes("LEFT_ARM")) {
        offset = [ -5.5, -2, 0 ]
    } else if (part.nm.value.includes("RIGHT_ARM")) {
        offset = [ 5.5, -2, 0 ]
    } else if (part.nm.value.includes("LEFT_LEG")) {
        offset = [ -2.1, -12.5, 0 ]
    } else if (part.nm.value.includes("RIGHT_LEG")) {
        offset = [ 2.1, -12.5, 0 ]
    }

    return [offset, render]
}

function addCube(cube, offset = [0, 0, 0], group, piv_val, rot_val) {    
    var from = cube.props.value.f.value.value
    var to = cube.props.value.t.value.value
    var size = to.map(function (x, i) {
        return x - from[i]
    })
    
    offset = offset.map(function (x, i) {
        if (i == 1) {
            return x + 6
        } else {
            return x
        }
    })

    var pos = to.map(function (x, i) {
        return (offset[i] + ((x + from[i]) / 2)) - piv_val[i]
    })

    var cube_size = new THREE.BoxGeometry(size[0], size[1], size[2])

    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: loaded_texture,
        transparent: true,
        opacity: 1,
        //side: THREE.DoubleSide,
        alphaTest: 0.5,
    });

    var gen_cube = new THREE.Mesh(cube_size, material);
    gen_cube.position.set(pos[0], pos[1], pos[2])

    x_val.push(pos[0])
    y_val.push(pos[1])

    if (cube.hasOwnProperty('rot')) {
        var rot = cube.rot.value.value.map(function (x, i) {
            return THREE.Math.degToRad(x) - rot_val[i]
        })
        gen_cube.rotation.set(rot[0], rot[1], rot[2])
    }

    var texture_width = cube.props.value.tw.value
    var texture_height = cube.props.value.th.value

    var geometry = gen_cube.geometry
    var uvAttribute = geometry.attributes.uv;
    var face = 0;

    for (var i = 0; i < uvAttribute.count; i++) {
        if ((i % 4) == 3) {
            if (face == 0) {
                var uv_face = cube.props.value.e.value.uv.value.value
            } else if (face == 1) {
                var uv_face = cube.props.value.w.value.uv.value.value
            } else if (face == 2) {
                var uv_face = cube.props.value.u.value.uv.value.value
            } else if (face == 3) {
                var uv_face = cube.props.value.d.value.uv.value.value
            } else if (face == 4) {
                var uv_face = cube.props.value.s.value.uv.value.value
            } else if (face == 5) {
                var uv_face = cube.props.value.n.value.uv.value.value
            } else {
                face++
                continue
            }

            var raw_uv = uv_face.map(function (x, i) {
                if ((i % 2) == 0) {
                    return x / texture_width
                } else {
                    return 1 - (x / texture_height)
                }
            })

            uvAttribute.setXY(i - 3, raw_uv[0], raw_uv[1]);
            uvAttribute.setXY(i - 2, raw_uv[2], raw_uv[1]);
            uvAttribute.setXY(i - 1, raw_uv[0], raw_uv[3]);
            uvAttribute.setXY(i - 0, raw_uv[2], raw_uv[3]);

            face++
        }
    }

    group.add(gen_cube)
}

for (var i = 0; i < x_val.length; i++) {
    x_pos += x_val[i]
    x_cycle = i + 1
}
x_pos = x_pos / x_cycle

for (var i = 0; i < y_val.length; i++) {
    y_pos += y_val[i]
    y_cycle = i + 1
}
y_pos = y_pos / y_cycle


scene.add( group )
// group.position.set( - x_pos, - y_pos, 0 )

/*const axesHelper = new THREE.AxesHelper( 50 );
scene.add( axesHelper );*/

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// camera.position.y = y_pos;
// camera.position.x = x_pos;
camera.position.z = 40;

/* scene.traverse( function( object ) {

    if ( object.isMesh ) console.log( object );

} ); */

function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

document.addEventListener( 'mousewheel', (event) => {
    camera.position.z += event.deltaY / 5;
});

var mouseDown = false,
    mouseX = 0,
    mouseY = 0;

function onMouseMove(evt) {
    if (!mouseDown) {
        return;
    }

    evt.preventDefault();

    var deltaX = evt.clientX - mouseX,
        deltaY = evt.clientY - mouseY;
    mouseX = evt.clientX;
    mouseY = evt.clientY;
    rotateScene(deltaX, deltaY);
}

function onMouseDown(evt) {
    evt.preventDefault();

    mouseDown = true;
    mouseX = evt.clientX;
    mouseY = evt.clientY;
}

function onMouseUp(evt) {
    evt.preventDefault();
    
    mouseDown = false;
}

function addMouseHandler(canvas) {
    canvas.addEventListener('mousemove', function (e) {
        onMouseMove(e);
    }, false);
    canvas.addEventListener('mousedown', function (e) {
        onMouseDown(e);
    }, false);
    canvas.addEventListener('mouseup', function (e) {
        onMouseUp(e);
    }, false);
}

function rotateScene(deltaX, deltaY) {
    //body.rotation.y += deltaX / 200;
    scene.rotation.y += deltaX / 200;
    scene.rotation.x = (scene.rotation.x + deltaY / 200).clamp(THREE.Math.degToRad(-90), THREE.Math.degToRad(90));
    // body.rotation.x += deltaY / 100;
}

addMouseHandler(document)

animate();

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};