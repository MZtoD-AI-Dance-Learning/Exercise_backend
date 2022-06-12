//출처: https://medium.com/watcha/%EC%9B%B9%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80%EC%97%90%EC%84%9C-%EB%8F%99%EC%9E%91%ED%95%98%EB%8A%94-%EB%85%B9%ED%99%94%EC%95%B1-%EB%A7%8C%EB%93%A4%EA%B8%B0-70142ce28994
/*//////////////////////////////////////////////////////////////////////
Webcam
*///////////////////////////////////////////////////////////////////////

const videoOutput = document.getElementById('video-output');
const startBtn = document.getElementById('start-btn');
const pauseBtn= document.getElementById('pause-btn');
const finishBtn = document.getElementById('finish-btn');
const downloadBtn = document.getElementById('download-btn');

let mediaStream = null;
let mediaRecorder = null;
let recordedMediaURL =null;


// querySelector는 id를 찾는지, class를 찾는지 분명히 해줘야 함 ex) id는 앞에 #붙임. 

const filenameForm= document.querySelector("#filename-form");
const filenameInput= document.querySelector("#filename-form input");

const fileUpload= document.querySelector("#fileupload-form");
const fileUploadInput= document.querySelector("#fileupload-form input");

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


  
// 5초 후 시작 하는 리스트 및 함수printThree()
const threeList= ["5초 후 녹화를 시작합니다!",4,3,2,1,"Start!",""]
let num=0;
let second=null;

function printThree(){
  if(threeList.length>num){
    second= threeList[num++];
    document.querySelector("#threelist").innerText=second;
}
};

