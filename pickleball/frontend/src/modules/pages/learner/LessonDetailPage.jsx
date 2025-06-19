import React, { useState, useEffect } from 'react';
import { FaVideo, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { getLessonById, createLearnerProgress, checkLearnerProgress, updateLessonComplete } from '../../../api/learner/learningService';

const LessonDetailPage = ({ userId }) => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchedDuration, setWatchedDuration] = useState(0);
  const [player, setPlayer] = useState(null);
  const [idProgress, setIdProgress] = useState(null);
  const [learnerProgress, setLearnerProgress] = useState({
    learnerId: userId,
    lessonId: id,
    isCompleted: false,
    watchedDurationSeconds: 0,
  });
  const conplete = async () => {
    try{
      const response = await updateLessonComplete(idProgress);
      console.log(response);
    }catch(e){
      console.log(e);
    }
  }
  const fetchCreateProgress = async () => {
    console.log('Creating LearnerProgress:', learnerProgress);
    try {
      const response = await createLearnerProgress(learnerProgress);
      setIdProgress(response.id);
      console.log('Create Progress Response:', response);
    } catch (error) {
      console.error('Error creating progress:', error);
    }
  };

  useEffect(() => {
    // Tải script YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    const fetchLessonAndProgress = async () => {
      try {
        // Kiểm tra tiến độ
        const progressInput = {
          lessonId: id,
          learnerId: userId,
        };
        const progressData = await checkLearnerProgress(progressInput);
        setIdProgress(progressData.idProgress);
        if (!progressData.isExist) {
          // Cập nhật learnerProgress trước khi tạo
          setLearnerProgress((prev) => ({
            ...prev,
            learnerId: userId,
            lessonId: id,
            isCompleted: false,
            watchedDurationSeconds: 0,
          }));
          await fetchCreateProgress();
        }

        // Lấy thông tin bài học
        const lessonData = await getLessonById(id);
        setLesson(lessonData);
      } catch (error) {
        console.error('Error fetching lesson or progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonAndProgress();
  }, [id, userId]);

  const onPlayerReady = (event) => {
    setPlayer(event.target);
  };

  const onPlayerStateChange = async (event) => {
    if (event.data === window.YT.PlayerState.PLAYING && lesson) {
      const interval = setInterval(async () => {
        if (player) {
          const currentTime = Math.floor(player.getCurrentTime());
          setWatchedDuration(currentTime);

          try {
            const progress = {
              learnerId: userId,
              lessonId: id,
              isCompleted: currentTime >= lesson.durationSeconds * 0.9,
              watchedDurationSeconds: currentTime,
            };
            setLearnerProgress(progress);
            await createLearnerProgress(progress);
          } catch (error) {
            console.error('Error updating progress:', error);
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  };

  window.onYouTubeIframeAPIReady = () => {
    if (lesson) {
      new window.YT.Player('youtube-player', {
        videoId: lesson.videoUrl?.split('v=')[1]?.split('&')[0],
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Đang tải...</div>;
  }

  if (!lesson) {
    return <div className="text-center text-red-500">Không tìm thấy bài học.</div>;
  }

  console.log('Lesson ID:', lesson.id); // In ra "8a3b3a4a-2446-47f9-8a8f-26e49f1e6caf"

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <FaVideo className="mr-2 text-blue-500" /> {lesson.title}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <iframe
            id="youtube-player"
            className="w-full rounded-lg shadow-md"
            height="315"
            src={`https://www.youtube.com/embed/${lesson.videoUrl.split('v=')[1]?.split('&')[0]}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="mt-4 flex items-center">
            <FaCheckCircle
              className={`mr-2 ${watchedDuration >= lesson.durationSeconds * 0.9 ? 'text-green-500' : 'text-gray-400'}`}
            />
            <span className="text-sm text-gray-600">
              Đã xem: {watchedDuration} / {lesson.durationSeconds} giây
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Thông tin bài học</h2>
          <p className="text-gray-600 mb-4">{lesson.description}</p>
          <div className="mb-4">
            <span className="font-medium text-gray-700">Loại kỹ năng: </span>
            <span className="text-blue-600">{lesson.skillType}</span>
          </div>
          <div className="mb-4">
            <span className="font-medium text-gray-700">Cấp độ: </span>
            <span className="text-blue-600">{lesson.level}</span>
          </div>
          {lesson.contentText && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                <FaFileAlt className="mr-2" /> Tài nguyên
              </h3>
              <p className="text-gray-600 mt-2">{lesson.contentText}</p>
            </div>
          )}
          {idProgress && (
            <div>
                <button onClick={conplete}>
                  đánh dấu hoàng thành
                </button>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;