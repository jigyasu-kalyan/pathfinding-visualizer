const gridContainer = document.getElementById('grid-container');
const visualizeBtn = document.getElementById('start-btn');
const NODE_SIZE = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--node-size'));

let grid = [];
let rows, cols;
let isMouseDown = false;
let startNode = null;
let endNode = null;

class Node {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.id = `node-${row}-${col}`;
        this.isStart = false;
        this.isEnd = false;
        this.isWall = false;
        this.distance = Infinity;
        this.previousNode = null;
        this.element = document.createElement('div');
        this.element.className = 'node';
        this.element.id = this.id;
    }
}

function createGrid() {
    const containerWidth = gridContainer.offsetWidth;
    const containerHeight = window.innerHeight * 0.7; 
    cols = Math.floor(containerWidth / NODE_SIZE);
    rows = Math.floor(containerHeight / NODE_SIZE);
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${NODE_SIZE}px)`;

    gridContainer.innerHTML = ''; 
    grid = [];

    for (let row = 0; row < rows; row++) {
        const currentRow = [];
        for (let col = 0; col < cols; col++) {
            const node = new Node(row, col);

            if (row === Math.floor(rows / 2) && col === Math.floor(cols / 2)) {
                node.isStart = true;
                node.element.classList.add('node-start');
                startNode = node;
            }
            else if (row === Math.floor(rows / 2) && col === Math.floor(cols * 3 / 4)) {
                node.isEnd = true;
                node.element.classList.add('node-end');
                endNode = node;
            }

            addEventListeners(node);
            gridContainer.appendChild(node.element);
            currentRow.push(node);
        }
        grid.push(currentRow);
    }
}

function addEventListeners(node) {
    node.element.addEventListener('mousedown', () => {
        if (!node.isStart && !node.isEnd) {
            node.classList.toggle('node-wall');
            node.isWall = !node.isWall;
        }
    });

    node.element.addEventListener('mouseover', () => {
        if (isMouseDown && !node.isStart && !node.isEnd) {
            node.element.classList.toggle('node-wall');
            node.isWall = !node.isWall;
        }
    });
}

function visualizeBFS() {
    console.log("1. Visualize button clicked!"); // Checkpoint 1
    const visitedNodesInOrder = bfs(startNode, endNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
    animate(visitedNodesInOrder, nodesInShortestPathOrder);
}

function bfs(startNode, endNode) {
    const visitedNodesInOrder = [];
    const queue = [startNode];
    startNode.distance = 0;
    const visited = new Set();
    visited.add(startNode);

    while (queue.length > 0) {
        const currentNode = queue.shift();
        visitedNodesInOrder.push(currentNode);

        if (currentNode === endNode) return visitedNodesInOrder;

        const neighbors = getNeighbors(currentNode);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor) && !neighbor.isWall) {
                visited.add(neighbor);
                neighbor.distance = currentNode.distance + 1;
                neighbor.previousNode = currentNode;
                queue.push(neighbor);
            }
        }
    }
    return visitedNodesInOrder;
}

function getNeighbors(node) {
    const neighbors = [];
    const { row, col } = node;

    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < rows - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < cols - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter(neighbor => !neighbor.isWall);
}

function getNodesInShortestPathOrder(endNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = endNode;

    while (currentNode !== null) {
        nodesInShortestPathOrder.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

function animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
                animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
        }
        setTimeout(() => {
            const node = visitedNodesInOrder[i];
            if (!node.isStart && !node.isEnd) {
                node.element.className = 'node node-visited';
            }
        }, 10 * i);
    }
}

function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            if (!node.isStart && !node.isEnd) {
                node.element.className = 'node node-path'
            }
        }, 50 * i);
    }
}

document.addEventListener('mousedown', () => { isMouseDown = true; });
document.addEventListener('mouseup', () => { isMouseDown = false; });
visualizeBtn.addEventListener('click', visualizeBFS);

createGrid();