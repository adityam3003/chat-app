const socket = io()
const $messageForm = document.querySelector('#messageSend')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')
const $chatbar = document.querySelector('.chat__sidebar')
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = ()=>{
    const $newMessage = $messages.lastElementChild
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    const visibleHeight = $messages.offsetHeight
    const containerHeight = $messages.scrollHeight
    const scrollOffset = $messages.scrollTop + visibleHeight
    if(containerHeight - newMessageHeight<= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('roomData',(roomData)=>{
    let html = `<h2 class="room-title">${roomData.room}</h2><h3 class="list-title">Users</h3><ul class="users">`
    roomData.users.forEach(user=>{
        html+=`<li>${user.username}</li>`
    })
    html+=`</ul>`
    $chatbar.innerHTML = html
})
socket.on('message',(message)=>{
    console.log(message)
    const html = `<div class="message"><p><span class="message__name">${message.username}</span><span class="message__meta">${moment(
      message.createdAt
    ).format("h:mm A")}</span></p><p>${message.message}</p></div>`;
    $messages.insertAdjacentHTML('beforeEnd',html)
    autoscroll()
})
socket.on('locationMessage',(url)=>{
    console.log(url)
    const html = `<div class="message"><p><span class="message__name">${url.username}</span><span class="message__meta">${moment(
      url.createdAt
    ).format("h:mm A")}</span></p><a href= ${
      url.message
    } target="_blank">Location</a></div>`;
    $messages.insertAdjacentHTML('beforeEnd',html)
    autoscroll()
})
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    let message = {
        message:e.target.elements.message.value,
        username,
        room
    }
    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error){
            return console.log(error)
        }
        console.log('Delivered')

    })
})
const $sendLocation = document.querySelector('#send-location')
$sendLocation.addEventListener('click',()=>{
    $sendLocation.setAttribute('disabled','disabled')
    $messageFormButton.setAttribute('disabled','disabled')
    if (!navigator.geolocation){
        return alert('No locations')
    }
    $sendLocation.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position) => {
      let message = {
        username,
        room,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      socket.emit("sendLocation", message,()=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        $sendLocation.removeAttribute('disabled')
        console.log('Location shared')
      });
    });
})
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})
// socket.on('countUpdated',(count)=>{
//     console.log('Count is updated '+count)
// })
// document.querySelector('#addOne').addEventListener('click',()=>{
//     console.log('Increment')
//     socket.emit('increment')
// })