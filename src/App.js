import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
//this is the import we're using to give us access to ipfs inside this js file to connect to 
//a remote node
import ipfs from './ipfs'
import CompletedTasks from "./CompletedTasks.js";

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'


//This is just a component that utilizes usual MVC design pattern. In this case
//we have the view at the bottom of the page, and we have a model and controller integrated
//within the main portion of this code. 
class App extends Component {
    constructor(props) {
        super(props)

        //we need this for data structures and other vars to change the state of the objects/components we are using
        //with our page template/view, as is standard in MVC design pattern
        this.state = {
            ipfsHash: '',
            web3: null,
            buffer: null,
            account: null,
            items: []
        }

        //In react, we have to "bind" our functions so that we can use them and change the state
        //data binding can be done in different ways, but this is a way that is commonly done in the constructor
        this.captureFile = this.captureFile.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.addItem = this.addItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }
    
    //Gets the web3 instance and network provider
    //If its not found, console log the error
    componentWillMount() {
        getWeb3
            .then(results => {
                this.setState({
                    web3: results.web3
                })

                // Instantiate contract once web3 provided.
                this.instantiateContract()
            })
            .catch(() => {
                console.log('There was an error finding web3.')
            })
    }

    //we need to have a way to instantiate our smart contracts, and also
    //to verify that they are working.
    instantiateContract() {
        //we are referencing the Simple storage contract here
        //and then getting the accounts which will produce a 
        //hash of those account and print them once they are migrated
        const contract = require('truffle-contract')
        const simpleStorage = contract(SimpleStorageContract)
        simpleStorage.setProvider(this.state.web3.currentProvider)

        //now we are getting the accounts then returning the hash of those accounts
        this.state.web3.eth.getAccounts((error, accounts) => {
            simpleStorage.deployed().then((instance) => {
                this.simpleStorageInstance = instance
                this.setState({ account: accounts[0] })
                //Get value from the contract to see if it worked
                return this.simpleStorageInstance.get.call(accounts[0])
            }).then((ipfsHash) => {
                //Now update the state with the resulting hash
                return this.setState({ ipfsHash })
            })
        })
    }

    //The goal of this method is to capture the file to submit it to IPFS
    //This is where the file conversion happens, when the input/image changes
    //First, we have to get the file using file reader
    //Second, we have to take binary and translate to a form to be understood and store in IPFS, so
    //we're using a buffer for this (this comes with node)
    captureFile(event) {
        //we want it to stay on the same page, we don't want there to be a constant refreshing
        //of the page
        event.preventDefault()
        //es6 we are declaring var here, so we don't want this to change value
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            this.setState({ buffer: Buffer(reader.result) })
            console.log('buffer', this.state.buffer)
        }
    }

    onSubmit(event) {
        event.preventDefault()
        ipfs.files.add(this.state.buffer, (error, result) => {
            if (error) {
                console.error(error)
                return
            }
            this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
                return this.setState({ ipfsHash: result[0].hash })
                console.log('ifpsHash', this.state.ipfsHash)
            })
        })
    }

    //This is a method I was using for tests. After 
    onKeyPress(event) {
        /*
            var text = "test";
            var name = new Date() + "name.txt"; 
            //console.log(this._inputElement.value);
            var file = new File([text], name, {
          type: "text/plain",
        });
            console.log(file);
            const reader = new window.FileReader()
            reader.readAsArrayBuffer(file)
            reader.onloadend = () => {
          
            console.log(this);
            this.setState({ textBuffer: Buffer(reader.result)})
            console.log('buffer', this.state.textBuffer)
            }
            */
    }

    //add items to the list on click and get timestamp, as well as store comments in IPFS
    //so that hash will be returned in console
    addItem(e) {

        var text = this._inputElement.value;
        var name = new Date() + "name.txt";
        //console.log(this._inputElement.value);
        var file = new File([text], name, {
            type: "text/plain",
        });
        console.log(file);
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {

            console.log(this);
            this.setState({ textBuffer: Buffer(reader.result) })
            console.log('buffer', this.state.textBuffer)
        }

        ipfs.files.add(this.state.textBuffer, (error, result) => {
            if (error) {
                console.error(error)
                return
            }

            console.log({ ipfsHash: result[0].hash });
               
            //take instance of SC and add the iphash from comments
            //this.simpleStorageInstance.set(result[0].hash, { from: this.state.account }).then((r) => {
            //return this.setState({ ipfsHash: result[0].hash })
            //console.log('ifpsHash', this.state.ipfsHash)
            //})
            
        })

        var itemArray = this.state.items;

        let timestamp = new Date();
        let date = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(timestamp)

        if (this._inputElement.value !== "") {
            itemArray.unshift({
                    text: this._inputElement.value + " " + date,
                    key: Date.now()
                }
            );

            this.setState({
                items: itemArray
            });

            this._inputElement.value = "";
        }

        console.log(new Date(), itemArray);

        this.setState({ date: new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(timestamp) });

        e.preventDefault();
    }

    //delete items from the list on click. In this method, we are changing
    //the items in the array that we are using, using the filter function.
    //Filter is just another way to to do for loop over an array of items.
    //In this case, we are looping through the items in the array and if
    //it does not have a key, we are changing the state of the array by setting
    //it equal to the filteredItems
    deleteItem(key) {
        //In this case we are filtering the items that 
        var filteredItems = this.state.items.filter(function(item) {
            return (item.key !== key);
        });

        this.setState({
            items: filteredItems
        });
    }

    /*
      myFunction(item, index) {
        var numbers = [new Date()];
        numbers = [];
        //demoP.innerHTML = demoP.innerHTML + "index[" + index + "]: " + item + "<br>"; 
        numbers.push(new Date()); 
    }
    */

    //view/page template
    render() {
        return (
            <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <img src="/vandelay_industries.jpeg" alt="img" width="128" height="120" ></img>

        <a href="#" className="pure-menu-heading pure-menu-link">File Upload DApp Using IPFS</a>
        </nav>

        <main className="container">

             <div className="taskContainer">
          
                   <form onSubmit={this.addItem}>    

                      <input ref={(a) => this._inputElement = a} 
                      placeholder="Enter comments" onKeyPress={this.onKeyPress}>      
                       </input>            

                     <button type="submit">Add</button>  
                    </form>  
                          <p>Most Recent Entry: {this.state.date}</p>

                        <CompletedTasks entries={this.state.items}
                        delete={this.deleteItem}/> 
              </div>

                <h1>Image</h1>
                <p>This image will be stored on IPFS & The Ethereum Blockchain</p>
                <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
                <h2>Upload Image</h2>
                <form onSubmit={this.onSubmit} >
                    <input type='file' onChange={this.captureFile} />

                  <input type='submit' />
                </form>

                <h2>Download Image</h2>
                  <a href={`https://ipfs.io/ipfs/${this.state.ipfsHash}`}>
                    <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
                  </a>
           
        </main>
      </div>
        );
    }
}

export default App