import sys
from PIL import Image
from pytesseract import pytesseract
import requests
from io import BytesIO
  
path_to_tesseract = r"C:/Program Files/Tesseract-OCR/tesseract.exe"

response = requests.get(sys.argv[1])
img = Image.open(BytesIO(response.content))
  
pytesseract.tesseract_cmd = path_to_tesseract
  
text = pytesseract.image_to_string(img)
  
print(text[:-1])