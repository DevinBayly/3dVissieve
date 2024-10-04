---
toc: false
title: Splash Remake
sql:
  publications: ./data/new_layout.db
---
```js
import {makeForceCollide,makeChart,giveSvgViewReference} from "./force_collide.js"
```


```sql id=type_counts
SELECT string_value as 'group',COUNT(*) as 'num' FROM publications.figure_property GROUP BY string_value;
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



```js
import * as THREE from 'npm:three';
import { CSS2DRenderer,CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
function makeBox(width) {
const height = width
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75,width/height,.1,1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(width,height)
const div = document.querySelector(".threed")
renderer.domElement

// make a geo
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color:new THREE.Color(Math.random(),Math.random(),Math.random())})
const cube = new THREE.Mesh(geometry,material)
scene.add(cube)
camera.position.z =5
console.log("made box")

// animate
function animate() {
  renderer.render(scene,camera)
  cube.rotation.x += 0.01; cube.rotation.y += 0.01;
}
renderer.setAnimationLoop(animate)
  return renderer.domElement
}
```
<div class="grid grid-cols-4">
  <div class="card">${
  resize((width)=> 
  makeChart(chart_data,width,4)
  )
}</div>
  <div class="card">${chart_type}</div>
  <div class="card">${resize(width=> makeBox(width,chart_type))}</div>
  <div class="card"></div>
</div>


