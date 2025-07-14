import React, { useState, useEffect } from 'react';

const ImageDebugger = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    // Test các URL hình ảnh
    const testImages = [
      'http://localhost:8080/images/logo.png',
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=300&h=200&fit=crop',
      'https://via.placeholder.com/300x200/4F46E5/ffffff?text=Test'
    ];

    setImageUrls(testImages);

    // Fetch lessons từ API
    const fetchLessons = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/learners/test_user/recommended-lessons');
        const data = await response.json();
        setLessons(data);
        console.log('Lessons data:', data);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    };

    fetchLessons();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Image Debugger</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Test Images</h3>
        <div className="grid grid-cols-3 gap-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="border p-2">
              <p className="text-sm mb-2">{url}</p>
              <img 
                src={url} 
                alt={`Test ${index}`}
                className="w-full h-32 object-cover"
                onLoad={() => console.log(`Image ${index} loaded successfully`)}
                onError={() => console.error(`Image ${index} failed to load`)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Lessons from API</h3>
        <div className="grid grid-cols-2 gap-4">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="border p-2">
              <h4 className="font-medium">{lesson.title}</h4>
              <p className="text-sm text-gray-600">{lesson.thumbnailUrl}</p>
              <img 
                src={lesson.thumbnailUrl || 'https://via.placeholder.com/300x200'}
                alt={lesson.title}
                className="w-full h-24 object-cover mt-2"
                onLoad={() => console.log(`Lesson image loaded: ${lesson.title}`)}
                onError={() => console.error(`Lesson image failed: ${lesson.title}`)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageDebugger;
