import React, { useState, useEffect } from 'react';
import { FaVideo, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import {
  getLessonById,
  createLearnerProgress,
  checkLearnerProgress,
  updateLessonComplete,
  checkCompleted,
} from '../../../api/learner/learningService';

const LessonDetailPage = ({ userId }) => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchedDuration, setWatchedDuration] = useState(0);
  const [player, setPlayer] = useState(null);
  const [idProgress, setIdProgress] = useState(null);
  const [completeProgress, setCompleteProgress] = useState(true);
  const [learnerProgress, setLearnerProgress] = useState({
    learnerId: userId,
    lessonId: id,
    isCompleted: false,
    watchedDurationSeconds: 0,
  });

  const complete = async () => {
    try {
      const response = await updateLessonComplete(idProgress);
      console.log('Update complete response:', response);
      setCompleteProgress(true);
    } catch (error) {
      console.error('Error updating completion:', error);
    }
  };

  const checkComplete = async (idProgress) => {
    try {
      const input = { id: idProgress };
      const response = await checkCompleted(input);
      setCompleteProgress(response.data.isExist);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchCreateProgress = async () => {
    try {
      const response = await createLearnerProgress(learnerProgress);
      setIdProgress(response.id);
    } catch (error) {
      console.error('Error creating progress:', error);
    }
  };

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    const fetchLessonAndProgress = async () => {
      try {
        const progressInput = { lessonId: id, learnerId: userId };
        const progressData = await checkLearnerProgress(progressInput);
        setIdProgress(progressData.idProgress || null);
        await checkComplete(progressData.idProgress);

        if (!progressData.isExist) {
          setLearnerProgress({
            learnerId: userId,
            lessonId: id,
            isCompleted: false,
            watchedDurationSeconds: 0,
          });
          await fetchCreateProgress();
        }

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
            if (idProgress) {
              await createLearnerProgress(progress);
            }
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

  if (loading) return <div className="text-center text-gray-500 py-10">Đang tải...</div>;
  if (!lesson) return <div className="text-center text-red-500 py-10">Không tìm thấy bài học.</div>;

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center font-grandstander gap-3">
          <img src={'https://www.pickleheads.com/images/duotone-icons/court-schedule.svg'} className={'p-5 w-25 mr-2'}/>
          {lesson.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-grandstander font-bold items-center">
          {/* Left: Video + progress */}
          <div className="lg:col-span-2 space-y-6">
            <iframe
                id="youtube-player"
                className="w-full aspect-video rounded-xl border border-gray-200 shadow-md"
                src={`https://www.youtube.com/embed/${lesson.videoUrl.split('v=')[1]?.split('&')[0]}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <FaCheckCircle
                  className={`text-lg ${
                      watchedDuration >= lesson.durationSeconds * 0.9 ? 'text-green-500' : 'text-gray-400'
                  }`}
              />
              Đã xem: {watchedDuration} / {lesson.durationSeconds} giây
            </div>
          </div>

          {/* Right: Info */}
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
            <h2 className="text-xl font-semibold text-gray-800">Thông tin bài học</h2>
            <p className="text-gray-600 leading-relaxed">{lesson.description}</p>

            <div>
              <span className="font-medium text-gray-700">Loại kỹ năng: </span>
              <span className="text-indigo-600">{lesson.skillType}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Cấp độ: </span>
              <span className="text-indigo-600">{lesson.level}</span>
            </div>

            {lesson.contentText && (
                <div>
                  <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-2">
                    <FaFileAlt className="text-gray-500 mr-2" />
                    Tài nguyên
                  </h3>
                  <p className="text-gray-600">{lesson.contentText}</p>
                </div>
            )}

            <div>
              {!completeProgress ? (
                  <button
                      onClick={complete}
                      className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow transition duration-200"
                  >
                    ✅ Đánh dấu đã hoàn thành
                  </button>
              ) : (
                  <span className="text-green-600 font-semibold text-sm">
                🎉 Bạn đã hoàn thành bài học này
              </span>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default LessonDetailPage;