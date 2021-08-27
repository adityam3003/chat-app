const path = require('path')
const http = require('http')
const {
    getUsersInRoom,
    getUser,
    removeUser,
    addUser
} = require('./utils/user')
const {generateMessage} = require('./utils/messages')
const socketio = require('socket.io')
const express = require('express')
const app = express()
const Filter = require('bad-words')
const server = http.createServer(app)
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')
const io = socketio(server)
// let count = 0
io.on('connection',(socket)=>{
    console.log('New Connection')
    socket.on('join',({username,room},callback)=>{
        const {error,user} = addUser({id:socket.id,username,room})
        if (error){
            return callback(error)
        }
        socket.join(room)
        let message = {
            message:'Welcome!',
            username:'Admin',
            room
        }
        socket.emit('message',generateMessage(message))
        message.message = `${username} has joined`
        socket.broadcast.to(room).emit('message',generateMessage(message))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    })
    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity not allowed')
        }
        io.to(message.room).emit('message',generateMessage(message))
        callback()
    })
    socket.on('sendLocation',(loc,callback)=>{
        let location = {
            message:'https://google.com/maps?q='+loc.latitude+','+loc.longitude,
            username:loc.username,
            room:loc.room
        }
        io.to(loc.room).emit('locationMessage',generateMessage(location))
        callback()
    })
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
            let uname = user.username
            user.username = 'Admin'
            io.to(user.room).emit('message',{...user,message:`${uname} has Left`})
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
        
    })
    // socket.emit('countUpdated',count)
    // socket.on('increment',()=>{
    //     count+=1
    //     io.emit('countUpdated',count)
    // })
})
app.use(express.static(publicDirectoryPath))
server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`)
})