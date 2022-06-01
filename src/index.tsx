import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';

type SquareProps = {
  value: number;
  onClick: () => void;
}

function Square(props: SquareProps) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

type BoardProps = {
  squares: number[];
  onClick: (i: number) => void;
}

class Board extends React.Component<BoardProps> {
  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

type GameState = {
  history: {
    squares: number[],
    col: number,
    row: number
  }[];
  stepNumber: number;
  xIsNext: boolean;
}

class Game extends React.Component<{}, GameState> {
  state = {
    history: [{ squares: Array(9).fill(null), col: null, row: null }],
    stepNumber: 0,
    xIsNext: true,
  };

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    })
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const col = i % 3;
    const row = Math.floor(i / 3);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ squares, col, row }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    if (winner) {
      status = `Winner: ${winner}`;
    }

    const moves = history.map((step, move) => {
      let desc = move ?
        <span>{`(${step.row}, ${step.col}) Go to move #${move}`}</span> :
        <span>{`Go to start`}</span>;

      if (move === this.state.stepNumber) {
        desc = <strong>{desc}</strong>;
      }

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)} />
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

function TemperatureInput(props: { temperature: number, onTemperatureChange: (e) => void }) {
  return (
    <input value={props.temperature} onChange={props.onTemperatureChange} />
  );
}

class Calculator extends React.Component<{}, { temperature: number, scale: string }> {
  state = {
    temperature: 0,
    scale: 'c'
  }

  handleCelsiusChange(e) {
    this.setState({
      temperature: +e.target.value,
      scale: 'c',
    });
  }

  handleFahrenheitChange(e) {
    this.setState({
      temperature: +e.target.value,
      scale: 'f',
    });
  }

  render() {
    const celsius = this.state.scale === 'c' ? this.state.temperature : toFahrenheit(this.state.temperature);
    const fahrenheit = this.state.scale === 'f' ? this.state.temperature : toCelsius(this.state.temperature);

    return (
      <div>
        <TemperatureInput temperature={celsius} onTemperatureChange={(e) => this.handleCelsiusChange(e)} />
        <TemperatureInput temperature={fahrenheit} onTemperatureChange={(e) => this.handleFahrenheitChange(e)} />
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div>
    <Game />
    <hr />
    <Calculator />
  </div>
);

// ========================================

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

function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
