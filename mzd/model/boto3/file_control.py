import boto3
from pathlib import Path
import sys, os
import glob

# 상위 폴더 import 해오기 위함
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from mzd import config

BASE_DIR = Path(__file__).resolve().parent

print(BASE_DIR)
# s3 connection 함수
def s3_connection():
    try:
        s3 = boto3.client(  
                service_name="s3",
                region_name="ap-northeast-2", # 자신이 설정한 bucket region
                aws_access_key_id= config.aws_access_key_id,
                aws_secret_access_key= config.aws_secret_access_key,
            )
    except Exception as e:
        print(e)
    else:
        print("s3 bucket connected!")
        return s3
    
# 업로드
    
def upload_dance(data):
    client = s3_connection()
    
    # 업로드할 파일 설정 
    format = '*{0}.mp4'
    file_filter = format.format(data)
    input_path = str(BASE_DIR) + "\\upload"
    files = glob.glob(os.path.join(input_path,file_filter))
    stored_names =  list(map(lambda x: x.split("\\")[10], files))
    bucket = "mztod"
    
    # 해당 파일들 업로드
    for file, name in zip(files, stored_names):
        client.upload_file(file, bucket, name, ExtraArgs={'ACL': 'public-read'})
# 다운로드 (이 기능은 user는 사용x)

def download_dance():
    # 다운로드할 디렉토리 위치 변경 (상대 경로)
    os.chdir(os.getcwd()+ "\\mzd\\boto3")
    client = s3_connection()
    file_name = 'download/kpop_short1.mp4'
    bucket = 'mztod'
    key = 'kpop_short1.mp4'
    client.download_file(bucket, key, file_name)
    
