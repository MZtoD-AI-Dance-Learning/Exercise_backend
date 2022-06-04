import boto3
from pathlib import Path
import sys, os
import glob
from mzd.model.s3_upload.ffmpegvideo.ffmconvertor import FFMConvertor

ffm = FFMConvertor()

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

    # 해당 파일들 업로드 (ffmpeg로 변환한 mp4 파일 업로드)
    for file, name in zip(files, stored_names):
        output_file = file[:-4]+"_ffmpeg.mp4"
        ffm.convert_webm_mp4_module(r''+ file,r''+ output_file)
        client.upload_file(output_file, bucket, name, ExtraArgs={'ACL': 'public-read'})
    print("유저 영상 s3 업로드 성공")
        