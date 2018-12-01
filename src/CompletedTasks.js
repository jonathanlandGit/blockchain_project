import React, { Component } from "react"; 
import FlipMove from 'react-flip-move';

//another component that takes care of the creating and deleting the tasks as
//they are completed by those in the project/business. We have to import this into app.js
//for this to be ins scope. In keeping this separate, from the other component, we are 
//able to change this, if needed, in an easier way, thus keeping things loosely coupled
class CompletedTasks extends Component {  
  constructor(props) {    
    super(props);   

    this.createTasks = this.createTasks.bind(this);  

  }   
  
  delete(key){     
    this.props.delete(key);  
  }

  createTasks(item) { 
    return <li onClick={() => this.delete(item.key)} key={item.key}>{item.text}</li>
  }     
  
  render() { 
    var todoEntries = this.props.entries;  
    var listItems = todoEntries.map(this.createTasks);  

    return (     

      <ul className="theList">
        <FlipMove duration={250} easing="ease-out">  
          {listItems} 
        </FlipMove>   
      </ul>
      );  
    }
  } 
  
  export default CompletedTasks;




