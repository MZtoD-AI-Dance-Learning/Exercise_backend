from json.tool import main
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi_login.exceptions import InvalidCredentialsException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI, Request, Depends, Form, File, UploadFile
from mzd.model import mongodb
from pathlib import Path
from pymongo import MongoClient
from mzd.config import MONGO_URL, MONGO_DB_NAME
from fastapi.requests import Request
from mzd.routes import uploader, auth, mypage
from starlette.middleware import Middleware
from starlette.middleware.sessions import SessionMiddleware
from jinja2 import Undefined
from fastapi.middleware.cors import CORSMiddleware
from mzd.routes.auth import login_required, get_current_user
from typing import List


origin = origins = ["*"]
origins = [
    "http://0.0.0.0:80",
    "http://13.125.83.93:80",
]

JINJA2_ENVIRONMENT_OPTIONS = { 'undefined' : Undefined }

BASE_DIR = Path(__file__).resolve().parent

middleware = [Middleware(SessionMiddleware, secret_key='super-secret')]

app = FastAPI(middleware=middleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET = "secret-key"
templates = Jinja2Templates(directory=BASE_DIR /"templates")
app.mount("/static", StaticFiles(directory="mzd/static"), name="static") 

app.include_router(uploader.router)
app.include_router(auth.router)
app.include_router(mypage.router)

# mongodb 불러오기
client = MongoClient(MONGO_URL)
db = client[MONGO_DB_NAME]

@app.get("/tutorial", response_class=HTMLResponse)
async def tutorial(request: Request,):
   context = {'request': request, "username": get_current_user(request)}
   return templates.TemplateResponse("tutorial.html", context)

@app.get("/main")
async def main(request: Request,): 
   username = get_current_user(request)
   context = {"request": request, "username": username }
   return templates.TemplateResponse("main.html", context)

@app.get("/classPage0")
@login_required
def webcam(request: Request): 
   username = get_current_user(request)
   context = {"request": request, "username": username }
   return templates.TemplateResponse("ClassPage0.html", context)

@app.get("/classPage1")
@login_required
def webcam(request: Request): 
   username = get_current_user(request)
   context = {"request": request, "username": username }
   return templates.TemplateResponse("ClassPage1.html", context)

@app.on_event("startup")
def on_app_start():
    """before app starts"""
    mongodb.connect()

@app.on_event("shutdown")
def on_app_shutdown():
    """after app shutdown"""
    mongodb.close()
