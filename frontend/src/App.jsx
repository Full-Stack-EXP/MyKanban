import React from 'react';
import Board from './components/Board/Board.jsx';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Kanban App</h1>
      </header>
      <Board />
    </div>
  );
}

export default App;