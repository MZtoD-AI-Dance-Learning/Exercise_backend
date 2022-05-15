from odmantic import Model

class UserModel(Model):
    username: str
    password: str
    age:int
    gender:str
    name:str

    class Config:
        collection = "user_auth"