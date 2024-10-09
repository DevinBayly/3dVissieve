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

import {backgroundDataLayout} from "./background_worker_force.js"
const nodesLaidOut = backgroundDataLayout(nodes)

```

```js
nodesLaidOut
```

```js
Plot.plot({
    marks:[Plot.dot(nodesLaidOut,{x:"x",y:"y",r:.5})]
})
```
