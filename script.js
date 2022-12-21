const container = document.querySelector(".grid-container");
const button = document.querySelector(".size-button");
const pixelBtns = document.querySelectorAll(".pixel-button");
const saveImg = document.querySelector(".save-img");
const refreshGrid = document.querySelector(".refresh-grid");
const colorPicker = document.querySelector(".color-picker");
const cellCoordinates = document.querySelector(".cell-coordinates");

// creates the grid
function makeGrid(rows, cols) {
    container.style.setProperty("--grid-rows", rows);
    container.style.setProperty("--grid-cols", cols);

    for (let i = 0; i < (rows * cols); i++) {
        let cell = document.createElement("div");
        container.appendChild(cell).className = "grid-item";
        // cell.style.backgroundColor = "#fff";
    }
}
makeGrid(25, 25); 

// clears the grid for a new grid to be generated
function clearGrid() {
   let first = container.firstElementChild;
   while(first) {
    first.remove();
    first = container.firstElementChild;
   }
}

// draws grid based on user input
function drawGrid() {
    let sides = prompt("How many cells per side?");
    clearGrid();
    makeGrid(sides, sides);
    if(!Number(sides) || sides > 100 || sides < 16) {
        alert("Please enter a number between 16 and 100");
         clearGrid();
        makeGrid(sides = 25, sides = 25);
        
    }
    addHoverEventsToGridItems();
}
button.addEventListener("click", drawGrid);

function redrawGrid()  {
    for (const item of container.children){
        item.style.backgroundColor = "transparent";
    }
 };
refreshGrid.addEventListener("click", redrawGrid);
 
function addPixel(e) {
    e.target.style.backgroundColor = "black";
    container.addEventListener("mouseover", movePixel);
}

function movePixel(e) {
    e.target.style.backgroundColor = "black";
    if (e.buttons == 0) {
        container.removeEventListener("mouseover", movePixel);
    } 
}

function whiten(e) {
    e.target.style.backgroundColor = "transparent";
    container.addEventListener("mouseover", deletePixel);
}

function deletePixel(e) {
    e.target.style.backgroundColor = "transparent";
    if (e.buttons == 0) {
        container.removeEventListener("mouseover", deletePixel);
    } 
}

function random(number) {
    return Math.floor(Math.random()*number);
}

function setRgb() {
    const rndCol = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
    return rndCol;
}

function addRgb(e) {
    e.target.style.backgroundColor = setRgb();
    container.addEventListener("mouseover", changeRgb);
}

function changeRgb(e) {
    e.target.style.backgroundColor = setRgb();
    if (e.buttons == 0) {
        container.removeEventListener("mouseover", changeRgb);
    } 
}

pixelBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".pixel-button.selected").classList.remove("selected");
        btn.classList.add("selected");
        if (btn.classList.contains("selected") && btn.classList.contains("delete")) {
            container.removeEventListener("mouseover", movePixel);
            container.removeEventListener("mousedown", addPixel);
            container.removeEventListener("mousedown", addRgb);
            container.removeEventListener("mouseover", changeRgb);
            container.removeEventListener("mousedown", pickColor);
            container.removeEventListener("mouseover", colorPixel);
            container.addEventListener("mousedown", whiten);  
        } else if (btn.classList.contains("selected") && btn.classList.contains("default")) {
            container.removeEventListener("mouseover", deletePixel);
            container.removeEventListener("mousedown", whiten);
            container.removeEventListener("mouseover", changeRgb);
            container.removeEventListener("mousedown", addRgb);
            container.removeEventListener("mouseover", colorPixel);
            container.removeEventListener("mousedown", pickColor);
            container.addEventListener("mousedown", addPixel);
        } else if (btn.classList.contains("selected") && btn.classList.contains("rgb")) {
            container.removeEventListener("mouseover", deletePixel);
            container.removeEventListener("mousedown", whiten);
            container.removeEventListener("mouseover", movePixel);
            container.removeEventListener("mousedown", addPixel);
            container.removeEventListener("mouseover", colorPixel);
            container.removeEventListener("mousedown", pickColor);
            container.addEventListener("mousedown", addRgb);
        } else if (btn.classList.contains("selected", "color-picker")) {
            container.removeEventListener("mouseover", deletePixel);
            container.removeEventListener("mousedown", whiten);
            container.removeEventListener("mouseover", movePixel);
            container.removeEventListener("mousedown", addPixel);
            container.removeEventListener("mouseover", changeRgb);
            container.removeEventListener("mousedown", addRgb);
            container.addEventListener("mousedown", pickColor);
        }
    });
});
container.addEventListener("mousedown", addPixel);

function pickColor(e) {
    e.target.style.backgroundColor = colorPicker.value;
    container.addEventListener("mouseover", colorPixel);
}
colorPicker.addEventListener("change", pickColor)

function colorPixel(e) {
    e.target.style.backgroundColor = colorPicker.value;
    if (e.buttons == 0) {
        container.removeEventListener("mouseover", colorPixel);
    } 
}

// saveImg.addEventListener("click", () => {
//     const link = document.createElement("a");
//     link.download = `${Date.now}.jpg`;
//     // link.href = ;
//     link.click()
// });

// saveImg.addEventListener("click", () => {
//     const canvas = document.createElement("canvas");
//     document.body.appendChild(canvas);
//     const context = canvas.getContext("2d");
//     canvas.width = container.offsetWidth;
//     canvas.height = container.offsetHeight;
//     context.drawImage(container, 0, 0);
//     const imageData = canvas.toDataURL();
//     const link = document.createElement("a");
//     link.download = "pixelImg.jpg";
//     link.href = imageData;
//     link.click();
//     console.log(saveImg)
// });

function getGridElementsPosition(index) {

    // our indexes are zero-based but gridColumns are 1-based, so subtract 1
    let offset = Number(window.getComputedStyle(container.children[0]).gridColumnStart) - 1;

     // if we haven't specified the first child's grid column, then there is no offset
    if (isNaN(offset)) {
        offset = 0;
    }

    const colCount = window.getComputedStyle(container).gridTemplateColumns.split(" ").length;

    const rowPosition = Math.floor((index + offset) / colCount);
    const colPosition = (index + offset) % colCount;
  
    //Return an object with properties row and column
    return { row: rowPosition, column: colPosition };
  }

  function getNodeIndex(elm) {
    var c = elm.parentNode.children,
      i = 0;
    for (; i < c.length; i++) if (c[i] == elm) return i;
  }

  function addHoverEventsToGridItems() {
    let gridItems = document.getElementsByClassName("grid-item");
    for (let i = 0; i < gridItems.length; i++) {
      gridItems[i].onmouseenter = (e) => {
        let position = getGridElementsPosition(getNodeIndex(e.target));
        console.log(`Node position is row ${position.row}, column ${position.column}`);
        cellCoordinates.textContent = `Cell( x: ${position.column}, y: ${position.row})`;
      };
    }
  }
  
  addHoverEventsToGridItems();