let timeSec=null;
let recordUrl=null;
// 녹화 시작 버튼 클릭 시 빌생하는 이벤트 핸들러 등록
startBtn.addEventListener('click', function () {
  printThree();
  timeSec= setInterval(printThree,1000);

  let recordedChunks = [];
  // 1.MediaStream을 매개변수로 MediaRecorder 생성자를 호출
  // 이거는 웹캠 화면을 호출

  mediaRecorder = new MediaRecorder(mediaStream, {
    mimeType: 'video/webm ; codecs="opus" '});
  

  // 2. 전달받는 데이터를 처리하는 이벤트 핸들러 등록
  //여기서부터 사실상 
  mediaRecorder.ondataavailable = function (event) {
    if (event.data && event.data.size > 0) {
      console.log('ondataavailable');
      recordedChunks.push(event.data);
    }
  }

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
  videoOutput.srcObject=null; // 기존의 웹캠 송출객체를 없앰
  videoOutput.src = recordedMediaURL;//  저장되는 bloburl을 videoOutput element src에 저장

  };

  setTimeout(function(){
  mediaRecorder.start();
  },6000);

});
// 녹화 종료 버튼 클릭 시 빌생하는 이벤트 핸들러 등록
finishBtn.addEventListener('click', function () {
  if (mediaRecorder) {
    // 5. 녹화 중지
    mediaRecorder.stop();
    alert("녹화 종료. 다시 녹화를 하려면 Reset 해주세요.")
    //녹화 save버튼 누르면 웹캠 비디오 화면 사라진다.
    videoOutput.load();
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



/*//////////////////////////////////////////////////////////////////////
Scorlist 정의
*///////////////////////////////////////////////////////////////////////


let scoreList= []; //스코어링 점수 배열
let scorelistMale0=[];
let scorelistFemale0=[];

const scoreMaleMean=64;

let scorelistMale=[79, 83, 81, 83, 82, 82, 80, 80, 80, 80, 80, 79, 80, 80, 80, 82, 83, 82, 80, 78, 74, 72, 72, 74, 74, 74, 74, 74, 72, 71, 71, 72, 71, 72, 73, 72, 73, 75, 78, 81, 84, 76, 70, 64, 58, 55, 51, 50, 49, 48, 49, 48, 47, 46, 46, 47, 46, 47, 47, 48, 47, 49, 48, 47, 47, 48, 46, 46, 44, 43, 44, 42, 39, 39, 38, 
  39, 39, 39, 40, 39, 39, 39, 41, 41, 43, 44, 45, 46, 46, 47, 46, 46, 46, 49, 50, 50, 50, 53, 53, 54, 54, 55, 55, 56, 56, 58, 60, 60, 57, 58, 57, 58, 55, 58, 56, 56, 59, 60, 60, 60, 62, 61, 62, 62, 66, 64, 69, 69, 71, 74, 73, 73, 69, 69, 68, 69, 72, 72, 72, 73, 74, 73, 73, 73, 74, 73, 74, 73, 72, 75, 72, 74, 73, 74, 75,
   75, 73, 74, 71, 72, 73, 72, 71, 72, 73, 76, 76, 77, 75, 75, 75, 75, 73, 73, 74, 75, 76, 74, 74, 74, 74, 74, 75, 76, 75, 76, 78];

for (k=0; k<187; k+=23) {
  scorelistMale0.push(scorelistMale[k])
}
console.log(scorelistMale0);
const scoreFemaleMean=82;

const scorelistFemale=[76, 71, 73, 70, 71, 72, 72, 72, 73, 72, 73, 73, 73, 73, 73, 73, 72, 73, 74, 74, 74, 75, 79, 79, 80, 81, 80, 80, 80, 80, 80, 81, 82, 83, 83, 83, 83, 84, 86, 86, 86, 77, 73, 70, 71, 69, 75, 81, 89, 91, 93, 93, 93, 94, 94, 93, 92, 91, 90, 90, 91, 90, 89, 89, 88, 87, 88, 88, 86, 87, 86, 87, 87, 86, 86, 86, 87, 86, 85, 85, 84, 84, 84, 84, 84, 83, 83, 83, 84, 85, 83, 80, 78, 74, 78, 79, 83, 87, 90, 90, 92, 91, 91, 91, 91, 92, 91, 91, 91, 89, 90, 89, 90, 87, 89, 89, 86, 86, 86, 86, 84, 87, 86, 86, 83, 77, 80, 78, 78, 77, 77, 79, 78, 78, 78, 80, 79, 80, 80, 81, 81, 82, 81, 82, 83, 83, 83, 83, 84, 79, 81, 78, 80, 78, 78, 77, 78, 79, 82, 81, 82, 80, 78, 78, 78, 81, 80, 79, 77, 77, 77, 76, 76, 77, 76, 74, 74, 75, 75, 74, 75, 75, 73, 75, 78, 80, 82, 82, 82, 80, 80, 76];

for (k=0; k<192; k+=23) {
  scorelistFemale0.push(scorelistFemale[k])
}
console.log(scorelistFemale0);

/*//////////////////////////////////////////////////////////////////////
Scoring 함수 정의
*///////////////////////////////////////////////////////////////////////

//영상 정하기

const scoreStart= document.querySelector("#scoreStart")
const scoreEnd= document.querySelector("#scoreEnd")

let scoreVideo= document.querySelector("#scorevideo0")
let source= document.createElement("source")

const scoreLinkMale0= "https://mztod.s3.ap-northeast-2.amazonaws.com/AlphaPose_user2_LoveDive_0.mp4"
const scoreLinkFemale0= "https://mztod.s3.ap-northeast-2.amazonaws.com/AlphaPose_user_LoveDive_0.mp4"

// https://offbyone.tistory.com/241 참고함.

//score 위치에 score 표시

function defineScoreVideo(){
  if(fileUploadInput.value==="C:\\fakepath\\user2_LoveDive_0.mp4"){
    //scorelist에 재건 춤 score 저장
    scoreList=scorelistMale0;
    source.setAttribute('src',"https://mztod.s3.ap-northeast-2.amazonaws.com/AlphaPose_user2_LoveDive_0.mp4")
    source.setAttribute('type','video/mp4');
    scoreVideo.appendChild(source);
  }
  // upload한 영상이 전문 댄서 영상이면)
  if(fileUploadInput.value==="C:\\fakepath\\user_LoveDive_0.mp4"){
    //scorelist에 전문 댄서 춤 score 저장
    scoreList=scorelistFemale0;
    source.setAttribute('src',"https://mztod.s3.ap-northeast-2.amazonaws.com/AlphaPose_user_LoveDive_0.mp4")
    source.setAttribute('type','video/mp4');
    scoreVideo.appendChild(source);
};
};

//document가 아닌 바로 변수를 통해서 form을 찾을 수 있음. 
function fileuploadSubmit(event){
    event.preventDefault();//submit 시 페이지 새로고침을 방지
    console.dir(fileUploadInput.value);
    }





let index=0;
let score= null;
function printScore(){
    defineScoreVideo();
    if(scoreList.length>index){
    score= scoreList[index++];
    document.querySelector("#scoreList").innerText=score;
  }
}

let timer= null;
//scoreprint 함수를 timer 간격으로 실행
scoreStart.addEventListener("click",function(){
  printScore();
  timer=setInterval(printScore,800);
});


//스코어링을 중지
scoreEnd.addEventListener("click",function(){
    if(timer!=null){
        clearInterval(timer)
    }
});


/*//////////////////////////////////////////////////////////////////////
video logic
*///////////////////////////////////////////////////////////////////////

//출처: https://www.phpschool.com/gnuboard4/bbs/board.php?bo_table=qna_html&wr_id=292171

var r=1;


if(window.addEventListener){
  window.addEventListener('load', function(){
      if(window.HTMLVideoElement){
          var player = document.getElementById('player');
          player.addEventListener("click", function(){
              alert("이제 따라하면서 학습해보세요")
              // 동영상 재생이 끝나면 실행될 코드\
              if (r<4){
                  r=r+1;
                  if(player.canPlayType("video/mp4")){
                    //레이블 영상0 재생
                      player.src = "https://mztod.s3.ap-northeast-2.amazonaws.com/practice_LoveDive_0.mp4";

                }
            }
        });
      }
  }, false);
}

//스코어링 영상 재생
//스코어링 영상 주소 변수 생성
fileUpload.addEventListener("submit",fileuploadSubmit);
if(window.addEventListener){
  window.addEventListener('load', function(){
      if(window.HTMLVideoElement){
          var player = document.getElementById('scorevideo0');
          player.addEventListener("ended", function(){
            if(fileUploadInput.value==="C:\\fakepath\\user2_LoveDive_0.mp4"){
              alert("당신의 평균 점수는 63점입니다. 다시 연습해 보세요!")
            }else if(fileUploadInput.value==="C:\\fakepath\\user_LoveDive_0.mp4"){
              alert("당신의 평균 점수는 81점입니다. 다음 동작으로 넘어가세요!")
            }
            })
          }});
        };

/*/////////////////////////////////////////////////////////////////
Axios 통신- estimated video, scorelist받아오기
//////////////////////////////////////////////////////////////*/
AWS.config.update({
  accessKeyId: "AKIA4Y43KNAXD5IMOPNF",
  secretAccessKey: "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"
});

AWS.config.region = 'ap-northeast-2';



