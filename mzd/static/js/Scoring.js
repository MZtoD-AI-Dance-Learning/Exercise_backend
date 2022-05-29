
//min max 사이의 임의의 정수 생성하는 함수
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

// 830개의 스코어링 점수 배열 생성
let scoreList= []; //스코어링 점수 배열
let i;
for (i=0; i<830; i++) {
    scoreList.push(rand(50,90))
}



let index=0;

const scoreStart= document.querySelector("#scoreStart")
const scoreEnd= document.querySelector("#scoreEnd")
let score= null;

// https://offbyone.tistory.com/241 참고해서 짬

function printScore(){
    let score= scoreList[index++];
    document.querySelector("#scoreList").innerText=score;
}

let timer= null;

scoreStart.addEventListener("click",function(){
    printScore();
    timer=setInterval(printScore,1350);
});


scoreEnd.addEventListener("click",function(){
    if(timer!=null){
        clearInterval(timer)
    }
})

