//출처: https://snupi.tistory.com/170?category=907277 [SNUPI]


// 1. 카메라로부터 입력받기
const videoTag = document.querySelector(".user-video");
let videoMediaStream = null;

navigator.mediaDevices
.getUserMedia({ // constraints
audio: false,
video: {
width: 360,
height: 240,
},})
.then(function (mediaStream)) {
videoTag.srcObject = mediaStream;
videoTag.onloadedmetadata = function() {
videoTag.play();
};
videoMediaStream = mediaStream;
};




/*2. 녹화하여 저장하기
1) MediaStream의 매개변수로 MediaRecorder 생성자를 호출합니다.

2) MediaRecorder.ondataavailable 이벤트가 호출될 때마다 전달받는 영상 데이터를 배열에 쌓도록 핸들러를 작성하여 등록합니다.


3) 녹화를 중지하면 MediaRecorder.onstop 이벤트가 호출됩니다.

이벤트가 호출되었을 때 2번 과정에서 모인 영상 데이터로 Blob을 생성하는 핸들러를 onstop 이벤트에 등록합니다.
evokeObjectURL메소드를 호출하여 생성된 url이 참조하는 object가 할당된 메모리를 해제해야 합니다.

4) MediaRecorder.start() 를 호출하여 녹화 시작


5) 녹화 중지 버튼을 누르면 MediaRecorder.stop()을 호출 -> 녹화 중지하여 MediaRecorder.onstop 이벤트 호출

*/
let videoRecorder = null;
let recordedVideoURL = null;
let videoBlob = null;
const VideoCaptureStart = () => {
if(navigator.mediaDevices.getUserMedia) {
console.log("video capture start");
let videoData = [];
// 1) MediaStream을 매개변수로 MediaRecorder 생성자를 호출
// webm만?????
videoRecorder = new MediaRecorder(videoMediaStream, {
mimeType: "video/webm; codecs=vp9"
});
// 2) 전달받는 데이터를 처리하는 이벤트 핸들러 등록
videoRecorder.ondataavailable = event => {
if(event.data?.size > 0){
videoData.push(event.data);
}
}
// 3) 녹화 중지 이벤트 핸들러 등록
videoRecorder.onstop = () => {
videoBlob = new Blob(videoData, {type: "video/webm"});
recordedVideoURL = window.URL.createObjectURL(videoBlob);
// 이벤트 실행 시에 서버로 파일 POST
sendAvi(videoBlob);
console.log("video capture end");
}

// 4) 녹화 시작
videoRecorder.start();
}
};

const VideoCaptureEnd = () => {
    if(videoRecorder){

// 5) 녹화 중지     
videoRecorder.stop();
videoRecorder = null;    
   
// our final videoBlob                           
// sendAvi(videoBlob);
// -> 이벤트의 비동기로 인해 순서가 꼬이므로 이벤트 발생 시에 선언한다
}
};
 
const sendAvi = blob => {
    if (blob == null) return;
    let filename = new Date().toString() + ".avi";
    const file = new File([blob], filename);
    let fd = new FormData();
    fd.append("fname", filename);
    fd.append("file", file);
    $.ajax({
    url: "~~~url~~~",
    type: "POST",
    contentType: false,
    processData: false,
    data: fd,
    success: function (data, textStatus) {
    if (data != null) {
    setUserResponse(data);
    send(data);
    }
    },
    error: function (errorMessage) {
    setUserResponse("");
    console.log("Error" + errorMessage);
    },
    }).done(function (data) {
    console.log(data);
    });
    }
    
