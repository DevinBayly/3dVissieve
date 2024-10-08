onmessage = (message) => {
    postMessage({type:"response",message:`received ${message}`})
}