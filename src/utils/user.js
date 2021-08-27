const users = []
const addUser = ({id,username,room})=>{
    const userName = username
    username = username.trim().toLowerCase()
    const Room = room
    room = room.trim().toLowerCase()
    if(!username){
        return {
            error:'Username required'
        }
    }
    if(!room){
        return {
            error:'Room required'
        }
    }
    const existingUser = users.find((user)=>{
        return user.room.trim().toLowerCase()===room && user.username.trim().toLowerCase()=== username
    })
    if(existingUser)return{
        error:'Username is in use!'
    }
    const user = {id,username:userName,room:Room}
    users.push(user)
    return {user}
}
const removeUser = (id) => {
    const index = users.findIndex((user)=>{
        return user.id===id
    })
    if(index!=-1){
        return users.splice(index,1)[0]
    }
}
const getUser = (id) =>{
    const userF = users.find((user)=>{
        return user.id===id
    })
    return userF
}
const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase()
    return users.filter((user)=>{
        return user.room===room
    })
}

module.exports = {
    getUsersInRoom,
    getUser,
    removeUser,
    addUser
}
