from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
import os
from datetime import datetime
from bson import ObjectId  # Import ObjectId from bson

app = Flask(__name__)

# Enable CORS for specific origins
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})  # Allow requests from your React app

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/Radar"  # Connect to the Radar database
mongo = PyMongo(app)

# Configure the media folder
MEDIA_FOLDER = 'media'
app.config['MEDIA_FOLDER'] = MEDIA_FOLDER

# Ensure the media folder exists
if not os.path.exists(MEDIA_FOLDER):
    os.makedirs(MEDIA_FOLDER)

# Route to serve media files
@app.route('/media/<path:filename>', methods=['GET'])
def get_media(filename):
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

    # Store video metadata in MongoDB
    video_info = {
        'filename': file.filename,
        'location': location,
        'status': 'pending',
        'severity': 'medium',  # Default severity
        'imageUrl': f'http://127.0.0.1:5000/media/{file.filename}',
    }
    
    # Insert data into the 'accidents' collection
    mongo.db.accidents.insert_one(video_info)

    return jsonify({'message': 'Video uploaded successfully!', 'video': video_info}), 201

# Route to get the list of uploaded videos
@app.route('/videos', methods=['GET'])
def get_videos():
    videos = list(mongo.db.accidents.find())  # Fetch all videos from the 'accidents' collection
    for video in videos:
        video['_id'] = str(video['_id'])  # Convert ObjectId to string for JSON serialization
    return jsonify(videos)

# Route to update the status of an accident
@app.route('/accidents/<string:accident_id>', methods=['PUT'])
def update_accident_status(accident_id):
    data = request.get_json()
    new_status = data.get('status')

    if new_status not in ['pending', 'completed']:
        return jsonify({'error': 'Invalid status'}), 400

    # Update the status in the database
    result = mongo.db.accidents.update_one(
        {'_id': ObjectId(accident_id)},  # Use ObjectId here
        {'$set': {'status': new_status}}
    )

    if result.modified_count == 0:
        return jsonify({'error': 'Accident not found or status not changed'}), 404

    return jsonify({'message': 'Accident status updated successfully!'}), 200

if __name__ == '__main__':
    app.run(debug=True)