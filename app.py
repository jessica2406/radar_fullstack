from flask import Flask, send_from_directory, jsonify, request
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure the media folder
MEDIA_FOLDER = 'media'  # Change this to your media folder path
app.config['MEDIA_FOLDER'] = MEDIA_FOLDER

# Ensure the media folder exists
if not os.path.exists(MEDIA_FOLDER):
    os.makedirs(MEDIA_FOLDER)

# Store video metadata in memory (for simplicity)
videos = []  # List to store video metadata

# Route to serve an image
@app.route('/media/<path:filename>', methods=['GET'])
def get_image(filename):
    return send_from_directory(app.config['MEDIA_FOLDER'], filename)

# Route to upload a video
@app.route('/upload', methods=['POST'])
def upload_video():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    location = request.form.get('location')

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save the video file
    video_path = os.path.join(app.config['MEDIA_FOLDER'], file.filename)
    file.save(video_path)

    # Store video metadata
    video_info = {
        'id': str(len(videos) + 1),  # Simple ID generation
        'filename': file.filename,
        'location': location,
        'timestamp': request.form.get('timestamp', '') or 'Just Now',  # Optional timestamp
        'status': 'pending',
        'severity': 'medium',  # Default severity
        'imageUrl': f'http://127.0.0.1:5000/media/{file.filename}',  # URL to access the image
    }
    videos.append(video_info)

    return jsonify({'message': 'Video uploaded successfully!', 'video': video_info}), 201

# Route to get the list of uploaded videos
@app.route('/videos', methods=['GET'])
def get_videos():
    return jsonify(videos)

if __name__ == '__main__':
    app.run(debug=True)