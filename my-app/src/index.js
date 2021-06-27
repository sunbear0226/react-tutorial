import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Row extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={'square-' + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() { 
    return (
      <div className="board-row">
        {[...Array(this.props.col)].map((_, i) => this.renderSquare(i + this.props.start))}
      </div>
    );
  }
}

function Board(props) {
  return (
    <div>
      {[...Array(props.squares.length)].map((_, i) => i).filter((v) => v % props.col === 0).map((v, i) => {
        return <Row key={'row-' + i} start={v} col={props.col} squares={props.squares} onClick={props.onClick}></Row>
      })}
    </div>
  )
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    const col = 4;
    const row = 4;
    this.state = {
      col: col,
      row: row,
      history: [{
        squares: Array(col * row).fill(null),
        point: null,
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat({
        squares: squares,
        point: i,
      }),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    // array.mapは3つ引数をとる(要素、添字、配列)
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const col = step.point % this.state.col + 1
      const row = Math.floor(step.point / this.state.col) + 1
      return (
        <li key={move} className={move === this.state.stepNumber ? 'current' : undefined}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          {move !== 0 && '(' + col + ', ' + row + ')'}
        </li>
      );
    }, this);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            col={this.state.col}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}