from json.tool import main
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_login import LoginManager 
from fastapi_login.exceptions import InvalidCredentialsException
from fastapi.templating import Jinja2Templates
from fastapi import FastAPI, Request, Depends, HTTPException
from app.model.login import UserModel
from app.model import mongodb
from pathlib import Path
import asyncio
from pymongo import MongoClient
from app.config import MONGO_URL

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI()
SECRET = "secret-key"
templates = Jinja2Templates(directory=BASE_DIR / "templates")

# login manager
manager = LoginManager(SECRET, token_url="/auth/login", use_cookie=True)
manager.cookie_name = "some-name"

# mongodb 불러오기
client = MongoClient(MONGO_URL)
db = client['fastapi_njh']

@manager.user_loader
async def load_user(username: str):   
   
   username_ = db.user_auth.find_one({'username': username})['username']
   password = db.user_auth.find_one({'username': username})['password'] 
   
   return username_, password


@app.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
   username = form_data.username
   password = form_data.password
   users = await load_user(username)
   if not users:
      raise HTTPException(status_code=400, detail="Incorrect username or password")
   
   if password != users[1]:
         raise InvalidCredentialsException
      
   access_token = manager.create_access_token(
       data ={"sub": username}
   )
   resp = RedirectResponse(url="/private", status_code=302)
   manager.set_cookie(resp, access_token)
   return resp


@app.get("/private")
def getPrivateendpoint(_=Depends(manager)):
   return "You are an authentciated user"


@app.get("/public")
def getPublicendpoint():
   return "You are just a user"


@app.get("/auth/login", response_class=HTMLResponse)
def login(request: Request):
   context = {'request': request, }
   return templates.TemplateResponse("login.html", context)

@app.on_event("startup")
def on_app_start():
    """before app starts"""
    mongodb.connect()


@app.on_event("shutdown")
def on_app_shutdown():
    """after app shutdown"""
    mongodb.close()
