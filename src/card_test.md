---
toc: false
title: Card test
---


```js
let traffic = await FileAttachment("data/traffic.csv").csv()
console.log(traffic)
let overlap=4.5
```


```js
let chart = Plot.plot({
  height: 40 + new Set(traffic.map(d => d.name)).size * 17,
  width,
  marginBottom: 1,
  marginLeft: 120,
  x: {axis: "top"},
  y: {axis: null, range: [2.5 * 17 - 2, (2.5 - overlap) * 17 - 2]},
  fy: {label: null, domain: traffic.map(d => d.name)}, // preserve input order
  marks: [
    d3.groups(traffic, d => d.name).map(([, values]) => [
      Plot.areaY(values, {x: "date", y: "value", fy: "name", curve: "basis", sort: "date", fill: "#ccc"}),
      Plot.lineY(values, {x: "date", y: "value", fy: "name", curve: "basis", sort: "date", strokeWidth: 1})
    ])
  ]
})
```

```html
<div class="card">
${chart}
</div>
```