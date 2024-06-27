from gtts import gTTS
import sys
import os

text = sys.argv[1]
tts = gTTS(text=text, lang='pt')
tts.save("response.mp3")
