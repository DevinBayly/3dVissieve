import * as d3 from "npm:d3"

// receive the data, and for the moment just make a node for each one of the elements
export function layoutData(data) {
    const nodes = data.toArray().slice(0,1000).map(e=> Object.create(e.toJSON()));
    // in this case we will wait to kick off the rendering of all the other data until the graph is done laying things out
    // consider making promise here that we can return who's value is changed in notify complete or in a single anonymosue function below
    const simulation = d3.forceSimulation(nodes)
        .alphaTarget(0) // stay hot
        .velocityDecay(0.1) // low friction
        .force("x", d3.forceX().strength(0.01))
        .force("y", d3.forceY().strength(0.01))
        .force("collide", d3.forceCollide().radius(d => 10).iterations(1))
        .force("charge", d3.forceManyBody().strength((d, i) => 5))
        .on("tick", ticked);
    const layoutPromise = new Promise(resolve => {
        simulation.on("end",()=>resolve(nodes))
    })


    function ticked() {
    }
    return layoutPromise;
}

