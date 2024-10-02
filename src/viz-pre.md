---
toc: false
title: Updating zhiyang splash
sql:
  publications: ./data/new_layout.db
---


# Explore Visualizations in 3D


<!-- below is the css for the decoration -->

<style>
.disabled{
    pointer-events: none;
}
.heatmapContainer{
    overflow-x: scroll;
    height: 800px;
}
.heatmapDom{
    width: 100% !important;
    height: 100%;
    scale: 0.5;
    margin: auto;
    
}
#threeD{
    display: flex;
    /* background: #EEEEEE; */
  background: rgb(224,142,31);
  background: linear-gradient(0deg, rgba(224,142,31,1) 0%, rgba(185,185,185,1) 100%);
    justify-content: center; /* Center items horizontally */
    align-items: center; /* Center items vertically */

}

#mapContainer {
    z-index: 100000;
    position: absolute;
    justify-content: center; /* Center items horizontally */
    align-items: center; /* Center items vertically */

}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  background-color: transparent;
  color: black;
  padding: 5px;
  border-radius: 50%;
  font-size: 16px;
  font-family: "Arial",
  line-height: 16px;
  text-align: center;
  width: 30px;
  height: 30px;
  z-index: 1000; /* Ensure the button is on top */
}
#map-title{
  position: absolute;
  top: 3%;
  right: 10%;
  width: 80%;
  height: 10%;
  background-color: transparent;
  color: black;
  font-family: "Helvetica Neue";
  font-weight: bold;
  font-size: 30px;
  line-height: 16px;
  text-align: center;
  z-index: 1000; /* Ensure the button is on top */
}
.full-content {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1); /* Optional: to see the full-content area */
  border-radius: 10px;
  overflow: hidden;
}

@keyframes fadeInScaleUp {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes fadeOutScaleDown {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.5);
  }
}

.hidden {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.5s, opacity 0.5s linear; 
}

.visible {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.5s linear; 
}
.fade-in{
 animation: fadeInScaleUp 0.5s ease-in-out forwards; 

}
.fade-out {
  animation: fadeOutScaleDown 0.5s ease-in-out forwards;
}

#loading {
    display: none;
    position: absolute;
    justify-content: center; /* Center items horizontally */
    align-items: center; /* Center items vertically */
    background-color: transparent;
    scale: 0.95;
}

.loadingContent {
  position: relative;
  top: 1.8%;
  width: 95%;
  height: 95%;
  padding-top: 10%;
  display: flex;
  margin: auto;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: white; /* Set to transparent since we will use the pseudo-element for background */
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Subtle shadow for depth */
  border-radius: 10px; /* Slightly rounded corners */
  padding: 20px;
  box-sizing: border-box;
  z-index: 1; /* Ensure content is above the pseudo-element */
}

