import React, { useState } from 'react';
import axios from 'axios';

const VideoUpload = ({ onUpload }) => {
    const [file, setFile] = useState(null);
    const [location, setLocation] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('location', location);

        try {
            await axios.post('http://127.0.0.1:5000/upload', formData);
            onUpload(); // Call the onUpload function to refresh the dashboard
        } catch (error) {
            console.error('Error uploading video:', error);
        }
    };

    return (
        <div>
            <h1>Upload Video</h1>
            <input type="file" accept="video/*" onChange={handleFileChange} />
            <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={handleLocationChange}
            />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default VideoUpload;