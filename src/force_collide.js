import * as d3 from "npm:d3"


export function makeChart(data,width){
  const height = width;
  const color = d3.scaleOrdinal(d3.schemeTableau10);
  let canvas = document.createElement("canvas")
  canvas.height = height
  canvas.width = width
  const context = canvas.getContext("2d");
  const nodes = data.map(Object.create);

  // set the nodes up with some fx to start with
  

  const simulation = d3.forceSimulation(nodes)
      .alphaTarget(0) // stay hot
      .velocityDecay(0.1) // low friction
      .force("x", d3.forceX().strength(0.01))
      .force("y", d3.forceY().strength(0.01))
      .force("collide", d3.forceCollide().radius(d => d.r + 10).iterations(3))
      .force("charge", d3.forceManyBody().strength((d, i) =>  5))
      .on("tick", ticked);

  // d3.select(context.canvas)
  //     .on("touchmove", event => event.preventDefault())
  //     .on("pointermove", pointermoved);

  //invalidation.then(() => simulation.stop());

  // function pointermoved(event) {
  //   const [x, y] = d3.pointer(event);
  //   nodes[0].fx = x - width / 2;
  //   nodes[0].fy = y - height / 2;
  // }

  function ticked() {
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);
    for (let i = 0; i < nodes.length; ++i) {
      const d = nodes[i];
      context.beginPath();
      context.moveTo(d.x + d.r, d.y);
      context.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
      // add the text to the center of the arc
      context.fillStyle = color(d.group);
      context.fill();
      context.fillStyle ="black";
      let group_text = d.group.replace(/_/g,"\r")
      // measure the text and perform a centering offset
      let widthText = context.measureText(group_text).width
      context.fillText(group_text,d.x-widthText/2,d.y)
    }
    context.restore();
  }

  return context.canvas;
}
export function makeForceCollide(width) {
const k = width / 200;
const r = d3.randomUniform(k, k * 4);
const n = 4;
const data =  Array.from({length: 30}, (_, i) => ({r: r(), group: i && (i % n + 1)}));
console.log(data)
return makeChart(data,width)
}

