---
toc: false
title: background worker
---
based on https://observablehq.com/@d3/force-directed-web-worker

```js
const height = Math.floor(width*.9)
const N = 5000
const nodes = Array.from({length: N}, (_,i)=> ({index:i})) 

```


```js

const simpleScript = `
importScripts("https://d3js.org/d3.v7.js")

onmessage = function(event) {
    console.log(d3)
    postMessage({type:"reponse",message:"starting up"})
    const nodes = event.data.nodes

    const simulation = d3.forceSimulation(nodes)
        .alphaTarget(0) // try to get to 0 and stop
        .velocityDecay(0.1) // low friction
        .force("x", d3.forceX().strength(0.01))
        .force("y", d3.forceY().strength(0.01))
        .force("collide", d3.forceCollide().radius(d => 3).iterations(1))
        .force("charge", d3.forceManyBody().strength((d, i) => 5))
        // .on("tick", ticked);
        // .on("end",ended)

    //  let i =0
    for (let i=0;;i++){
    simulation.tick()
         postMessage({type:"tick",progress:i,alpha:simulation.alpha()})
         i++
         if (simulation.alpha() <.5) break
     }
     postMessage({type:"done",nodes})
    //  self.close()
}

`
function createWorkerFrom() {
    const b = new Blob([simpleScript],{type:"text/javascript"})
    const url=URL.createObjectURL(b)
    return new Worker(url)

}

const worker = createWorkerFrom()

const nodesLaidOut = new Promise(resolve => {
    function messaged(event) {
        console.log("message",event)
        // use the resolve function when we get the message about the nodes being done
        if (event.data.type == "done") {
            resolve(event.data.nodes)
        }
    }
    // now set up things like listening for the worker to change things
    worker.addEventListener("message",messaged)
    // start things up
    worker.postMessage({nodes})
    // invalidation.then(()=> worker.terminate())
})

```

```js
nodesLaidOut
```

```js
Plot.plot({
    marks:[Plot.dot(nodesLaidOut,{x:"x",y:"y"})]
})
```
