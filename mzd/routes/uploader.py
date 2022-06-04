from fastapi import APIRouter, Depends, Request, Form , Header, UploadFile, File
from fastapi.templating import Jinja2Templates
from starlette.responses import RedirectResponse
from pathlib import Path
from fastapi.staticfiles import StaticFiles
import mzd.model.s3_upload.file_control as File_control
import mzd.model.flash_make as Flash_make
from mzd.routes.auth import get_current_user, login_required
import shutil
from time import sleep
from mzd.config import MONGO_DB_NAME, MONGO_URL
from pymongo import MongoClient
from datetime import datetime

now = datetime.now()
router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent

templates = Jinja2Templates(directory= str(BASE_DIR /"templates"))
router.mount("/static", StaticFiles(directory="mzd/static"), name="static") 
templates.env.globals['get_flashed_messages'] = Flash_make.get_flashed_messages

client = MongoClient(MONGO_URL)
db = client[MONGO_DB_NAME]

@router.post("/fileupload")
@login_required
def upload(request: Request, files: UploadFile = File(...)):
   username = get_current_user(request)
   path = str(str(BASE_DIR) + "\\model\\s3_upload\\upload" + "\\" + str(files.filename))
   
   # upload 디렉토리에 web에서 받아온 파일 복사
   with open(path, "wb") as buffer:
      shutil.copyfileobj(files.file, buffer)
   filename = str(files.filename)
   filename = filename[:-4]
   
   # MongoDB에 개인별 영상 링크 저장
   db.user_cover.insert_one({"username" : username, "covername" : "tomboy", "cover_url" : "https://mztod.s3.ap-northeast-2.amazonaws.com/"+ str(filename)+"_ffmpeg.mp4","created_date" : str(now.date()), 
                             "thubnail_image" : "https://mztod.s3.ap-northeast-2.amazonaws.com/class_thumbnail/blackMamba.png"} )
 
   sleep(2)
   
   # ffmpeg로 변환한 파일을 s3에 업로드
   File_control.upload_dance(str(filename))
   return RedirectResponse(url="/classPage0", status_code=302)



