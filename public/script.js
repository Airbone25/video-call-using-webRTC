const socket = io('/')

const peer = new Peer(undefined,{
    host: '/',
    port: '3001'
})

const videoGrid = document.getElementById('video-grid')
const video = document.createElement('video')
video.muted = true

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream=>{
    addVideoStream(video,stream)
}).catch(error=>console.error(error.message))


peer.on('open',id=>{
    socket.emit('join-room',ROOMID,id)
})

socket.on('user-connected',userId=>{
    console.log(userId)
})


function addVideoStream(video,stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video)
}