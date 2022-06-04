from fastapi import APIRouter, Request, Depends, status, Form, HTTPException
from fastapi.templating import Jinja2Templates
from requests import request
from starlette.responses import RedirectResponse, HTMLResponse
from pathlib import Path
from fastapi.staticfiles import StaticFiles
import mzd.model.flash_make as Flash_make
from pymongo import MongoClient
from mzd.config import MONGO_DB_NAME, MONGO_URL
from fastapi_login import LoginManager
from fastapi.security import OAuth2PasswordRequestForm
from mzd.settings import SECRET_KEY
import functools

router = APIRouter()

# mongodb 불러오기
client = MongoClient(MONGO_URL)
db = client[MONGO_DB_NAME]

# directory 환경설정
BASE_DIR = Path(__file__).resolve().parent.parent
templates = Jinja2Templates(directory= str(BASE_DIR /"templates"))
router.mount("/static", StaticFiles(directory="mzd/static"), name="static") 
templates.env.globals['get_flashed_messages'] = Flash_make.get_flashed_messages

class NotAuthenticatedException(Exception):
    pass

# LoginManager 생성
auth_manager = LoginManager(
    SECRET_KEY,
    token_url="/auth/login",
    use_cookie=True,
    custom_exception=NotAuthenticatedException, 
)

auth_manager.auto_error = False


def redirect_login(request: Request, exc: NotAuthenticatedException):
    path = request.url.components.path
    return RedirectResponse(url=f"/login?next={path}")

auth_exception = (NotAuthenticatedException, redirect_login)

# Login Action
@auth_manager.user_loader()  # type:ignore[operator]
async def load_user(username: str) -> str or None:
    try:
        user = db.user_auth.find_one({'username': username})['username']
        password = db.user_auth.find_one({'username': username})['password']
        return user, password
    except Exception:
        return None

# 현재 유저 불러오기
def get_current_user(request: Request):
    try:
        current_user = request.cookies.get("access_token")
        return current_user
    except Exception:
        return None

# 계정 로그인이 되어야만 작동하게하는 오퍼레이터 생성
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(request: Request, **kwargs):
        if get_current_user(request) == None:
            return RedirectResponse(url='/login', status_code=status.HTTP_302_FOUND)       
        return view(request , **kwargs)
    return wrapped_view

@router.get("/login")
async def login(request: Request):
    bad_login = request.cookies.get("bad_login")
    response = templates.TemplateResponse(
        "auth/signin.html",
        {"request": request, "bad_login": bad_login},
    )
    response.delete_cookie(key="bad_login")
    return response

@router.post("/auth/login")
async def auth_login(data: OAuth2PasswordRequestForm = Depends()):
    username = data.username
    password = data.password
    user = await load_user(username)
    
    if not user or password != user[1]:
        response = RedirectResponse(url="/login", status_code=status.HTTP_302_FOUND)
        response.set_cookie("bad_login", True)
        return response

    # access_token = auth_manager.create_access_token(data=dict(sub=username))
    # url = request.query_params.get("next", "/main")
    response = RedirectResponse(url='/main', status_code=status.HTTP_302_FOUND)
    response.set_cookie("access_token", username) # user login시 cookie 생성
    return response

# Logout Action
@router.get("/logout")
async def logout(request: Request):
    response = templates.TemplateResponse(
        "auth/logout.html", {"request": request, }
    )
    response.delete_cookie(key="access_token") # 쿠키 삭제
    return response

# Signup Action
@router.get("/signup", response_class=HTMLResponse)
async def signup(request: Request):
   context = {'request': request, }          
   return templates.TemplateResponse("auth/signup_mztod.html", context)

@router.post("/signup")
async def signup(username: str = Form(...), password: str = Form(...), name: str = Form(...), gender: str = Form(...), age: int = Form(...)):
   db.user_auth.insert_one({"username" : username, "password" : password,  "name" : name, "gender" : gender, "age" : age} ) 
   resp = RedirectResponse(url="/main", status_code=302)
   return resp