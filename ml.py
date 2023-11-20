# import requests
# import torch
# from PIL import Image
# from io import BytesIO

# from diffusers import StableDiffusionImg2ImgPipeline

# model_id_or_path = "runwayml/stable-diffusion-v1-5"
# pipe = StableDiffusionImg2ImgPipeline.from_pretrained(model_id_or_path, torch_dtype=torch.float16)

# url = "https://raw.githubusercontent.com/CompVis/stable-diffusion/main/assets/stable-samples/img2img/sketch-mountains-input.jpg"

# response = requests.get(url)
# init_image = Image.open(BytesIO(response.content)).convert("RGB")
# init_image = init_image.resize((768, 512))

# prompt = "Breathtaking fantasy landscape depicting a mystical setting with a majestic white dragon soaring gracefully in the background. The scene is rendered in exquisite detail, showcasing vibrant colors, stunning lighting, and fantastical elements. The artwork evokes a sense of wonder and awe, creating a truly immersive experience. This masterpiece digital painting is created by a talented artist like Craig Mullins and Peter Mohrbacher, known for their incredible skills in capturing the essence of fantasy worlds. The resolution of this artwork is set at a stunning 4k, ensuring every minute detail is brought to life"
# for i in range(5):
#     images = pipe(prompt=prompt, image=init_image, strength=0.75, guidance_scale=7.5).images
#     images[0].save("fa"+str(i)+"jpg")
import os

def create_directory_if_not_exists(directory_path):
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)

# Example usage
user_id = 'ani'
directory_path = f'{user_id}'  # Replace with your desired directory path
create_directory_if_not_exists(directory_path)