from fastapi import Request
from typing import Any
import time


# flash 메시지 만들기
def flash(request: Request, message: Any, category: str = "primary") -> None:
    if "_messages" not in request.session:
        request.session["_messages"] = []
        request.session["_messages"].append({"message": message, "category": category})    
        
def get_flashed_messages(request: Request):
   print(request.session)
   return request.session.pop("_messages") if "_messages" in request.session else []