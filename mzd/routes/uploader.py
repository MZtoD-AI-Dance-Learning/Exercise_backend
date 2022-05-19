from fastapi import APIRouter, Depends, Request, Form , Header
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.responses import RedirectResponse
from pathlib import Path
from fastapi.staticfiles import StaticFiles
import mzd.boto3.file_control as File_control
import mzd.model.flash_make as Flash_make
from mzd.routes.auth import get_current_user, login_required

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory=BASE_DIR /"templates")
router.mount("/static", StaticFiles(directory="mzd/static"), name="static") 
templates.env.globals['get_flashed_messages'] = Flash_make.get_flashed_messages


@router.get("/file_upload", response_class=HTMLResponse)
@login_required
def file_uploader(request: Request, ):
   context = {'request': request, "username": get_current_user(request)}
   return templates.TemplateResponse("file_uploadPage.html", context)

@router.post("/file_upload")
def upload(request: Request, filename: str = Form(...)):
   context = {'request': request,}
   File_control.upload_dance(filename)
   Flash_make.flash(request, "춤 영상 업로드 성공!", "success")
   return RedirectResponse(url="/file_upload", status_code=302)

@router.get("/upload_file")
def file_uploader(request: Request, ):
   hi = "안녕하세요"
   return hi