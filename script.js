const gridContainer = document.getElementById('grid-container');
const NODE_SIZE = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--node-size'));

let grid = [];
let rows, cols;

function createGrid() {
    const containerWidth = gridContainer.offsetWidth;
    const containerHeight = window.innerHeight * 0.7; 
    console.log("Container Width:", containerWidth);
    console.log("NODE_SIZE:", NODE_SIZE); 

    cols = Math.floor(containerWidth / NODE_SIZE);
    rows = Math.floor(containerHeight / NODE_SIZE);
    console.log("Calculated Cols:", cols); 
    console.log("Calculated Rows:", rows);  

    gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${NODE_SIZE}px)`;

    for (let i = 0; i < rows; i++) {
        const currentRow = [];
        for (let j = 0; j < cols; j++) {
            const node = document.createElement('div');
            node.className = 'node';
            node.id = `node-${i}-${j}`;
            
            if (i === Math.floor(rows / 2) && j === Math.floor(cols / 4)) {
                node.classList.add('node-start');
            } else if (i === Math.floor(rows / 2) && j === Math.floor(cols * 3 / 4)) {
                node.classList.add('node-end');
            }
            
            gridContainer.appendChild(node);
            currentRow.push(node);
        }
        grid.push(currentRow);
    }
}

createGrid();