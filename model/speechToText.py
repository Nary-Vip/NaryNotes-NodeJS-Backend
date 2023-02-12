from IPython.display import Audio
from scipy.io import wavfile
import numpy as np
import soundfile as sf
import librosa
import sys
import torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2Tokenizer

file_name = 'E:/Projects/Personal Project/NaryNotes/narynotes-backend/model/assets/recorder.wav'

data=wavfile.read(file_name)
framerate=data[0]
sounddata=data[1]
time=np.arange(0,len(sounddata))/framerate

tokenizer= Wav2Vec2Tokenizer.from_pretrained("facebook/wav2vec2-base-960h")
model= Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")

input_audio,_ = librosa.load(file_name,sr=16000)

input_values = tokenizer(input_audio,return_tensors="pt").input_values
logits = model(input_values).logits
predicted_ids = torch.argmax(logits,dim=-1)
text = tokenizer.batch_decode(predicted_ids)[0]

print(text)
print(len(sounddata)/framerate)