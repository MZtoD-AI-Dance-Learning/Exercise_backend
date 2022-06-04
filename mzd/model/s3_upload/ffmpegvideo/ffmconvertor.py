import subprocess
import ffmpeg
# import os
class FFMConvertor:
    
    
    # Local에서 ffmpeg 변환하는 함수
        
    def convert_webm_mp4_subprocess(self, input_file, output_file):
        try:
            # ffmpeg -i test.webm test.mp4
            command = 'ffmpeg -i ' + input_file +'-filter:v fps=fps=23.98 '+ output_file
            subprocess.run(command)
        except:
            print("Some Exception")
    
    # 폴더 위치에 반드시 ffmpeg.exe가 있어야 작동가능.
    
    def convert_webm_mp4_module(self, input_file, output_file):
        stream = ffmpeg.input(input_file)
        stream = ffmpeg.filter(stream, 'fps', fps=23.98)
        stream = ffmpeg.output(stream, output_file)
        ffmpeg.run(stream)
        print("ffmpeg 변환 완료!")
