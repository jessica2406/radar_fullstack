import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VideoUpload = () => {
    const [file, setFile] = useState(null);
    const [location, setLocation] = useState('');
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState('No file chosen');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile ? selectedFile.name : 'No file chosen');
    };

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a video file first');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('location', location);

        try {
            await axios.post('http://127.0.0.1:5000/upload', formData);
            navigate('/');
        } catch (error) {
            console.error('Error uploading video:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Upload Video</h1>
                
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">Image File</label>
                    <div className="flex items-center">
                        <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-l-md hover:bg-blue-700 cursor-pointer">
                            <span>Choose File</span>
                            <input 
                                type="file" 
                                // accept="video/*" 
                                onChange={handleFileChange} 
                                className="hidden" 
                            />
                        </label>
                        <div className="flex-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded-r-md truncate">
                            {fileName}
                        </div>
                    </div>
                </div>
                
                <div className="mb-6">
                    <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-700">
                        Location
                    </label>
                    <input
                        id="location"
                        type="text"
                        placeholder="Enter filming location"
                        value={location}
                        onChange={handleLocationChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                
                <button 
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                    {uploading ? 'Uploading...' : 'Upload Video'}
                </button>
            </div>
        </div>
    );
};

export default VideoUpload;