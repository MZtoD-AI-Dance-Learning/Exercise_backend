from pydantic import BaseModel
from odmantic import Model

class UserModel(Model):
    username: str
    password: str

    class Config:
        collection = "user_auth"