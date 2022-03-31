const chatMessages = document.querySelector(".chat-messages"); //to scroll down
const chatForm = document.getElementById("chat-form");
const roomName = document.getElementById("room-name");
const userList = document.getElementById('users');


//Get Username and room from URL (from the qs library in the cdn)
const { username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true 
});

const socket = io();

//join chatroom
socket.emit('joinRoom', { username, room});

//Get room and users
socket.on('roomUsers', ({room, users}) => {
  //Dom Manipulation
  outputRoomName(room);
  outputUsers(users);

})

//Message From Server
socket.on('message', message =>{
  console.log(message);
  outputMessage(message);   

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
})

//message submit
//event listner fot the submission of the form
chatForm.addEventListener('submit', e=>{
  
  //prevents the submission of form to a file
  e.preventDefault();

  //Getting the text input
  //target gives us the current element
  //getting it by the id="msg"
  //.value to get the value
  const msg = e.target.elements.msg.value;

   //console.log(msg);
   //emitting a message to the server
   socket.emit('chatMessage', msg);

   //clear inputs
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});
//output message to dom
function outputMessage(message){

  //Little DOM Manipulation
  const div = document.createElement("div");
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  //putting into the DOM
  //we're using query selector because we dont have an id
  document.querySelector('.chat-messages').appendChild(div);
}
//add Room name to Dom
function outputRoomName(room){
  roomName.innerText = room;
}

//add users to dom
function outputUsers(users){
  //we use the join because its an array.(Turning an array into a string)
  userList.innerHTML = `
  ${users.map(user => `<li>${user.username}</li>`).join('')}`
}