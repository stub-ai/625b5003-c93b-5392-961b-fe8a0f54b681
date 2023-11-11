import React, { useState, useEffect, useRef, useCallback } from 'react';
import { produce } from 'immer';

const numRows = 50;
const numCols = 50;

// This will generate all the neighbors
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateRandomGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
  }

  return rows;
};

const GameOfLife = () => {
  const [grid, setGrid] = useState(() => {
    return generateRandomGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div
        className="grid grid-flow-row-dense gap-1"
        style={{
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              className={`w-5 h-5 ${grid[i][k] ? 'bg-pink-500' : 'bg-white'} border border-black`}
            />
          ))
        )}
      </div>
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? 'Stop' : 'Start'}
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
          onClick={() => {
            setGrid(generateRandomGrid());
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default GameOfLife;