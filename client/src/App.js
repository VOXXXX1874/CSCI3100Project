import './App.css';
import {Component} from 'react';
import {AuthContext} from './components/authentication/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';

class App extends Component{
  static contextType = AuthContext
  constructor(props){
    super(props);
    this.state = {apiResponse:""};
  }

  callAPI(){
    fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => this.setState({apiResponse:res}))
        .catch(err => err);
  }

  componentDidMount(){
    this.callAPI();
  }

  render(){
    const isLoggedIn = this.context
    return (
      <div className="App">
        {isLoggedIn ? <Login/>:<Home/>}
        <p className="App-test">{this.state.apiResponse}</p>
      </div>
    );
  }
}



export default App;
