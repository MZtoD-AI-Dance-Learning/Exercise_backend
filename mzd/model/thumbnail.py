# import numpy as np
# import cv2
# from pathlib import Path
# import sys, os

# BASE_DIR = Path(__file__).resolve().parent.parent
# input_path = str(BASE_DIR) + "\\boto3\\thumbnail"
# print(input_path)

# def makeStillCutImage(path, onlyMainStillCut=False):
# 	videoObj = cv2.VideoCapture('https://mztod.s3.ap-northeast-2.amazonaws.com/kpop_short1.mp4')

# 	seconds = 10
# 	fps = videoObj.get(cv2.CAP_PROP_FPS) # Gets the frames per second
# 	multiplier = fps * seconds

# 	frameCount = 0
# 	ret = 1

# 	while ret:
# 		frameId = int(round(videoObj.get(1))) #current frame number
# 		ret, frame = videoObj.read()

# 		if frameId % multiplier < 1:
# 			# cv2.resize(img, dsize, fx, fy, interpolation)
# 			resizeImage = cv2.resize(frame, (320, 320))
# 			cv2.imwrite("frame%d.jpg" % frameCount, resizeImage)
# 			frameCount += 1
			
# 		if onlyMainStillCut:
# 			break

# if __name__ == '__main__':
# 	makeStillCutImage('test.mp4')

# import cv2

# cap = cv2.VideoCapture(0)

# print('width :%d, height : %d' % (cap.get(3), cap.get(4)))

# fourcc = cv2.VideoWriter_fourcc(*'DIVX')
# out = cv2.VideoWriter('save.avi', fourcc, 25.0, (640, 480))

# while(True):
#     ret, frame = cap.read()    # Read 결과와 frame
#     if(ret) :
#         gray = cv2.cvtColor(frame,  cv2.COLOR_BGR2GRAY)    # 입력 받은 화면 Gray로 변환
#         cv2.imshow('frame_color', frame)    # 컬러 화면 출력        cv2.imshow('frame_gray', gray)    # Gray 화면 출력
#         out.write(frame)

#         if cv2.waitKey(1) == ord('q'):
#             break 
# cv2.destroyAllWindows()