import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios if you installed it

const ImageComponent = () => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/media/image.png'); // Adjust the URL as needed
                setImageUrl(response.request.responseURL); // Set the image URL
            } catch (error) {
                console.error('Failed to fetch image', error);
            }
        };

        fetchImage();
    }, []);

    return (
        <div>
            {imageUrl ? (
                <img src={imageUrl} alt="Fetched from Flask" />
            ) : (
                <p>Loading image...</p>
            )}
        </div>
    );
};

export default ImageComponent;