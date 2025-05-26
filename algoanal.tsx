import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, ChevronRight, Zap, Brain, Shuffle, MapPin } from 'lucide-react';

const AlgorithmVisualizer = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('mergeSort');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [arraySize, setArraySize] = useState(20);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [array, setArray] = useState([]);
  const [queens, setQueens] = useState([]);
  const [graph, setGraph] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState({ start: null, end: null });

  // Generate random array
  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 300) + 10
    );
    setArray(newArray);
    setCurrentStep(0);
    setSteps([]);
  }, [arraySize]);

  // Generate graph for Dijkstra
  const generateGraph = () => {
    const nodes = [];
    const edges = [];
    const gridSize = 8;
    
    // Create grid of nodes
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        nodes.push({ id: i * gridSize + j, x: j, y: i, distance: Infinity, visited: false });
      }
    }
    
    // Create edges between adjacent nodes
    nodes.forEach(node => {
      const { x, y } = node;
      const neighbors = [
        { x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 }
      ];
      
      neighbors.forEach(neighbor => {
        if (neighbor.x >= 0 && neighbor.x < gridSize && neighbor.y >= 0 && neighbor.y < gridSize) {
          const neighborNode = nodes.find(n => n.x === neighbor.x && n.y === neighbor.y);
          if (neighborNode && Math.random() > 0.2) { // 80% chance of connection
            edges.push({
              from: node.id,
              to: neighborNode.id,
              weight: Math.floor(Math.random() * 10) + 1
            });
          }
        }
      });
    });
    
    setGraph({ nodes, edges });
    setSelectedNodes({ start: null, end: null });
  };

  // Merge Sort Implementation
  const mergeSort = (arr) => {
    const steps = [];
    const workingArray = [...arr];
    
    const merge = (left, mid, right, array) => {
      const leftArr = array.slice(left, mid + 1);
      const rightArr = array.slice(mid + 1, right + 1);
      let i = 0, j = 0, k = left;
      
      while (i < leftArr.length && j < rightArr.length) {
        steps.push({
          array: [...array],
          comparing: [left + i, mid + 1 + j],
          sorted: []
        });
        
        if (leftArr[i] <= rightArr[j]) {
          array[k] = leftArr[i];
          i++;
        } else {
          array[k] = rightArr[j];
          j++;
        }
        k++;
      }
      
      while (i < leftArr.length) {
        array[k] = leftArr[i];
        i++;
        k++;
      }
      
      while (j < rightArr.length) {
        array[k] = rightArr[j];
        j++;
        k++;
      }
      
      steps.push({
        array: [...array],
        comparing: [],
        sorted: Array.from({ length: right - left + 1 }, (_, idx) => left + idx)
      });
    };
    
    const mergeSortHelper = (left, right, array) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        mergeSortHelper(left, mid, array);
        mergeSortHelper(mid + 1, right, array);
        merge(left, mid, right, array);
      }
    };
    
    mergeSortHelper(0, workingArray.length - 1, workingArray);
    return steps;
  };

  // Quick Sort Implementation
  const quickSort = (arr) => {
    const steps = [];
    const workingArray = [...arr];
    
    const partition = (low, high, array) => {
      const pivot = array[high];
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        steps.push({
          array: [...array],
          comparing: [j, high],
          pivot: high,
          sorted: []
        });
        
        if (array[j] < pivot) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];
          steps.push({
            array: [...array],
            comparing: [i, j],
            pivot: high,
            sorted: []
          });
        }
      }
      
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      steps.push({
        array: [...array],
        comparing: [],
        pivot: i + 1,
        sorted: [i + 1]
      });
      
      return i + 1;
    };
    
    const quickSortHelper = (low, high, array) => {
      if (low < high) {
        const pi = partition(low, high, array);
        quickSortHelper(low, pi - 1, array);
        quickSortHelper(pi + 1, high, array);
      }
    };
    
    quickSortHelper(0, workingArray.length - 1, workingArray);
    return steps;
  };

  // N-Queens Implementation
  const nQueens = (n) => {
    const steps = [];
    const board = Array(n).fill().map(() => Array(n).fill(false));
    
    const isSafe = (board, row, col) => {
      for (let i = 0; i < col; i++) {
        if (board[row][i]) return false;
      }
      
      for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j]) return false;
      }
      
      for (let i = row, j = col; j >= 0 && i < n; i++, j--) {
        if (board[i][j]) return false;
      }
      
      return true;
    };
    
    const solveNQueens = (board, col) => {
      if (col >= n) {
        steps.push({
          board: board.map(row => [...row]),
          success: true,
          backtrack: false
        });
        return true;
      }
      
      for (let i = 0; i < n; i++) {
        if (isSafe(board, i, col)) {
          board[i][col] = true;
          steps.push({
            board: board.map(row => [...row]),
            success: false,
            backtrack: false,
            current: [i, col]
          });
          
          if (solveNQueens(board, col + 1)) {
            return true;
          }
          
          board[i][col] = false;
          steps.push({
            board: board.map(row => [...row]),
            success: false,
            backtrack: true,
            current: [i, col]
          });
        }
      }
      
      return false;
    };
    
    solveNQueens(board, 0);
    return steps;
  };

  // Dijkstra's Algorithm Implementation
  const dijkstra = (graph, start, end) => {
    if (!graph || start === null || end === null) return [];
    
    const steps = [];
    const nodes = graph.nodes.map(node => ({ ...node }));
    const edges = graph.edges;
    
    nodes[start].distance = 0;
    const unvisited = new Set(nodes.map((_, i) => i));
    
    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let current = null;
      let minDistance = Infinity;
      
      for (const nodeId of unvisited) {
        if (nodes[nodeId].distance < minDistance) {
          minDistance = nodes[nodeId].distance;
          current = nodeId;
        }
      }
      
      if (current === null || minDistance === Infinity) break;
      
      unvisited.delete(current);
      nodes[current].visited = true;
      
      steps.push({
        nodes: nodes.map(node => ({ ...node })),
        current,
        finished: current === end
      });
      
      if (current === end) break;
      
      // Update distances to neighbors
      const neighbors = edges.filter(edge => edge.from === current);
      for (const edge of neighbors) {
        const neighbor = edge.to;
        if (!nodes[neighbor].visited) {
          const newDistance = nodes[current].distance + edge.weight;
          if (newDistance < nodes[neighbor].distance) {
            nodes[neighbor].distance = newDistance;
          }
        }
      }
    }
    
    return steps;
  };

  // Run algorithm
  const runAlgorithm = () => {
    setCurrentStep(0);
    let newSteps = [];
    
    switch (selectedAlgorithm) {
      case 'mergeSort':
        newSteps = mergeSort(array);
        break;
      case 'quickSort':
        newSteps = quickSort(array);
        break;
      case 'nQueens':
        newSteps = nQueens(8);
        break;
      case 'dijkstra':
        newSteps = dijkstra(graph, selectedNodes.start, selectedNodes.end);
        break;
      default:
        break;
    }
    
    setSteps(newSteps);
  };

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < steps.length) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1100 - speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps.length, speed]);

  // Initialize data
  useEffect(() => {
    generateArray();
    generateGraph();
  }, [generateArray]);

  const algorithms = {
    mergeSort: { name: 'Merge Sort', icon: Zap, color: 'blue' },
    quickSort: { name: 'Quick Sort', icon: Shuffle, color: 'green' },
    nQueens: { name: 'N-Queens', icon: Brain, color: 'purple' },
    dijkstra: { name: "Dijkstra's Algorithm", icon: MapPin, color: 'red' }
  };

  const currentAlgorithm = algorithms[selectedAlgorithm];
  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <currentAlgorithm.icon className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Algorithm Visualizer
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-700/50 rounded-lg px-3 py-2">
                <Settings className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300">Speed</span>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-20 accent-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold mb-4 text-slate-200">Algorithms</h2>
              <div className="space-y-2">
                {Object.entries(algorithms).map(([key, algo]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedAlgorithm(key)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      selectedAlgorithm === key
                        ? `bg-${algo.color}-500/20 border border-${algo.color}-500/30 text-${algo.color}-300`
                        : 'hover:bg-slate-700/50 text-slate-300'
                    }`}
                  >
                    <algo.icon className="w-5 h-5" />
                    <span className="font-medium">{algo.name}</span>
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="mt-8 space-y-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={steps.length === 0}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setCurrentStep(0);
                      setIsPlaying(false);
                    }}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={runAlgorithm}
                  className="w-full bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Run Algorithm
                </button>

                {(selectedAlgorithm === 'mergeSort' || selectedAlgorithm === 'quickSort') && (
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Array Size: {arraySize}</label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={arraySize}
                      onChange={(e) => setArraySize(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                    <button
                      onClick={generateArray}
                      className="w-full bg-slate-600 hover:bg-slate-700 px-3 py-2 rounded-lg text-sm transition-colors"
                    >
                      Generate New Array
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Visualization */}
          <div className="col-span-9">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-200">
                  {currentAlgorithm.name}
                </h2>
                {steps.length > 0 && (
                  <div className="text-sm text-slate-400">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                )}
              </div>

              {/* Sorting Visualization */}
              {(selectedAlgorithm === 'mergeSort' || selectedAlgorithm === 'quickSort') && (
                <div className="h-96 flex items-end justify-center space-x-1 bg-slate-900/50 rounded-lg p-4">
                  {(currentStepData?.array || array).map((value, index) => {
                    let color = 'bg-slate-500';
                    
                    if (currentStepData) {
                      if (currentStepData.comparing?.includes(index)) {
                        color = 'bg-red-400';
                      } else if (currentStepData.sorted?.includes(index)) {
                        color = 'bg-green-400';
                      } else if (currentStepData.pivot === index) {
                        color = 'bg-yellow-400';
                      } else {
                        color = 'bg-blue-400';
                      }
                    }
                    
                    return (
                      <div
                        key={index}
                        className={`${color} transition-all duration-300 rounded-t-sm flex items-end justify-center text-xs font-bold text-white`}
                        style={{
                          height: `${(value / 310) * 100}%`,
                          width: `${Math.max(800 / array.length - 2, 8)}px`
                        }}
                      >
                        {array.length <= 20 && (
                          <span className="mb-1">{value}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* N-Queens Visualization */}
              {selectedAlgorithm === 'nQueens' && (
                <div className="flex justify-center">
                  <div className="grid grid-cols-8 gap-1 bg-slate-900/50 p-4 rounded-lg">
                    {Array.from({ length: 64 }, (_, i) => {
                      const row = Math.floor(i / 8);
                      const col = i % 8;
                      const isQueen = currentStepData?.board?.[row]?.[col];
                      const isEven = (row + col) % 2 === 0;
                      const isCurrent = currentStepData?.current?.[0] === row && currentStepData?.current?.[1] === col;
                      
                      return (
                        <div
                          key={i}
                          className={`w-12 h-12 flex items-center justify-center text-2xl transition-all duration-300 ${
                            isEven ? 'bg-slate-300' : 'bg-slate-600'
                          } ${isCurrent ? 'ring-2 ring-yellow-400' : ''}`}
                        >
                          {isQueen && <span className={currentStepData?.backtrack ? 'text-red-500' : 'text-black'}>♛</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dijkstra Visualization */}
              {selectedAlgorithm === 'dijkstra' && graph && (
                <div className="space-y-4">
                  <div className="flex space-x-4 text-sm">
                    <button
                      onClick={() => setSelectedNodes(prev => ({ ...prev, start: null }))}
                      className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-white"
                    >
                      Set Start Node
                    </button>
                    <button
                      onClick={() => setSelectedNodes(prev => ({ ...prev, end: null }))}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                    >
                      Set End Node
                    </button>
                    <span className="text-slate-400">
                      Click nodes to select start (green) and end (red) points
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-8 gap-2 bg-slate-900/50 p-4 rounded-lg">
                    {graph.nodes.map((node, index) => {
                      const stepNode = currentStepData?.nodes?.[index] || node;
                      let bgColor = 'bg-slate-600';
                      
                      if (selectedNodes.start === index) bgColor = 'bg-green-500';
                      else if (selectedNodes.end === index) bgColor = 'bg-red-500';
                      else if (stepNode.visited) bgColor = 'bg-blue-400';
                      else if (currentStepData?.current === index) bgColor = 'bg-yellow-400';
                      
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            if (selectedNodes.start === null) {
                              setSelectedNodes(prev => ({ ...prev, start: index }));
                            } else if (selectedNodes.end === null && index !== selectedNodes.start) {
                              setSelectedNodes(prev => ({ ...prev, end: index }));
                            }
                          }}
                          className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center text-xs font-bold text-white hover:opacity-80 transition-all`}
                        >
                          {stepNode.distance === Infinity ? '∞' : stepNode.distance}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {steps.length > 0 && (
                <div className="mt-6">
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;
