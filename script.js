const gridContainer = document.getElementById('grid-container');
const NODE_SIZE = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--node-size'));

let grid = [];
let rows, cols;
let isMouseDown = false;

function createGrid() {
    const containerWidth = gridContainer.offsetWidth;
    const containerHeight = window.innerHeight * 0.7; 

    cols = Math.floor(containerWidth / NODE_SIZE);
    rows = Math.floor(containerHeight / NODE_SIZE);

    gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${NODE_SIZE}px)`;

    // Clear the grid before creating a new one
    gridContainer.innerHTML = ''; 
    grid = [];

    for (let i = 0; i < rows; i++) {
        const currentRow = [];
        for (let j = 0; j < cols; j++) {
            const node = document.createElement('div');
            node.className = 'node';
            node.id = `node-${i}-${j}`;
            let isStartNode = (i === Math.floor(rows / 2) && j === Math.floor(cols / 4));
            let isEndNode = (i === Math.floor(rows / 2) && j === Math.floor(cols * 3 / 4));
            if (isStartNode) node.classList.add('node-start');
            if (isEndNode) node.classList.add('node-end');

            node.addEventListener('mousedown', () => {
                if (!isStartNode && !isEndNode) node.classList.toggle('node-wall');
            });
            node.addEventListener('mouseover', () => {
                if (isMouseDown && !isStartNode && !isEndNode) node.classList.toggle('node-wall');
            });
            
            gridContainer.appendChild(node);
            currentRow.push(node);
        }
        grid.push(currentRow);
    }
}

createGrid();

document.addEventListener('mousedown', () => {
    isMouseDown = true;
});
document.addEventListener('mouseup', () => {
    isMouseDown = false;
});