.loadingContent:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: #f7f7f7;
  opacity: 0.1;
  background-image:  linear-gradient(#626484 1.8px, transparent 1.8px), 
                     linear-gradient(90deg, #626484 1.8px, transparent 1.8px), 
                     linear-gradient(#626484 0.9px, transparent 0.9px), 
                     linear-gradient(90deg, #626484 0.9px, #e5e5f7 0.9px); */
  background-size: 45px 45px, 45px 45px, 9px 9px, 9px 9px;
  background-position: -1.8px -1.8px, -1.8px -1.8px, -0.9px -0.9px, -0.9px -0.9px;
  border-radius: 10px; /* Match border radius with parent */
  z-index: -1; /* Ensure it is behind the content */
}

.contentTitle {
  font-size: 24px; /* Larger font for visibility */
  font-weight: bold;
  color: #333; /* Dark color for contrast */
  text-align: center;
  margin-bottom: 10px;
}

.contentInfo, .contentInstruction {
  font-size: 18px;
  width: 80%;
  color: #555; /* Slightly lighter color for info and instructions */
  text-align: center;
  margin: 5px 0; /* Spacing for clean separation */
}

.instructionDetails {
  width: 100%; /* Full width for the container */
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Subtle shadow for depth */
  border-radius: 10px;
  display: flex;
  background-color: #f7f7f7;
  flex-direction: column;
  align-items: flex-start; /* Align items to flex-start */
  padding: 10px;
  box-sizing: border-box;
}

.contentInstruction ul {
  width: 100%; /* Full width for the list */
  padding: 0; /* Remove default padding */
  margin: 0; /* Remove default margin */
  list-style: none; /* Remove default list styling */
}

.contentInstruction ul li {
  width: 130%; /* Full width for the list items */
  margin-bottom: 10px; /* Spacing between list items */
  text-align: left; /* Align text to the left */
 
  text-overflow: ellipsis; /* Add ellipsis for overflow text */
}

.contentInstruction ul li strong {
  font-weight: bold; /* Bold font for essential parts */
}

.enterButton {
  align-self: center; /* Center the button container */
  margin-top: 20px;
}

/* Ensure the button class is applied as needed */
.enterButton button {
  --b: 3px;   /* border thickness */
  --s: .45em; /* size of the corner */
  --color: #373B44;
  
  padding: calc(.5em + var(--s)) calc(.9em + var(--s));
  color: var(--color);
  --_p: var(--s);
  background:
    conic-gradient(from 90deg at var(--b) var(--b), #0000 90deg, var(--color) 0)
    var(--_p) var(--_p)/calc(100% - var(--b) - 2*var(--_p)) calc(100% - var(--b) - 2*var(--_p));
  transition: .3s linear, color 0s, background-color 0s;
  outline: var(--b) solid #0000;
  outline-offset: .6em;
  font-size: 16px;

  border: 0;

  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.enterButton button:hover,
.enterButton button:focus-visible {
  --_p: 0px;
  outline-color: var(--color);
  outline-offset: .05em;
}

.enterButton button:active {
  background: var(--color);
  color: #fff;
}

#resetButton, #mapButton {
    position: absolute;
    width: 8%;
    top: 17%; /* Adjust top position as needed */
    right: 2%; /* Adjust right position as needed */
    z-index: 100;
    display: none;
    text-align: center; /* Center text horizontally */
    align-items: center; /* Center text vertically */
    justify-content: center; /* Center text horizontally */
    display: none; /* Enable flexbox */
}

/* Adjust top position for mapButton */
#mapButton {
    top: 10%;
}


.button-55 {
  align-self: center;
  background-color: #fff;
  background-image: none;
  background-position: 0 90%;
  background-repeat: repeat no-repeat;
  background-size: 4px 3px;
  border-radius: 15px 225px 255px 15px 15px 255px 225px 15px;
  border-style: solid;
  border-width: 2px;
  box-shadow: rgba(0, 0, 0, .2) 15px 28px 25px -18px;
  box-sizing: border-box;
  color: #41403e;
  cursor: pointer;
  display: inline-block;
  font-family: Neucha, sans-serif;
  font-size: 1rem;
  line-height: 23px;
  outline: none;
  padding: .75rem;
  text-decoration: none;
  transition: all 235ms ease-in-out;
  border-bottom-left-radius: 15px 255px;
  border-bottom-right-radius: 225px 15px;
  border-top-left-radius: 255px 15px;
  border-top-right-radius: 15px 225px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-55:hover {
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 8px -5px;
  transform: translate3d(0, 2px, 0);
}

.button-55:focus {
  box-shadow: rgba(0, 0, 0, .3) 2px 8px 4px -6px;
}
/* CSS */
/* CSS */
.button-16 {
  background-color: #f8f9fa;
  border: 1px solid #f8f9fa;
  border-radius: 4px;
  color: #3c4043;
  cursor: pointer;
  font-family: arial,sans-serif;
  font-size: 14px;
  height: 36px;
  line-height: 27px;
  min-width: 54px;
  padding: 0 16px;
  text-align: center;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: pre;
  transition: opacity 0.5s ease-in-out, border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
  opacity: 0; /* Initial opacity */
}

.button-16:hover {
  border-color: #dadce0;
  box-shadow: rgba(0, 0, 0, .1) 0 1px 1px;
  color: #202124;
}

.button-16:focus {
  border-color: #4285f4;
  outline: none;
}

</style>

<!-- below is the css for the decoration -->

<!-- https://observablehq.com/framework/lib/duckdb -->
<!-- duckdb with ob reference -->

<style>
.circle-hover {
  fill-opacity:1;
}
</style>

```js
// setting up the splash view, 

import {makeForceCollide,makeChart} from "./force_collide.js"
import {loadDataAndInitialize} from "./zhiyang_refactor.js"
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

let forceCollideChart = makeChart(chart_data,800)

const chart_type = view(forceCollideChart)
// load up zhiyang's code when the chart_type changes
```

```js
loadDataAndInitialize(chart_type)
chart_type
```





<div class="card">
  ${forceCollideChart}
</div>

<div class = "card" id="threeD">
<button id='mapButton' class="button-55" class="fade-in" >Map</button>
<button id='resetButton' class="button-55" class="fade-in" >Go Back</button>
<div id="mapContainer" class="hidden">
  <span id="closeButton" class="close-button">&#10005;</span>
  <span id="map-title"> Which Chart Type You Like To Explore?</span>
  <div class="full-content" id="full-map">
  </div>
</div>


</div>







