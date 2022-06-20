const video = document.querySelector("#videoElm");
 
const loadFaceApi = async () => {
    await faceapi.nets.faceLandmark68Net.loadFromUri('./models')
    await faceapi.nets.faceRecognitionNet.loadFromUri('./models')
    await faceapi.nets.tinyFaceDetector.loadFromUri('./models')
    await faceapi.nets.faceExpressionNet.loadFromUri('./models')
}

function getCamStream () {
    if(navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream
        })
    }
} 
video.addEventListener('playing', () => {
   const canvas = faceapi.createCanvasFromMedia(video)
   document.body.append(canvas)
   const displaySize = {
    width: video.videoWidth,
    height: video.videoHeight
   }
   setInterval(async () => {
     const detects = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
     .widthFaceLanmarks()
     .widthFaceExpressions() 

     console.log("detects", detects);
     const resizedDetects = faceapi.resizeResults(detects, displaySize)
     canvas.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height)
     faceapi.draw.drawDetections(canvas, resizedDetects)
     faceapi.draw.drawFaceLanmarks(canvas, resizedDetects)
     faceapi.draw.drawExpressions(canvas, resizedDetects)
   }, 300)
})

loadFaceApi().then(getCamStream())
