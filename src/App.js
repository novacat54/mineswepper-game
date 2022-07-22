import './App.css';
import Table from './components/Table';
import React from 'react';

function App() {

  const [data, setData] = React.useState([]);
  const [bombsLeft, setBombsLeft] = React.useState(40);
  const [gameState, setGameState] = React.useState('');
  const [timeSpent, setTimeSpent] = React.useState(0);
  const [timerInterval, setTimerInterval] = React.useState(0);
  let timeStart = '';

  const startGame = (event) => {
    let table = [];
    let id = 1;
    for (let i = 0; i < 16; i++) {
      let row = [];
      for (let x = 0; x < 16; x++) {
        let cell = { view: "hidden", value: 0, id: id };
        row.push(cell);
        id++;
      }
      table.push(row);
    }
    event.target.disabled = true;
    table = putBombs(table);
    table = putValues(table);
    table = replaceZeroValues(table);
    setGameState('InProgress');
    setData([...table]);
    setTimeSpent(0);
    timeStart = Date.now();
    const timerIntervalId = setInterval(timer, 1000);
    setTimerInterval(timerIntervalId);
  }

  const timer = () => {
    const milisecondsPassed = Date.now() - timeStart;
    const secondsPassed = Math.floor(milisecondsPassed / 1000);
    setTimeSpent(secondsPassed);
  }

  const putBombs = (table) => {
    let bombs = 0;
    do {
      let cell = table[Math.floor(Math.random() * 16)][Math.floor(Math.random() * 16)];
      if (cell.value != 'b') {
        cell.value = 'b';
        bombs++;
      }
    } while (bombs < 40);
    return table;
  }

  const putValues = (table) => {
    for (let i = 0; i < 16; i++) {
      for (let n = 0; n < 16; n++) {
        if (table[i][n].value == "b") {
          continue;
        } else {
          if (table[i][n + 1] != undefined && table[i][n + 1].value == "b") {
            table[i][n].value += 1;
          }
          if (table[i][n - 1] != undefined && table[i][n - 1].value == "b") {
            table[i][n].value += 1;
          }
          if (table[i + 1] != undefined) {
            if (table[i + 1][n + 1] != undefined && table[i + 1][n + 1].value == "b") {
              table[i][n].value += 1;
            }
            if (table[i + 1][n] != undefined && table[i + 1][n].value == "b") {
              table[i][n].value += 1;
            }
            if (table[i + 1][n - 1] != undefined && table[i + 1][n - 1].value == "b") {
              table[i][n].value += 1;
            }
          }
          if (table[i - 1] != undefined) {
            if (table[i - 1][n - 1] != undefined && table[i - 1][n - 1].value == "b") {
              table[i][n].value += 1;
            }
            if (table[i - 1][n] != undefined && table[i - 1][n].value == "b") {
              table[i][n].value += 1;
            }
            if (table[i - 1][n + 1] != undefined && table[i - 1][n + 1].value == "b") {
              table[i][n].value += 1;
            }
          }
        }
      }
    }
    return table;
  }

  const replaceZeroValues = (table) => {
    return table.map(entry => entry.map(cellEntry => cellEntry.value === 0 ? { ...cellEntry, value: '' } : cellEntry));
  }

  const handleClick = (cell) => {
    if (gameState !== 'Loss') {
      let newData = data.map(entry => entry.map(cellEntry => cellEntry.id === cell.id && cell.view === 'hidden' ? { ...cellEntry, view: 'opened' } : cellEntry));
      let cellObject = newData.find(entry => entry.find(cellEntry => cellEntry.id === cell.id)).find(entry => entry.id === cell.id);
      let parsedTable = JSON.parse(JSON.stringify(newData));
      if (cellObject.value === '' && cellObject.value === '') {
        let newTableWithOpenedEmptyCells = openNeiborEmptyCelles(parsedTable);
        while (JSON.stringify(newTableWithOpenedEmptyCells) !== JSON.stringify(newData)) {
          newData = JSON.parse(JSON.stringify(newTableWithOpenedEmptyCells));
          newTableWithOpenedEmptyCells = openNeiborEmptyCelles(newTableWithOpenedEmptyCells);
        }
      }
      setData([...newData]);
      if (cellObject.value === 'b' && cellObject.view === 'opened') {
        setGameState('Loss');
        clearInterval(timerInterval);
        openAllBombCells();
      }
      if (!newData.some(entry => entry.some(cellEntry => cellEntry.view !== 'opened' && cellEntry.value !== 'b'))) {
        setGameState('Win!')
        clearInterval(timerInterval);
      }
    }
  }

  const openAllBombCells = () => {
    let newData = data.map(entry => entry.map(cellEntry => cellEntry.value === 'b' ? { ...cellEntry, view: 'opened' } : cellEntry));
    setData([...newData]);
  }

  const handleRightClick = (cell) => {
    if (gameState !== 'Loss') {
      let newData = data.map(entry =>
        entry.map(cellEntry => cellEntry.id === cell.id && cell.view === 'opened' ? cellEntry :
          cellEntry.id === cell.id && cell.view === 'hidden' ? { ...cellEntry, view: 'flagged' } :
            cellEntry.id === cell.id && cell.view === 'flagged' ? { ...cellEntry, view: 'hidden' } : cellEntry));
      cell.view === 'hidden' ? setBombsLeft(bombsLeft - 1) : cell.view === 'flagged' ? setBombsLeft(bombsLeft + 1) : setBombsLeft(bombsLeft);
      setData([...newData]);
    }
  }

  const openNeiborEmptyCelles = (table) => {
    let newTable = table;
    let opened = 'opened';
    for (let i = 0; i < 16; i++) {
      for (let n = 0; n < 16; n++) {
        if (newTable[i][n].value === '' && newTable[i][n].view == opened) {
          if (newTable[i][n + 1] != undefined) {
            newTable[i][n + 1].view = opened;
          }
          if (newTable[i][n - 1] != undefined) {
            newTable[i][n - 1].view = opened;
          }
          if (newTable[i + 1] != undefined) {
            if (newTable[i + 1][n + 1] != undefined) {
              newTable[i + 1][n + 1].view = opened;
            }
            if (newTable[i + 1][n] != undefined) {
              newTable[i + 1][n].view = opened;
            }
            if (newTable[i + 1][n - 1] != undefined) {
              newTable[i + 1][n - 1].view = opened;
            }
          }
          if (newTable[i - 1] != undefined) {
            if (newTable[i - 1][n - 1] != undefined) {
              newTable[i - 1][n - 1].view = opened;
            }
            if (newTable[i - 1][n] != undefined) {
              newTable[i - 1][n].view = opened;
            }
            if (newTable[i - 1][n + 1] != undefined) {
              newTable[i - 1][n + 1].view = opened;
            }
          }
        }
      }
    }
    return newTable;
  }

  return (
    <div className="App">
      <header className="App-header">
        Mineswepper game
      </header>
      <button onClick={(event) => startGame(event)}>Start</button>
      {data.length == 0 ? "" : <Table allCels={data} clickOnCellHandler={handleClick} rightClickOnCellHandler={handleRightClick} bombsNotFound={bombsLeft} gameTimeTotal={timeSpent} />}
      {gameState !== "Loss" ? "" : <div className='gameOver'>Game Over! You've lost!</div>}
      {gameState === "Win!" ? <div className='youWon'>Fucking bastard! Today is your lucky day!</div> : ''}
    </div>
  );
}

export default App;
