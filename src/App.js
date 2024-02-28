import logo from './logo.svg';
import { ConnectionProvider } from './components/ConnectionContext';
import './App.css';
import Main from './components/Main';

function App() {
  console.log("app")
  return (
    <ConnectionProvider>
      <div className="App">
        <Main></Main>
      </div>
    </ConnectionProvider>
  );
}

export default App;
