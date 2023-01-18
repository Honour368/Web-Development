import React from 'react'
import logo from './logo.svg';
import './App.css';
// import styles from "./App.module.css"
import $, { event, extend } from 'jquery';

class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userName:"",
      password:""
    }
  }

  handleUserNameChange(event){
    this.setState({userName: event.target.value})
  }

  handlePasswordChange(event){
    this.setState({password: event.target.value})
  }

  render() {
    return(
      <div id="parent">
        <h1>iNotes</h1>
        Username <input type="text" name="username" onChange={this.handleUserNameChange.bind(this)}></input><br/>
        Password <input type="password" name="password" onChange={this.handlePasswordChange.bind(this)}></input><br/>
        <input type="submit" value="submit" onClick={this.props.updateUserDetails.bind(this, this.state.userName, this.state.password)}></input>
      </div>
    )
  }
}

function Header(props) {
  return(
    <div className='headerDiv'>
      <img src={"http://localhost:3001/"+props.icon} className="logo" width="50px" height="50px"/>
      <p className='username'>{props.name}</p>
      <button className="logout" type="submit" value="logout" onClick={props.logout}>Logout</button>
    </div>
  )
}

function LeftDivPrint(props) {
  console.log("LeftDiv function called")
  console.log(props.title)
  if (props.highlight=="yes") {
    return(
      <li className="highlight" id={props.id} onClick={props.selectNote.bind(this)}>{props.title}</li>
    )
  }
  return (<li id={props.id} onClick={props.selectNote.bind(this)}>{props.title}</li>)
}

class LeftDiv extends React.Component{
  constructor(props) {
    super(props)
    this.state = {highlightNoteId:""}

  }

  selectNote(event) {
    var id = event.target.getAttribute("id")
    // console.log("select note called")
    // console.log(id)
    this.setState({highlightNoteId:id})
    this.props.selectNote(id)
  }


  render() {
    return(
      <div className="LeftDiv">
        <input type="text" name="text" className="searchBar" placeholder="Search" // onChange={searchNotes}
            />
        <h2>Notes({this.props.noteDetails.length})</h2> 
        <ul>
          {this.props.noteDetails.map((note)=>{
            if (note["_id"]==this.state.highlightNoteId) {
              return <LeftDivPrint highlight="yes" title={note["title"]} key={note["_id"]} id={note["_id"]} selectNote={this.selectNote.bind(this)}/>
            }
            return <LeftDivPrint highlight="no" title={note["title"]} key={note["_id"]} id={note["_id"]} selectNote={this.selectNote.bind(this)}/>
          })}
        </ul>
      </div>
    )
  }
}

class RightDiv extends React.Component{
  constructor(props) {
    super(props)
    this.state = {editMode:false, justSaved:false, noteTitle:"", noteContent:"", lastsavedtime:""}

  }

  saveNote() {
    this.setState({justSaved:true})
    this.setState({editMode:false})
    $.ajax({
      method:"POST",
      url: "http://localhost:3001/addnote",
      data: {title: this.state.noteTitle, content: this.state.noteContent},
      success: ((result)=>{
        if (result!="Login Failure"){
            this.setState({lastsavedtime:result["lastsavedtime"]})
            this.props.saveNote(result["noteId"])
        }
        else {
          alert(result)
        }
        
      })
    })
  }

  cancelButton() {
    var confirm = alert("Are you sure you want to cancel?");
    if (confirm) {
      this.setState({editMode:false})
      /////not complete
    }
  }

  deleteNote() {

  }

  handleTitleChange(event) {
    this.setState({noteTitle: event.target.value})
    this.setState({editMode:true})
  }

  handleContentChange(event) {
    this.setState({noteContent: event.target.value})
    this.setState({editMode:true})
  }

  newNote() {
    this.setState({editMode:true})
    return(
      <div>
        <div className='controls'>
          <button className='save' onClick={this.saveNote.bind(this)}>Save</button>
          <button className='cancel' onClick={this.cancelButton.bind(this)}>Cancel</button>
        </div>
        <div>
          <input type="text" placeholder='Note Title' onChange={this.handleTitleChange.bind(this)}></input>
        </div>
        <div>
          <input type="text" placeholder='Note Content' onChange={this.handleContentChange.bind(this)}></input>
        </div>
      </div>
    )
  }

