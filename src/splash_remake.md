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
// this means that we need to exchange the num for a variable r 
// we will use a linear scale in d3 to map the extent of the counts to a range of radii values
let radScale = d3.scaleLinear()
// calculate the min adn max for just the num values
radScale.domain(d3.extent(json_data.map(e=>e.num)))
radScale.range([40,100])

// now we will extent the json data to include the r values from the scale
let chart_data = json_data.map(e=>({...e, r:radScale(e.num)}))
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
const height = width
import * as THREE from 'npm:three';
import { CSS2DRenderer,CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75,width/height,.1,1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(width,height)
const div = document.querySelector(".threed")
renderer.domElement

// make a geo
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color:"red"})
const cube = new THREE.Mesh(geometry,material)
scene.add(cube)
camera.position.z =5

// animate
function animate() {
  renderer.render(scene,camera)
  cube.rotation.x += 0.01; cube.rotation.y += 0.01;
}
renderer.setAnimationLoop(animate)
```
<div class="grid grid-cols-4">
  <div class="card">${
  resize((width)=> {
  makeChart(chart_data,width)
  })
}</div>
  <div class="card">${chart_type}</div>
  <div class="card">${renderer.domElement}</div>
  <div class="card"></div>
</div>


