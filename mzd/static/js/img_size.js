const changeHandler = () => {
    console.log(window.innerHeight);
    document.querySelector(".video > video").style.height=String(window.innerHeight)+"px";
  };
  
  window.addEventListener("resize", changeHandler);