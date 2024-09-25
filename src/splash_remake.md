---
toc: false
title: Splash Remake
sql:
  publications: ./data/new_layout.db
---
```js
import {makeForceCollide,makeChart} from "./force_collide.js"
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
radScale.range([20,100])

// now we will extent the json data to include the r values from the scale
let chart_data = json_data.map(e=>({...e, r:radScale(e.num)}))
```

```html
<div class="card">
  ${makeChart(chart_data,width)}
</div>
```