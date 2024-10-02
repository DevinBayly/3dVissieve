import * as d3 from "npm:d3"
import { transformedBitangentWorld } from "three/examples/jsm/nodes/Nodes.js";


export function makeChart(data, width,reactive_variable,chart_type) {
    const height = width;
    const color = d3.scaleOrdinal(d3.schemeTableau10);
    // make a standard circles d3 chart
    let svg = d3.create("svg")
    // using this to help with the view process
    let htmlNode = svg.node()
    htmlNode.value=0
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
        .attr("fill", (d, i) => color(i))
        .attr("fill-opacity", .1)
    //  set up the callbacks for the circle that make the particular attribute come up taht we can use to filter the plots
    function clicked(event, d) {
        if (event.defaultPrevented) return; // dragged

        let selection = d3.select(this)
        let node = nodes[d.index]
        chart_type = node.group
        console.log(d,selection,node,chart_type)
        // here's the point where we connect to a reactive variable that is watched by the application
        htmlNode.value=chart_type
        // construct the event type that the view in the other notebook can reach to
        htmlNode.dispatchEvent(new Event("input", {bubbles: true}))

    }
    function hovered(d) {
      // change the selection style
      d3.select(this)
        .classed('circle-hover',true)

        
      
    }
    function unhovered(d) {
        d3.select(this).classed('circle-hover',false)

    }
    circles.on("click",clicked)
    circles.on("mouseover",hovered)
    circles.on("mouseout",unhovered)

    group.attr("transform", `translate(${width / 2},${height / 2})`)
    // the goal is to split the text on the _ and have the separate lines be included together but on different lines
    // make a mapping between the words and the circle i's index values so that we can get their x,y positions later
    let chart_names = nodes.map(e => e.group)

    let mapping = {}
    let word_index = 0
    let circle_index = 0
    let words = []
    for (let node of nodes) {
        let ctype = node.group
        //     // this helps us make sure to offset the word a bit in y within the circle later
        let num_word = 0
        //     // split the words by the _ in between them
        let chart_type_words = ctype.split(/_/g)
        let total_words = words.length
        for (let word of chart_type_words) {
            mapping[word_index] = { circle_index, num_word, total_words }
            // increment the word index so that overall the mapping is maintained
            word_index += 1
            // if we have tree_plot then num_word would take on the two values 0,1 which we can use in the tick loop to shift by y
            num_word += 1
            words.push(word)
        }
        circle_index += 1
    }
    // establish a shift value for the text within a circle
    let shift_y = 10
    console.log(mapping)
    // font scale 
    let radii = nodes.map(e => e.r)
    let radScale = d3.scaleLinear()
    radScale.domain(d3.extent(radii))
    radScale.range([9, 36])
    let text = group.selectAll("text").data(words).join("text").style("font-size", (d, i) => {
        let word_data = mapping[i]
        let circle_data = nodes[word_data.circle_index]
        return `${radScale(circle_data.r)}px`
    }).attr("x", 0).attr("y", 0).text(d => d)

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
        // in here we have to convert from the word index back to the circle index 
        text.attr("x", (d, word_index) => {
            let word_data = mapping[word_index]
            let circle_data = nodes[word_data.circle_index]
            return circle_data.x
        }).attr("y", (d, word_index) => {
            let word_data = mapping[word_index]
            let circle_data = nodes[word_data.circle_index]
            let font_scale = radScale(circle_data.r)
            // control a bit for the number of words potentially extending out past the bottom of the circle , this is our attempt to center in the middle
            // if we know how many words our little chart type is split into then we know that the shift_y will occur that many times
            // so instead we need to move in the opposite direction half that total amoutn of shifting and we will be centered
            return circle_data.y + word_data.num_word * font_scale
        })
    }
    console.log("the html node",htmlNode)
    return htmlNode;
}
export function makeForceCollide(width) {
    const k = width / 200;
    const r = d3.randomUniform(k, k * 4);
    const n = 4;
    const data = Array.from({ length: 30 }, (_, i) => ({ r: r(), group: i && (i % n + 1) }));
    console.log(data)
    return makeChart(data, width)
}

