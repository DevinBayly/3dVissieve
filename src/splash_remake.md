---
toc: false
title: Splash Remake
sql:
  publications: ./data/new_layout.db
---
```js
import {makeForceCollide,makeChart,giveSvgViewReference} from "./force_collide.js"
```



```js
// right now type_counts is a apache arrow and can be converted into a workable d3 format with 
let json_data = type_counts.toArray().map(e=> e.toJSON())
console.log(json_data)

// next we want to make the format look liek the makeChart function expects 

// now we will extent the json data to include the r values from the scale
let chart_data = json_data.map(e=>({...e, r:e.num}))
// make a observed variable that we can do things with later in the file
// let chart_type= Generators.observe(notifyChartType)

// 
// setup so that we can have view, and later configure for resize
let chart_type = view(giveSvgViewReference())
```

<style>
.circle-hover {
  fill-opacity:1;
}
</style>
## ${chart_type}s



```js
import * as THREE from 'npm:three';
import { CSS2DRenderer,CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
function makeBox(width,data) {
const height = width
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75,width/height,.1,5000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(width,height)
const div = document.querySelector(".threed")
const controls = new OrbitControls(camera,renderer.domElement)
controls.update()

// make a geo
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color:new THREE.Color(Math.random(),Math.random(),Math.random())})
const cube = new THREE.Mesh(geometry,material)
// scene.add(cube)
camera.position.z =80
console.log("made box")

const plane = new THREE.PlaneGeometry(3,3)

const geobuf = new THREE.InstancedBufferGeometry()
geobuf.index = plane.index
geobuf.attributes = plane.attributes


const positions = new Float32Array(data.length*3)



for ( let i = 0; i < data.length; i++) {

  let d = data[i]
  positions[i*3+0] = d.x
  positions[i*3+1] = 0
  positions[i*3+2] = d.y

}

function dispose() {
  this.array=null
}


// changing the name of the position array to the value from the tutorial https://github.com/mrdoob/three.js/blob/dev/examples/webgl_buffergeometry_instancing_billboards.html
geobuf.setAttribute("translate",new THREE.InstancedBufferAttribute(positions,3))

// what does this do?
geobuf.computeBoundingSphere()
// updates the bounding box attribute if needed

// vertex shader code
const vertShader = `
  precision highp float;
  // these are normally included but since we are doing raw they aren't

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  uniform float time;
  attribute vec3 position;
  attribute vec3 translate;
  attribute vec2 uv;
  varying vec2 vUV;
  void main() {
    vec4 mvPosition = modelViewMatrix* vec4(translate,1.0);
    			vec3 trTime = vec3(translate.x + time,translate.y + time,translate.z + time);
    float scale =  sin( trTime.x * 2.1 ) + sin( trTime.y * 3.2 ) + sin( trTime.z * 4.3 );
			float vScale = scale;
			scale = scale * 10.0 + 10.0;
    // to make things pulse bigger and smaller
    //mvPosition.xyz+= position * scale;
    mvPosition.xyz+= position ;
    vUV=uv;
    gl_Position=projectionMatrix*mvPosition;
  }
`
const fragShader = `
precision highp float;
uniform sampler2D map;
varying vec2 vUV;
void main() {
  vec4 diffuseColor = texture2D(map,vUV);
  gl_FragColor = diffuseColor;
}
`

// make material
const instmat = new THREE.RawShaderMaterial({
  uniforms:{
    'map': {value: new THREE.TextureLoader().load("./data/circle.png")},
    'time':{value:0.0},
  },
    vertexShader:vertShader,
    fragmentShader:fragShader,
    depthTest:true,
    depthWrite:true
  
})
const instmesh = new THREE.Mesh(geobuf,instmat)
// instmesh.scale.set(500,500,500)
scene.add(instmesh)


// animate
function animate() {
  const time = performance.now() *.0005
  instmat.uniforms["time"].value = time

			// instmesh.rotation.x = time * 0.2;
			// instmesh.rotation.y = time * 0.4;
  renderer.render(scene,camera)
}
renderer.setAnimationLoop(animate)
  controls.update()
  return renderer.domElement
}
// make a function that receives the data that's selected from the bubble layout, and runs the layout system, providing the make box function as a callback
```

```js

// this cell is responsible for generating the laid out data when it's done being force graphed, and the makeBox function is going to depend on the result
// import {layoutData} from "./force_figure_layout.js"
// const laidoutData = layoutData(selectedFigures)

// do the same process with background running and see if we can give periodic updates to the screen
```



<div class="grid grid-cols-2">
  <div class="card">${
  resize((width)=> 
  makeChart(chart_data,width,4)
  )
}</div>
  <div class="card">${resize(width=> makeBox(width,laidoutData))}</div>
</div>



```sql id=type_counts
SELECT string_value as 'group',COUNT(*) as 'num' FROM publications.figure_property GROUP BY string_value;
```
```sql id=selectedFigures display
SELECT f.id AS figure_id, 
                p.id AS paper_id, 
                p.title, 
                p.doi, 
                p.publication_date, 
                p.oa_url, 
                p.pdf_path, 
                p.inst_id, 
                p.primary_topic_id,
                f.local_path, 
                f.server_path, 
                fp.name, 
                fp.int_value AS ChartType,  
                fp.string_value AS Something, 
                fp.xPos, 
                fp.yPos, 
                fp.zPos
            FROM 
                publications.figure f
            LEFT JOIN 
                publications.paper p ON f.paper_id = p.id
            LEFT JOIN 
                publications.figure_property fp ON f.id = fp.figure_id AND fp.string_value =${chart_type} AND fp.string_value IS NOT NULL
            ORDER BY 
                f.id;
```
```sql
SELECT COUNT(*) FROM publications.figure_property fp WHERE fp.string_value = ${chart_type} AND fp.string_value IS NOT NULL

```