import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import NavBar from './components/NavBar';
import Home from './pages/home'
import Info from './pages/info'
import Dev from './pages/Dev'


function App() {
  return (
    <>
    <BrowserRouter>
      <NavBar/>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/info" component={Info} />
        <Route path="/dev" component={Dev} />

      </Switch>
    </BrowserRouter>
    </>
  );
}

export default App;