  displayNote(displayNoteDetails) {
    // if (this.state.justSaved) {
    //   // this.setState({lastsavedtime: displayNoteDetails["lastsavedtime"]})
    //   this.setState({justSaved:false})
    // }
    // else {
    //   this.setState({noteTitle: displayNoteDetails["title"]})
    //   this.setState({noteContent: displayNoteDetails["content"]})
    //   this.setState({lastsavedtime: displayNoteDetails["lastsavedtime"]})
    // }
    
    return(
      <div>
        <div>
          Last saved: {displayNoteDetails["lastsavedtime"]}
          <button className="delete" onClick={this.deleteNote.bind(this)}>Delete</button>
        </div>
        <div>
          <input className='displayNoteTitle' type="text" placeholder={displayNoteDetails["title"]} onChange={this.handleTitleChange.bind(this)}></input><br/>
          <input className='displayNoteContent' type="text" placeholder={displayNoteDetails["Content"]} onChange={this.handleContentChange.bind(this)}></input>
        </div>
        <div>
        <button className="newNote" onClick={this.newNote.bind(this)}>New Note icon</button>
        </div>
      </div>
    )
  }

  render() {
    console.log(this.props.displayNoteDetails)
    if (!this.state.editMode){
      if(!this.state.justSaved) {
        return( //new note page
          <div className="RightDiv">
            <div></div>
            <button className="newNote" onClick={this.newNote.bind(this)}>New Note icon</button>
          </div>
        )
      }
      else {
        this.setState({justSaved:false})
        return(
          <div className="RightDivEditMode">
            {this.displayNote(this.props.displayNoteDetails)}
          </div>
        )
      }
    }
    else{
      return(
        <div className="RightDivEditMode">
          {this.displayNote(this.props.displayNoteDetails)}
        </div>
      )
    }
  }
}

class NotePage extends React.Component{
  constructor(props) {
    super(props)
    this.state = {displayNoteDetails:{}, userDetails:{}, }

  }

  logout() {
    this.props.logout()
  }

  saveNote(noteId) {
    this.props.updateUserDetails(this.props.userName, this.props.password)
    this.saveNote(noteId)
  }

  selectNote(id) {
    console.log("Parent SelectNote called")
    // console.log(id)
    $.ajax({
      method:"GET",
      url: "http://localhost:3001/getnote?noteid="+id,
      success: ((result)=>{
        console.log(result)
        // this.setState({editMode:true})
        this.setState({displayNoteDetails:result})
        console.log(this.state.displayNoteDetails)
      }).bind(this)
    })
  }

  render(){
    // this.setState()
    return (
      <div>
        <Header 
          icon={this.props.userDetails["icon"]}
          name={this.props.userDetails["name"]}
          logout={this.logout.bind(this)}
        />
        <LeftDiv noteDetails={this.props.userDetails["notesArray"]} selectNote={this.selectNote.bind(this)}/>
        <RightDiv displayNoteDetails={this.state.displayNoteDetails} saveNote={this.saveNote.bind(this)}/>
      </div>
    )
  }
}

class iNoteApp extends React.Component{
  constructor(props) {
    super(props)
    this.state = {isLoggedIn:false, userDetails:{}, username:"", password:""}
  }

  updateUserDetails(username, password){
    console.log(username)
    this.setState({username:username, password:password})
    $.ajax({
      method:"POST",
      url: "http://localhost:3001/signin",
      data: {userName: username, password: password},
      success: ((result)=>{
        if (result!="Login Failure"){
          this.setState({isLoggedIn: true})
          this.setState({userDetails: result})
        }
        else {
          alert(result)
        }
        
      })
    })
  }

  logout() {
    $.get("http://localhost:3001/logout")
    this.setState({isLoggedIn: false})
  }

  render() {
    if (this.state.isLoggedIn){
      return <NotePage 
                userDetails={this.state.userDetails}
                username={this.state.username}
                password={this.state.password}
                updateUserDetails={this.updateUserDetails.bind(this)} 
                logout={this.logout.bind(this)}
              />;
    }
    return <LoginPage updateUserDetails={this.updateUserDetails.bind(this)}/>
  }
}

export default iNoteApp