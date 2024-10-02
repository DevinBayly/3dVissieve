


let visualizationTypes = [
    "Violin",
    "Density",
    "Histogram",
    "Boxplot",
    "Ridgeline",
    "Scatter",
    "Heatmap",
    "Correlogram",
    "Bubble",
    "Connected scatter",
    "Density 2d",
    "Barplot",
    "Spider / Radar",
    "Wordcloud",
    "Parallel",
    "Lollipop",
    "Circular Barplot",
    "Treemap",
    "Venn diagram",
    "Doughnut",
    "Pie chart",
    "Dendrogram",
    "Circular packing",
    "Sunburst",
    "Line plot",
    "Area",
    "Stacked area",
    "Streamchart",
    "Map",
    "Choropleth",
    "Hexbin map",
    "Cartogram",
    "Connection",
    "Bubble map",
    "Chord diagram",
    "Network",
    "Sankey",
    "Arc diagram",
    "Edge bundling",
    "Complex",
    "Scientific Viz",
    "Other-1",
    "Other-2",
    "Other-3",
    "Other-4"
];
// Declare labels

// import libs
import * as d3 from "npm:d3";
import {FileAttachment} from "observablehq:stdlib";
//import * as duckdb from "npm:@duckdb/duckdb-wasm";
import {DuckDBClient} from "npm:@observablehq/duckdb"
// import libs

// import data
const db = await DuckDBClient.of({base: FileAttachment("/data/new_layout.db")});
// import data

// const chartPos = await countChartPos(db);

const topicsArray = await countTopics(db);

const getObjectById = (data,id) => {
    return data.find(item => item.id === id);
};
const getObjectByIdx = (data,id) => {
    return data.find(item => item.idx === id);
};
const getObjectByIdFigure = (data,id) => {
    return data.find(item => item.figure_id === id);
};
// data extraction

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// Database handling functions


// Function to initialize the database and fetch the publication data
async function initialDB(db,ctype) {
    try {
        const results = await db.query(`
            SELECT 
                f.id AS figure_id, 
                p.id AS paper_id, 
                p.title, 
                p.doi, 
                p.publication_date, 
                p.oa_url, 
                p.pdf_path, 
                p.inst_id, 
                p.primary_topic_id,
                f.local_path, 
                f.server_path, 
                fp.name, 
                fp.int_value AS ChartType,  
                fp.string_value AS Something, 
                fp.xPos, 
                fp.yPos, 
                fp.zPos
            FROM 
                base.figure f
            LEFT JOIN 
                base.paper p ON f.paper_id = p.id
            LEFT JOIN 
                base.figure_property fp ON f.id = fp.figure_id AND fp.string_value ='${ctype}'
            ORDER BY 
                f.id;
        `);
        
        const resultsArray = results.toArray();
    
        // return resultsArray;
        return JSON.stringify(resultsArray, null, 2);
        
        // publicationDB = JSON.stringify(resultsArray, null, 2);
    } catch (error) {
        console.error("Error executing query:", error);
    }
}


// async function countChartPos(db) {
    // try {
        // const results = await db.query(`
            // SELECT 
                // int_value, 
                // AVG(figure_property.xPos) AS xPos, 
                // AVG(figure_property.yPos) AS yPos, 
                // AVG(figure_property.zPos) AS zPos, 
                // COUNT(*) AS count 
            // FROM 
                // base.figure_property 
            // GROUP BY 
                // int_value
            // ORDER BY 
                // int_value;
        // `);
// 
        // const resultsArray = results.toArray();
        // const output = resultsArray.map(row => ({
            // idx: row.int_value,
            // x: row.xPos,
            // y: row.yPos,
            // z: row.zPos,
            // count: row.count,
            // label: visualizationTypes[row.int_value]
        // }));
        // 
        // return output;
    // } catch (error) {
        // console.error("Error executing query:", error);
        // throw error;
    // }
// }

// count avg position


async function countTopics(db) {
    try {
 
        const results = await db.query(`
            SELECT 
               id,
               name,
               subfield,
               field,
               domain,
            FROM 
                base.topic
            ORDER BY 
                id;
        `);

        const resultsArray = results.toArray();
        return resultsArray;
    } catch (error) {
        console.error("Error executing query:", error);
        throw error;
    }
}

// Database handling
// ----------------------------------------------------------------
// ----------------------------------------------------------------




// ----------------------------------------------------------------
// ----------------------------------------------------------------



// below is the details of 3D data viz
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

