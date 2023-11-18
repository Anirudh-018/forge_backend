from flask import Flask, request, send_file
import firebase_admin
from firebase_admin import credentials, storage
from io import BytesIO
import requests
import jsonify
import os
app = Flask(__name__)

# Initialize Firebase (replace 'path/to/serviceAccountKey.json' with your credentials file)
cred = credentials.Certificate('src/forge-backend-8b8e6-firebase-adminsdk-t1wlt-44eb6b3dee.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'gs://forge-backend-8b8e6.appspot.com'
})
bucket = storage.bucket()

# Endpoint for getting an image from Firebase Storage and returning it
@app.route('/get_image', methods=['POST'])
def get_image_from_url():
    try:
        data = request.get_json()
        image_url = data.get('url')

        # Fetch the image from the provided URL
        response = requests.get(image_url)

        if response.status_code != 200:
            return 'Failed to fetch image from provided URL', 400

        # Convert the image data to a bytes buffer
        image_data = BytesIO(response.content)
        image_data.seek(0)

        # Return the image data as a response
        return send_file(image_data, mimetype='image/jpeg')

    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True)
