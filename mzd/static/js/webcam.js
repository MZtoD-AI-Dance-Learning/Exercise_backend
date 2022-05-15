const videoOutput = document.getElementById('video-output');
const startBtn = document.getElementById('start-btn');
const downloadBtn = document.getElementById('download-btn');
const finishBtn = document.getElementById('finish-btn');
const recordedVideo = document.getElementById('recorded-video');

let mediaStream = null;
let mediaRecorder = null;
let recordedMediaURL = null;
let filename= document.getElementById('filename')

// 유저의 카메라로 부터 입력을 사용할 수 있도록 요청
navigator.mediaDevices
.getUserMedia({ video: true })
.then(function (newMediaStream) {
    mediaStream = newMediaStream;

    // 카메라의 입력을 실시간으로 비디오 태그에서 확인
    videoOutput.srcObject = mediaStream;
    videoOutput.onloadedmetadata = function (e) {
    videoOutput.play();
    };
});

// 녹화 시작 버튼 클릭 시 빌생하는 이벤트 핸들러 등록
startBtn.addEventListener('click', function () {
let recordedChunks = [];
// 1.MediaStream을 매개변수로 MediaRecorder 생성자를 호출
mediaRecorder = new MediaRecorder(mediaStream, {
    mimeType: 'video/webm;',
});

// 2. 전달받는 데이터를 처리하는 이벤트 핸들러 등록
mediaRecorder.ondataavailable = function (event) {
    if (event.data && event.data.size > 0) {
    console.log('ondataavailable');
    recordedChunks.push(event.data);
    }
};

// Blob을 매개변수로,avi 확장자로 POST하는 sendAvi 함수 생성

function sendAvi(blob) {
    if (blob == null) return;
    let filename = new Date().toString() + ".avi";
    const file = new File([blob], filename);
    let fd = new FormData();
    fd.append("fname", filename);
    fd.append("file", file);
    $.ajax({
    url: "https://fa2cvjonaa.execute-api.ap-northeast-2.amazonaws.com/",
    type: "POST",
    contentType: false,
    key: key,
    AWSAccessKeyId:"AKIA4Y43KNAXD5IMOPNF",
    acl: "public-read",
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


// 3. 녹화 중지 이벤트 핸들러 등록
mediaRecorder.onstop = function () {
    // createObjectURL로 생성한 url을 사용하지 않으면 revokeObjectURL 함수로 지워줘야합니다.
    // 그렇지 않으면 메모리 누수 문제가 발생합니다.
    if (recordedMediaURL) {
    URL.revokeObjectURL(recordedMediaURL);
    }

    const blob = new Blob(recordedChunks, { type: 'video/webm;' });
    recordedMediaURL = URL.createObjectURL(blob);
    recordedVideo.src = recordedMediaURL;
 // 이벤트 실행 시에 서버로 파일 POST
    sendAvi(blob);
    console.log("video capture end");
};

mediaRecorder.start();
});





// 녹화 종료 버튼 클릭 시 빌생하는 이벤트 핸들러 등록
finishBtn.addEventListener('click', function () {
if (mediaRecorder) {
    // 5. 녹화 중지
    mediaRecorder.stop();
    
}
});

// 다운로드 버튼 클릭 시 발생하는 이벤트 핸들러 등록
downloadBtn.addEventListener('click', function () {
console.log('recordedMediaURL : ', recordedMediaURL);
if (recordedMediaURL) {
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = recordedMediaURL;
    link.download = 'video/.mp4';
    link.click();
    document.body.removeChild(link);
}
});



