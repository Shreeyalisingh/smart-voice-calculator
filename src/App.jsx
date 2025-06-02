import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const calculate = () => {
    try {
      let expression = input;

      // √100 → sqrt(100)
      expression = expression.replace(/√(\d+(\.\d+)?)/g, 'sqrt($1)');

      // √(...) → sqrt(...)
      expression = expression.replace(/√\(([^)]+)\)/g, 'sqrt($1)');

      // log100 → log10(100)
      expression = expression.replace(/\blog(\d+(\.\d+)?)/g, 'log10($1)');

      // log(...) → log10(...)
      expression = expression.replace(/\blog\(([^)]+)\)/g, 'log10($1)');

      const evalResult = evaluate(expression);
      setResult(evalResult);
      setHistory((prev) => [...prev, `${input} = ${evalResult}`]);
    } catch {
      setResult('Error');
    }
  };

  const clear = () => {
    setInput('');
    setResult('');
  };

  const backspace = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript.toLowerCase();

      const formatted = spoken
        .replace(/plus/gi, '+')
        .replace(/minus/gi, '-')
        .replace(/times|multiply|into/gi, '*')
        .replace(/divided by|divide by|by/gi, '/')
        .replace(/power|to the power of/gi, '^')
        .replace(/square root of (\d+(\.\d+)?)/gi, '√($1)')
        .replace(/square root of/gi, '√(')
        .replace(/log of (\d+(\.\d+)?)/gi, 'log($1)')
        .replace(/log (\d+(\.\d+)?)/gi, 'log($1)')
        .replace(/\s+/g, '');

      setInput(formatted);
    };
    recognition.start();
  };

  const buttons = [
    '7', '8', '9', '/', '√(',
    '4', '5', '6', '*', '^',
    '1', '2', '3', '-', 'log₁₀(',
    '0', '.', '(', ')', '+'
  ];

  return (
    <div className="container">
      <h1>Smart Voice Calculator</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter expression or use voice"
        className="input-field"
      />
      <div className="button-grid">
        {buttons.map((val, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (val === 'log₁₀(') handleClick('log(');
              else handleClick(val);
            }}
          >
            {val}
          </button>
        ))}
        <button onClick={clear} className="control-button">C</button>
        <button onClick={backspace} className="control-button">⌫</button>
        <button onClick={calculate} className="equals-button">=</button>
      </div>
      <button onClick={handleVoiceInput} className="voice-button">
         Speak Expression
      </button>
      <h2>Result: {result}</h2>
      <h3>History:</h3>
      <ul className="history">
        {history.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
      <p className="note">Note: log₁₀(x) = log base 10, √x = square root, ^ = power</p>
    </div>
  );
}

export default App;
