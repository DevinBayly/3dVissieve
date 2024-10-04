import * as d3 from "npm:d3"

// receive the data, and for the moment just make a node for each one of the elements
export function layoutData(data,otherFunction) {
    const nodes = data.map(Object.create);
    // in this case we will wait to kick off the rendering of all the other data until the graph is done laying things out
    function notifyComplete(){
        otherFunction(data)
    }
    // consider making promise here that we can return who's value is changed in notify complete or in a single anonymosue function below
    const simulation = d3.forceSimulation(nodes)
        .alphaTarget(0) // stay hot
        .velocityDecay(0.1) // low friction
        .force("x", d3.forceX().strength(0.01))
        .force("y", d3.forceY().strength(0.01))
        .force("collide", d3.forceCollide().radius(d => 10).iterations(3))
        .force("charge", d3.forceManyBody().strength((d, i) => 5))
        .on("tick", ticked).on("end",notifyComplete);

    // d3.select(context.canvas)
    //     .on("touchmove", event => event.preventDefault())
    //     .on("pointermove", pointermoved);


    // function pointermoved(event) {
    //   const [x, y] = d3.pointer(event);
    //   nodes[0].fx = x - width / 2;
    //   nodes[0].fy = y - height / 2;
    // }


    function ticked() {
    }
    console.log("the html node", htmlNode)
    return htmlNode;
}
export function makeForceCollide(data,width) {
    // assumption that the data is a apache arrow table 
    const data = Array.from({ length: data.numRows  }, (_, i) => ({ r: 10, group: i && (i % n + 1) }));
    console.log(data)
    return makeChart(data, width)
}

