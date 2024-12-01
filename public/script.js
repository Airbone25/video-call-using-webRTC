const socket = io('/')

const peer = new Peer(undefined,{
    host: '/',
    port: '3001'
})

const videoGrid = document.getElementById('video-grid')
const video = document.createElement('video')
video.muted = true

let peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream=>{
    addVideoStream(video,stream)

    peer.on('call',call=>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream',userStream=>{
            addVideoStream(video,userStream)
        })
    })

    socket.on('user-connected',userId=>{
        connectToNewUser(userId,stream)
    })
})

socket.on('user-disconnected',userId=>{
    if(peers[userId]){
        peers[userId].close()
    }
})

peer.on('open',id=>{
    socket.emit('join-room',ROOMID,id)
})


function connectToNewUser(userId,stream){
    const call = peer.call(userId,stream)
    const video = document.createElement('video')
    call.on('stream',userStream=>{
        addVideoStream(video,userStream)
    })
    call.on('close',()=>{
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video,stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video)
}