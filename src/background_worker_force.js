import {Generators} from "observablehq:stdlib"

export function backgroundDataLayout(nodes) {
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
        .force("collide", d3.forceCollide().radius(d => 5).iterations(1))
        .force("charge", d3.forceManyBody().strength((d, i) => 5))
        // .on("tick", ticked);
        // .on("end",ended)

    //  let i =0
    let send = true
    for (let i=0;;i++){
    simulation.tick()
         if (i%10==0) postMessage({type:"updateLayout",nodes})
         postMessage({type:"tick",progress:i,alpha:simulation.alpha()})
         i++
         if (simulation.alpha() <.01) break
     }
     postMessage({type:"done",nodes})
    //  self.close()
}

`
    function createWorkerFrom() {
        const b = new Blob([simpleScript], { type: "text/javascript" })
        const url = URL.createObjectURL(b)
        return new Worker(url)

    }

    const worker = createWorkerFrom()

    const nodesLaidOut = Generators.observe((notify) => {
        function messaged(event) {
            // console.log("message",event)
            // use the resolve function when we get the message about the nodes being done
            if (event.data.type == "updateLayout" || event.data.type == "done") {
                console.log("update", event)
                notify(event.data.nodes)
            }
        }
        // now set up things like listening for the worker to change things
        worker.addEventListener("message", messaged)
        // start things up
        worker.postMessage({ nodes })
        // invalidation.then(()=> worker.terminate())
        return () => worker.removeEventListener("message", messaged)
    })
    return nodesLaidOut
}

