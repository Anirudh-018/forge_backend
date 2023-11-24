import firebase_admin
from firebase_admin import credentials, storage
from io import BytesIO
import os
from flask import Flask, send_file,request
from transformers import pipeline
import requests
from PIL import Image
from io import BytesIO
import torch
from diffusers import StableDiffusionImg2ImgPipeline
app = Flask(__name__)

# Initialize model on CPU
device = "cuda"  # Change to "cuda" if GPU available
model_id_or_path = "runwayml/stable-diffusion-v1-5"
pipe = StableDiffusionImg2ImgPipeline.from_pretrained(model_id_or_path, torch_dtype=torch.float16)
pipe = pipe.to(device)
print('hello')
cred = credentials.Certificate('src/forge-backend-8b8e6-firebase-adminsdk-t1wlt-44eb6b3dee.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'forge-backend-8b8e6.appspot.com'
})
bucket = storage.bucket()

def upload_to_firebase(local_file_path, destination_blob_name):
    try:
        # Upload file to Firebase Storage
        blob = bucket.blob(destination_blob_name)
        blob.upload_from_filename(local_file_path)

        print(f"File {local_file_path} uploaded to Firebase Storage as {destination_blob_name}")

    except Exception as e:
        print(f"Error: {e}")
@app.route('/')
def hello():
    return 'Hello, Flask!'
@app.route('/generate_images', methods=['POST'])
def generate_images():
    try:
        req=request.json
        userId=req['userId']
        if req['image']:
            url=req['image']
        response = requests.get(url)
        init_image = Image.open(BytesIO(response.content)).convert("RGB")
        init_image = init_image.resize((768, 512))

        # prompt = "Breathtaking fantasy landscape depicting a mystical setting with a majestic white dragon soaring gracefully in the background. The scene is rendered in exquisite detail, showcasing vibrant colors, stunning lighting, and fantastical elements. The artwork evokes a sense of wonder and awe, creating a truly immersive experience. This masterpiece digital painting is created by a talented artist like Craig Mullins and Peter Mohrbacher, known for their incredible skills in capturing the essence of fantasy worlds. The resolution of this artwork is set at a stunning 4k, ensuring every minute detail is brought to life"
        prompt=req['prompt']
        if not os.path.exists(f'{userId}'):
            os.makedirs(f'{userId}')
        for i in range(5):
            images = pipe(prompt=prompt, image=init_image, strength=0.75, guidance_scale=7.5).images
            images[0].save(f"{userId}/generated_image_{i}.png")
            upload_to_firebase(f"{userId}/generated_image_{i}.png",f"images/{userId}/generatedImages/generated_image{i}.png");
        return "images uploaded"
    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)