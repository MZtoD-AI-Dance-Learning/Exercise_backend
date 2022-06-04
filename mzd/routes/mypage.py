from fastapi import APIRouter, Request, Depends, Form
from pymongo import MongoClient
from pathlib import Path
from fastapi.templating import Jinja2Templates
from mzd.config import MONGO_DB_NAME, MONGO_URL
from fastapi.staticfiles import StaticFiles
import mzd.model.flash_make as Flash_make
from mzd.routes.auth import get_current_user, login_required
from fastapi.responses import HTMLResponse


router = APIRouter()

# mongodb 불러오기
client = MongoClient(MONGO_URL)
db = client[MONGO_DB_NAME]

BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory= str(BASE_DIR /"templates"))
router.mount("/static", StaticFiles(directory="mzd/static"), name="static") 
templates.env.globals['get_flashed_messages'] = Flash_make.get_flashed_messages

@router.get("/mypage/{username}", response_class=HTMLResponse)
@login_required
def mypage(request: Request, username: str):
    username = get_current_user(request)
    name = db.user_auth.find_one({'username': username})['name']
    cover_link = db.user_cover.find({"username": username }, {"_id": False,"cover_url": True, "thubnail_image": True, "covername": True } )
    context = {'request': request, "username": username, "name": name, 'cover_link': cover_link, "length": cover_link.count()}
    return templates.TemplateResponse("auth/mypage.html", context)