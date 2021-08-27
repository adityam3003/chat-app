const generateMessage = (message)=>{
    return{
        ...message,
        'createdAt':new Date()
    }
}
module.exports = {
    generateMessage
}