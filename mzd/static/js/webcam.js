//출처: https://medium.com/watcha/%EC%9B%B9%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%97%90%EC%84%9C-%EB%8F%99%EC%9E%91%ED%95%98%EB%8A%94-%EB%85%B9%ED%99%94%EC%95%B1-%EB%A7%8C%EB%93%A4%EA%B8%B0-70142ce28994


const videoOutput = document.getElementById('video-output');
const startBtn = document.getElementById('start-btn');
const pauseBtn= document.getElementById('pause-btn');
const finishBtn = document.getElementById('finish-btn');
const downloadBtn = document.getElementById('download-btn');
const recordedVideo = document.getElementById('recorded-video');
const s3_upload= document.getElementById('s3_upload');




let mediaStream = null;
let mediaRecorder = null;
let recordedMediaURL =null;

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

  // 3. 녹화 중지 이벤트 핸들러 등록
pauseBtn.addEventListener('click', function () {
  mediaRecorder.pause();
});

mediaRecorder.onstop = function () {
  // createObjectURL로 생성한 url을 사용하지 않으면 revokeObjectURL 함수로 지워줘야합니다.
  // 그렇지 않으면 메모리 누수 문제가 발생합니다.
  if (recordedMediaURL) {
    URL.revokeObjectURL(recordedMediaURL);
  }

  const blob = new Blob(recordedChunks, { type: 'video/mp4;' });
  recordedMediaURL = URL.createObjectURL(blob);
  recordedVideo.src = recordedMediaURL;
  };
  mediaRecorder.start();
});


// 녹화 종료 버튼 클릭 시 빌생하는 이벤트 핸들러 등록
finishBtn.addEventListener('click', function () {
  if (mediaRecorder) {
    // 5. 녹화 중지
    mediaRecorder.stop();
    alert("녹화 종료")
  }
});

// 다운로드 버튼 클릭 시 발생하는 이벤트 핸들러 등록
downloadBtn.addEventListener('click', function () {
  console.log('recordedMediaURL : ', recordedMediaURL);
  if (recordedMediaURL) {
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = recordedMediaURL;
    link.download = filenameInput.value;
    link.click();
    document.body.removeChild(link);
  }
});

/*s3_upload.addEventListener('click', function () {
  var bucket = new AWS.S3({ params: { Bucket: 'mztod' } });
  var params = {
      Key: "video.mp4",
      ContentType: "video/mp4",
      Body: recordedMediaURL,
      ACL: 'public-read' // 접근 권한
  };
  bucket.putObject(params, function (err, data) {
      // 업로드 성공
  });

  bucket.putObject(params).on('httpUploadProgress',
  function (evt) {
  console.log("Uploaded :: " + parseInt((evt.loaded * 100) / evt.total) + '%');
  }).send(function (err, data) {
  alert("File uploaded successfully.");
  });
  return false;
});
*/

// input값 로컬스토리지 저장
// querySelector는 id를 찾는지, class를 찾는지 분명히 해줘야 함 ex) id는 앞에 #붙임. 
const filenameForm= document.querySelector("#filename-form");

//document가 아닌 바로 변수를 통해서 form을 찾을 수 있음. 
const filenameInput= document.querySelector("#filename-form input");

function filenameSubmit(event){
  event.preventDefault(); //submit 시 페이지 새로고침을 방지
  console.dir(filenameInput.value);
}


filenameForm.addEventListener("submit",filenameSubmit)