import * as THREE from 'npm:three';
import { CSS2DRenderer,CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



// global variables
let imagePositions;
let sprites = [];
    const colors = [
        // "#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4", "#46f0f0", "#f032e6",
        // "#bcf60c", "#fabebe", "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000", "#aaffc3",
        // "#808000", "#ffd8b1", "#000075", "#808080", "#fa8072", "#4682b4", "#6a5acd", "#20b2aa",
        // "#9400d3", "#ff6347", "#40e0d0", "#ee82ee", "#dda0dd", "#b0c4de", "#ff7f50", "#6495ed",
        // "#deb887", "#5f9ea0", "#7fff00", "#d2691e", "#ff69b4", "#1e90ff", "#228b22", "#ffc0cb",
        // "#8a2be2", "#a52a2a", "#8b008b", "#b8860b", "#66cdaa", "#ff4500", "#daa520", "#98fb98",
        // "#afeeee", "#db7093"
         "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF",
          "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF", "#E7EBEF"
    ];
const scaleRatio = 5;

const raycaster = new THREE.Raycaster(); 
const mouse = new THREE.Vector2();

let focusSprite = null; // Currently focused sprite
let initialCameraPosition = new THREE.Vector3(); // Initial position of the camera
let initialLookAtPosition = new THREE.Vector3();
let isCameraMoving = false;

let canvasWidth = 0.97 * document.getElementById("threeD").offsetWidth;
let canvasHeight = 0.97 * document.getElementById("threeD").offsetWidth / 16 * 10;

const resetButton = document.getElementById('resetButton');

// global variables

export async function loadDataAndInitialize(ctype) {
  try {
    // Fetch the data from your database or API
    const publicationDB = await initialDB(db,ctype);
    // Process the data as needed
    imagePositions = JSON.parse(publicationDB);
 
    // Load atlases and initialize
    loadAtlases(init);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}
// Call the function to execute the logic


// modify based on the extact atlases drawn
const atlases = [
  { url: 'https://zhiyangwang.site/fakeData/atlas-1.jpg', grid: { x: 64, y: 64 }, count: 4096 },
  { url: 'https://zhiyangwang.site/fakeData/atlas-2.jpg', grid: { x: 64, y: 64 }, count: 4096 },
  { url: 'https://zhiyangwang.site/fakeData/atlas-3.jpg', grid: { x: 64, y: 64 }, count: 3384 },
  { url: 'https://zhiyangwang.site/fakeData/atlas-4.jpg', grid: { x: 64, y: 35 }, count: 1463 }
];

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 35, -135);
initialLookAtPosition.set(0, 0, 0);
camera.lookAt(initialLookAtPosition);
initialCameraPosition.copy(camera.position);
const renderer = new THREE.WebGLRenderer();
renderer.domElement.classList.add("hidden");
renderer.setSize(canvasWidth, canvasHeight);
document.getElementById("threeD").appendChild(renderer.domElement);
renderer.domElement.style.borderRadius = "10px";
renderer.setClearColor( 0xE77500, 0 );


const myDiv = document.getElementById("threeD")
myDiv.addEventListener('mouseenter', function() {
    // Disable scrolling and zooming when mouse enters the div
    document.body.style.overflow = 'hidden'; 
    document.addEventListener('wheel', disableScrollAndZoom, { passive: false });
});
myDiv.addEventListener('mouseleave', function() {
    // Enable scrolling and remove the event listener for zoom when mouse leaves the div
    document.body.style.overflow = 'auto';
    document.removeEventListener('wheel', disableScrollAndZoom, { passive: false });
});

function disableScrollAndZoom(event) {
    // This will prevent scrolling and zooming (CTRL + wheel)
    event.preventDefault();
}
// const controls = new OrbitControls(camera, renderer.domElement);
const loadDistance = 5;
const size = 30000;
const divisions = 1000;
// scene.add(new THREE.GridHelper(size, divisions));
// scene.add(new THREE.AxesHelper(100));


// ----------------------------------------------------------------
// ----------------------------------------------------------------


function loadAtlases(callback) {
  let loadedCount = 0;
  atlases.forEach((atlas, index) => {
    const loader = new THREE.TextureLoader();
    loader.load(atlas.url, texture => {
      atlases[index].texture = texture;
      loadedCount++;
      if (loadedCount === atlases.length) {
        callback(); // Initialize the scene once all atlases are loaded
      }
    });
  });
  // console.log(atlases)
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------



// ----------------------------------------------------------------
// ----------------------------------------------------------------


function init() {
const loadingDiv = document.getElementById('loading');
const threeD = document.getElementById('threeD');
const enterButton = document.getElementById('enter');
loadingDiv.style.width = `${threeD.offsetWidth}px`;
loadingDiv.style.height = `${threeD.offsetHeight}px`;
loadingDiv.style.display = "flex";
const mapContainer = document.getElementById("mapContainer");
mapContainer.style.width = `${canvasWidth}px`;
mapContainer.style.height =`${canvasHeight}px`;
const mapDom = document.getElementById("full-map");
// generateScatterPlot(map, canvasWidth, canvasHeight*0.95, mapDom);


    imagePositions.forEach(item => {
    let atlasIndex = 0;
    let imageIndex = item.figure_id;
    let cumulativeCount = 0;

    for (let i = 0; i < atlases.length; i++) {
      cumulativeCount += atlases[i].count;
      if (imageIndex < cumulativeCount) {
        atlasIndex = i;
        imageIndex -= (cumulativeCount - atlases[i].count);
        break;
      }
    }

    const atlas = atlases[atlasIndex];
    const atlasX = imageIndex % atlas.grid.x;
    const atlasY = Math.floor(imageIndex / atlas.grid.x);
    const spriteWidth = 1 / atlas.grid.x;
    const height = 1 / atlas.grid.y;

     const spriteMaterial = new THREE.SpriteMaterial({
      map: atlas.texture.clone(), // Clone the texture to ensure independent mapping
      color: 0xffffff
    });

    spriteMaterial.map.repeat.set(spriteWidth, height);
    spriteMaterial.map.offset.set(atlasX * spriteWidth, 1 - (atlasY + 1) * height);

    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(item.xPos / 10, item.yPos/50, item.zPos /10);
    //sprite.scale.set(2,2,2)
    //sprite.scale.divideScalar(scaleRatio);
    sprite.className = "sprite";
    sprite.userData = {
    idx: item.figure_id,
    name: item.name,
    paper_title: item.title,
    doi: item.doi,
    server_path: item.server_path,
    atlasIndex: atlasIndex, highResLoaded: false,
    chartType: item.ChartType,
    topic: item.primary_topic_id
    };
    scene.add(sprite);
    sprites.push(sprite);
  });
  
  setupClickEvent(sprites, camera, renderer);
  // setupCameraControl(camera, renderer);
  animate();
   enterButton.addEventListener('click',()=>{
    loadingDiv.classList.remove("fade-in");
    loadingDiv.classList.add("fade-out");
    renderer.domElement.classList.remove("hidden");
    renderer.domElement.classList.add("visible");
    loadingDiv.style.pointerEvents = 'none';
    // mapContainer.classList.remove("hidden");
    // mapContainer.classList.add("fade-in");

  });
  
    const mapOpenButton = document.getElementById("mapButton");
  const mapCloseButton = document.getElementById("closeButton");
    mapCloseButton.addEventListener("click", function() {
    //  console.log("clicked");
    // mapContainer.classList.add("hidden");
    // mapContainer.classList.add("fade-out");
    // mapContainer.classList.remove("fade-in");
    // mapContainer.classList.add("disabled");
    mapOpenButton.style.display = 'flex';

    });

  mapOpenButton.addEventListener("click", function() {
    //  console.log("clicked");
     unSelectSprite();
    // mapContainer.classList.remove("hidden");
    // mapContainer.classList.remove("fade-out");
    // mapContainer.classList.add("fade-in");
    // mapContainer.classList.remove("disabled");
    mapOpenButton.style.display = 'none';

    });
  resetButton.addEventListener('click', () =>{
    if(isCameraMoving) return;
    moveCamera(initialCameraPosition, initialLookAtPosition);
    // console.log("rest button clicked");
     unSelectSprite();
    resetButton.style.display = 'none';
    
  });




}
// ----------------------------------------------------------------
// ----------------------------------------------------------------



// ----------------------------------------------------------------
// ----------------------------------------------------------------


function animate() {
  requestAnimationFrame(animate);

  updateTextures();
    
  renderer.render(scene, camera);

}

// ----------------------------------------------------------------
// ----------------------------------------------------------------


// ----------------------------------------------------------------
// ----------------------------------------------------------------
// Free Move Camera function 
function setupCameraControl(camera, renderer) {
    let isDragging = false;
    let dragButton = 0; // 0 for left button, 2 for right button
    let previousMousePosition = { x: 0, y: 0 };
    const rotationSpeed = 0.005; // Speed of the camera rotation
    let angularVelocityY = 0;
    let angularVelocityX = 0;
    const angularDamping = 0.95; // Increased damping for smoother motion
    let zoomVelocity = 0;
    const zoomDamping = 0.2;
    const maxY = 150;
    const minY = 0;
    const maxXZ = 200;
    const minXZ = -200;

    // Orbit-like control variables
    let spherical = new THREE.Spherical();
    let target = new THREE.Vector3();

    function checkBoundaries() {
        const position = camera.position;
        if (position.y > maxY) {
            position.y = maxY;
        }
        if (position.x > maxXZ) {
            position.x = maxXZ;
        }
        if (position.z > maxXZ) {
            position.z = maxXZ;
        }
    }

    function updateCamera() {
        if (isCameraMoving) return; // If the camera is automatically moving, stop manual update.

        // Apply damping to angular velocities
        angularVelocityY *= angularDamping;
        angularVelocityX *= angularDamping;

        // Update spherical coordinates
        spherical.setFromVector3(camera.position.clone().sub(target));
        spherical.theta -= angularVelocityY;
        spherical.phi -= angularVelocityX;
        spherical.makeSafe();

        if(isDragging) {
        // Apply updated spherical coordinates
        camera.position.setFromSpherical(spherical).add(target);
        camera.lookAt(target);
        }
        // Zoom control
        if (zoomVelocity !== 0) {
            camera.translateZ(-zoomVelocity);
            zoomVelocity *= zoomDamping;
        }

        checkBoundaries(); // Ensure camera remains within boundaries
    }

    renderer.domElement.addEventListener('mousedown', function (e) {
        if (isCameraMoving) return; // Disable manual control if the camera is automatically moving.
        if (focusSprite) {
           console.log("unselect here");
            unSelectSprite();
        }
        isDragging = true;
        dragButton = e.button;
        previousMousePosition.x = e.clientX;
        previousMousePosition.y = e.clientY;
    });

    renderer.domElement.addEventListener('mousemove', function (e) {
        if (!isDragging || isCameraMoving) return;
        if (focusSprite) {
            unSelectSprite();
        }
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        angularVelocityY = deltaX * rotationSpeed;
        angularVelocityX = deltaY * rotationSpeed;
        previousMousePosition.x = e.clientX;
        previousMousePosition.y = e.clientY;
    });

    renderer.domElement.addEventListener('mouseup', function (e) {
        isDragging = false;
    });

    renderer.domElement.addEventListener('wheel', function (e) {
        if (isCameraMoving) return;
        if (focusSprite) {
            unSelectSprite();
        }
        zoomVelocity += e.deltaY * -0.02; 
    });

    renderer.domElement.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    renderer.setAnimationLoop(() => {
        updateCamera();
        renderer.render(scene, camera);
    });

    return function cleanup() {
        renderer.domElement.removeEventListener('mousedown', null);
        renderer.domElement.removeEventListener('mousemove', null);
        renderer.domElement.removeEventListener('mouseup', null);
        renderer.domElement.removeEventListener('wheel', null);
        renderer.domElement.removeEventListener('contextmenu', null);
        renderer.setAnimationLoop(null);
    };
}

 const cleanupControls = setupCameraControl(camera, renderer);

// Free Move Camera function 
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------




// Dynamic Load the Texture based on the camera position
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------


function updateTextures() {
  sprites.forEach(sprite => {
    const distance = camera.position.distanceTo(sprite.position);
    if (distance < loadDistance && !sprite.userData.highResLoaded) {
          enhanceSpriteWithText(sprite)
    }
  });
}

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// Dynamic Load the Texture based on the camera position







// Camera Moving and label display when clciked
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

function setupClickEvent(sprites, camera, renderer) {
    renderer.domElement.addEventListener('click', event => {
        if (isCameraMoving) return;
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(sprites);

        if (intersects.length > 0) {
            const selectedSprite = intersects[0].object;
            // console.log(selectedSprite);

            // Manage focus sprite transformations
            if (focusSprite && focusSprite !== selectedSprite) {
                unSelectSprite();
            }

            // Select new sprite
            if (!focusSprite || focusSprite !== selectedSprite) {
                selectSprite(selectedSprite);
            }
        } else {
            // Reset focus and remove button if clicked outside of any sprites
            unSelectSprite();
        }
    }, false);
}

function unSelectSprite(){
    if (focusSprite) {
        // console.log("trigger unselect")
        focusSprite.scale.divideScalar(scaleRatio);
        focusSprite.position.y -= 5;
        focusSprite = null;
        const btnContainer = document.getElementById('btn-container');
        if (btnContainer) btnContainer.remove();
    }
}

function selectSprite(sprite) {
    sprite.scale.multiplyScalar(scaleRatio);
    sprite.position.y += 5;
    focusSprite = sprite;
    // console.log("selectSprite is triggered" )
    // console.log(focusSprite);
    enhanceSpriteWithText(focusSprite);
    const targetPosition = new THREE.Vector3(sprite.position.x + 2.5, sprite.position.y + 2.5, sprite.position.z +2.5);

    const lookAtPosition = new THREE.Vector3(sprite.position.x, sprite.position.y, sprite.position.z);
  
    moveCamera(targetPosition, lookAtPosition);
  
    if (!document.getElementById('btn-container')) {
        const container = document.createElement('div');
        container.id = 'btn-container';
        container.style.position = 'absolute';
        container.style.left = '50%';
        container.style.bottom = '5%';
        container.style.transform = 'translateX(-50%)';
        container.style.zIndex = 1000;
        container.style.opacity = 0; // Initial opacity for transition
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';
        container.style.alignItems = 'center';
        container.style.width = '400px'; 
        container.style.height = '60px'; 
        container.style.backgroundColor = '#ffffff'; 
        container.style.border = 'none'; // No border
        container.style.borderRadius = '12px'; // Border radius
        container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)'; // 3D Box shadow
        container.style.padding = '0 10px'; // Padding

        const createButton = (id, text) => {
            const btn = document.createElement('button');
            btn.id = id;
            btn.textContent = text;
            btn.style.padding = '10px 15px'; // Button padding
            btn.style.margin = '0 5px'; // Button margin
            btn.style.border = 'none'; // Remove border
            btn.style.borderRadius = '8px'; // Button border radius
            btn.style.backgroundColor = '#E7EBEF'; // Soft blue background color
            btn.style.color = '#000000'; // Button text color
            btn.style.fontSize = '14px'; // Button font size
            btn.style.cursor = 'pointer'; // Pointer cursor on hover
            btn.style.transition = 'background-color 0.3s, transform 0.3s'; // Transition effect
            btn.onmouseover = () => btn.style.backgroundColor = '#e07e1f'; // Hover background color
            btn.onmouseout = () => btn.style.backgroundColor = '#E7EBEF'; // Default background color
            btn.onmousedown = () => btn.style.transform = 'scale(0.95)'; // Click scale effect
            btn.onmouseup = () => btn.style.transform = 'scale(1)'; 
            return btn;
        };

        const arrowLeft = createButton('arrow-left-btn', '◄');
        const fullSizeBtn = createButton('full-size-btn', 'Full Size');
        const detailsBtn = createButton('details-btn', 'Details');
        const learnMoreBtn = createButton('learn-more-btn', 'Learn More');
        const arrowRight = createButton('arrow-right-btn', '►');

        container.appendChild(arrowLeft);
        container.appendChild(fullSizeBtn);
        container.appendChild(detailsBtn);
        container.appendChild(learnMoreBtn);
        container.appendChild(arrowRight);

        const threeDElement = document.getElementById('threeD');
        threeDElement.appendChild(container);

        // Add event listeners for the buttons
        learnMoreBtn.addEventListener('click', () => {
            window.open(focusSprite.userData.doi);
        });

        fullSizeBtn.addEventListener('click', () => {
             window.open(focusSprite.userData.server_path);
        });

        detailsBtn.addEventListener('click', () => {
            window.open(focusSprite.userData.server_path);
        });

        arrowLeft.addEventListener('click', () => {
            // console.log('arrow left clicked');
            changeSprite(focusSprite, -1);
        });

        arrowRight.addEventListener('click', () => {
            // console.log('arrow right clicked');
            changeSprite(focusSprite, 1);
        });

    }
}

function changeSprite(focusSprite, direction) {

    if (!focusSprite) return;
      const currentIndex = focusSprite.userData.idx;

    if (currentIndex == null) return; // Ensure the index exists
     unSelectSprite();
    let newIndex = currentIndex + direction;
    // console.log("triggered new idx", newIndex);

    let newSprite = sprites.find(sprite => sprite.userData.idx === newIndex);
    // console.log("find from change Sprite: ");
    // console.log(newSprite);
      while (!newSprite) {
          newIndex += direction;
          newSprite = sprites.find(sprite => sprite.userData.idx === newIndex);
      }

if (newSprite) {
    selectSprite(newSprite);
} else {
    // console.log("No correct sprite found.");
}

}



function enhanceSpriteWithText(focusSprite) {
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');  // Ensure CORS compliance !!!important
  loader.load(`${focusSprite.userData.server_path}`, texture => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;  // Higher resolution for better clarity
    canvas.height = 1024;  // Maintain the 4:3 ratio
    const context = canvas.getContext('2d');
    const image = new Image();
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      // Clear the canvas and fill it with a white background
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);

      const aspectRatio = image.width / image.height;
      let drawWidth, drawHeight;

      // Determine the drawing width and height while maintaining the aspect ratio
      if (canvas.width / canvas.height < aspectRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / aspectRatio;
      } else {
          drawWidth = canvas.height * aspectRatio;
          drawHeight = canvas.height;
      }

      // Calculate the position to center the image
      const x = (canvas.width - drawWidth) / 2;
      const y = (canvas.height * 0.80 - drawHeight) / 2;

      // Draw the image
      context.drawImage(image, x, y, drawWidth, drawHeight);

      // Set up the text area
      context.fillStyle = "#ffffff";

      context.fillRect(0, canvas.height * 0.80, canvas.width, canvas.height * 0.20);

      context.fillStyle = "#000";  // Black text for visibility
      context.font = "48px Arial";  // Larger, clear font
      context.textBaseline = "top";
      context.textAlign = "left";
      const padding = 5;  // Adjust padding for better spacing

      // Display text with better spacing
      const textBaseLine = canvas.height * 0.80 + padding;
      context.fillText(`Chart Type: ${focusSprite.userData.name}`, padding, textBaseLine+20);
      context.font = "32px Arial";
      context.fillText(`Field: ${getObjectById(topicsArray, focusSprite.userData.topic).field}`, padding, textBaseLine + 80);
      context.fillText(`SubField: ${getObjectById(topicsArray, focusSprite.userData.topic).subfield}`, padding, textBaseLine + 130);

      // Convert canvas to texture
      const canvasTexture = new THREE.CanvasTexture(canvas);
      focusSprite.material.map = canvasTexture;
      focusSprite.material.needsUpdate = true;
      focusSprite.userData.highResLoaded = true;
    };

    image.src = `${focusSprite.userData.server_path}`;

    // Make the canvas clickable
    canvas.addEventListener('click', () => {
      alert(`Clicked on: ${focusSprite.userData.name}`);
    });
  });
}



