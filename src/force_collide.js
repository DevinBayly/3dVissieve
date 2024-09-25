import * as d3 from "npm:d3"


export function makeChart(data, width) {
    const height = width;
    const color = d3.scaleOrdinal(d3.schemeTableau10);
    // make a standard circles d3 chart
    let svg = d3.create("svg")
    svg.attr("width", width)
    svg.attr("height", height)
    const nodes = data.map(Object.create);
    let group = svg.append("g")
        .attr("style", "width: 100%; height: auto; font: 10px sans-serif;")
        .attr("text-anchor", "middle");
    let circles = group.selectAll("circles").data(nodes).enter().append("circle")
    circles.attr("cx", d => 0)
        .attr("cy", d => 0)
        .attr("r", d => d.r)
        .attr("stroke", (d, i) => color(i))
        .attr("fill-opacity", .1)

    group.attr("transform", `translate(${width / 2},${height / 2})`)
    let text = group.selectAll("text").data(nodes).join("text").attr("x", 0).attr("y", 0).text(d => d.group)

    // let textSpan = text.append("tspan").text(d=> d.group).attr("x",0).attr("y",0)
    // sanity check
    // let test_text = svg.append("text")
    // let test_span = svg.append("text")

    // set the nodes up with some fx to start with


    const simulation = d3.forceSimulation(nodes)
        .alphaTarget(0) // stay hot
        .velocityDecay(0.1) // low friction
        .force("x", d3.forceX().strength(0.01))
        .force("y", d3.forceY().strength(0.01))
        .force("collide", d3.forceCollide().radius(d => d.r + 10).iterations(3))
        .force("charge", d3.forceManyBody().strength((d, i) => 5))
        .on("tick", ticked);

    // d3.select(context.canvas)
    //     .on("touchmove", event => event.preventDefault())
    //     .on("pointermove", pointermoved);


    // function pointermoved(event) {
    //   const [x, y] = d3.pointer(event);
    //   nodes[0].fx = x - width / 2;
    //   nodes[0].fy = y - height / 2;
    // }


    function ticked() {
        circles.attr("cx", d => d.x).attr("cy", d => d.y)
        text.attr("x", d => d.x).attr("y", d => {
            d.y
        })
    }

    return svg.node();
}
export function makeForceCollide(width) {
    const k = width / 200;
    const r = d3.randomUniform(k, k * 4);
    const n = 4;
    const data = Array.from({ length: 30 }, (_, i) => ({ r: r(), group: i && (i % n + 1) }));
    console.log(data)
    return makeChart(data, width)
}