// Camera Moving trigger and label display when clciked the sprites
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------





// Camera Moving functions
// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

function create3DVector(x,y,z){
   const vector =  new THREE.Vector3(x, y, z);
   return vector
}
function moveCamera(target, lookAtPosition) {
    if (isCameraMoving) return; // Prevents multiple movements at the same time
    isCameraMoving = true;

    const epsilon = 0.01; // Distance threshold for stopping
    const baseDuration = 1000; // Base duration for the animation in milliseconds
    const startPosition = camera.position.clone();
    const startQuaternion = camera.quaternion.clone();
    const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(target, lookAtPosition, camera.up)
    );
    const totalDistance = startPosition.distanceTo(target);
    const duration = baseDuration + (totalDistance * 5); // Dynamic duration based on distance
    const startTime = performance.now();

    // Easing function for smooth transitions
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // Update the camera's position and orientation
    function updateCameraPosition() {
        const now = performance.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1); // Ensure t is within [0, 1]
        const distance = camera.position.distanceTo(target);

        if (distance > epsilon) {
            const easedT = easeInOutQuad(t);
            camera.position.lerpVectors(startPosition, target, easedT);
            camera.quaternion.slerpQuaternions(startQuaternion, targetQuaternion, easedT);
            // console.log("I am moving!");
            requestAnimationFrame(updateCameraPosition);
        } else {
            // Snap to final position and orientation
            camera.position.copy(target);
            camera.quaternion.copy(targetQuaternion);
            // console.log("last move!");
            camera.lookAt(lookAtPosition);

          
            
            // Show or hide reset button based on target position
            resetButton.style.display = (target !== initialCameraPosition) ? "flex" : "none";

            // Ensure button container is visible
            const btnContainer = document.getElementById('btn-container');
            if (btnContainer) {
                btnContainer.style.opacity = 1;
            }
            isCameraMoving = false;
         
        }
    }

    updateCameraPosition();
}



