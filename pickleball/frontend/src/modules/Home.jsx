import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { FiPlus, FiMinus } from "react-icons/fi";
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
export default function SearchSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [courses, setCourses] = useState([]);
  const [lesson, setLesson] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch 3 khóa học cơ bản
    fetch('http://localhost:8080/api/featured-courses', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setCourses(data.slice(0, 3))) // Giới hạn 3 khóa học
        .catch((error) => console.error('Error fetching courses:', error.message));

    // Fetch bài học "Nhập môn Pickleball"
    fetch('http://localhost:8080/api/lessons?course_id=2', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const nhapMonLesson = data.find(lesson => lesson.title === 'Nhập môn Pickleball') || data[0];
          setLesson(nhapMonLesson);
        })
        .catch((error) => console.error('Error fetching lesson:', error.message));
  }, []);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <>
    
    <div
      className="font-grandstander bg-cover bg-center py-16 px-4 text-white text-center font-bold"
      style={{
        backgroundImage: `url('https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.filestackcontent.com%2Fresize%3Dw%3A900%2Fauto_image%2F3YvSfQ21Ts2WnxtOXqyi&w=1920&q=100')`,
      }}
    >
      {/* Tiêu đề */}
      <h1 className="text-[56px] mb-2">Find pickleball near you</h1>
      <p className="text-[28px] mb-8">Discover local courts and games</p>

      {/* Ô tìm kiếm */}
      <div className="w-full max-w-3xl mx-auto bg-white rounded-full border-[3px] border-yellow-400 flex items-center px-4 py-3 shadow-lg">
        {/* Icon location */}
        <FontAwesomeIcon icon={faLocationDot} className="text-[#0077b6] text-lg mr-3" />
        {/* Input */}
        <input
          type="text"
          placeholder="Search by city, state, or facility"
          className="flex-grow text-black text-base focus:outline-none"
        />
        {/* Button */}
        <button className="bg-[#2CA6C4] hover:bg-[#1f8da9] text-white rounded-full p-2 transition duration-200 h-12 cursor-pointer w-12">
          <FontAwesomeIcon icon={faArrowRight} size="lg"/>
        </button>
      </div>

      {/* Link bên dưới */}
      <p className="mt-4 text-white text-lg cursor-pointer">
        Or see all nearby places to play{' '}
        <span className="text-[#2CA6C4] hover:underline cursor-pointer">
          <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
        </span>
      </p>
    </div>
    <div class="bg-[#ddf7fe] py-6 px-4 flex justify-around items-center">
      <div class="text-left">
        <p class="text-xl font-bold text-[#162556]">
          The official court and game finder of USA Pickleball and<br />
          the Global Pickleball Federation!
        </p>
      </div>
      <div class="flex items-center space-x-4">
        <img src="https://cdn.filestackcontent.com/resize=w:252,h:128/auto_image/D5m2bqEUQReUsvFTA6mg" alt="USA Pickleball" class="h-15" />
        <div class="w-px bg-blue-300 h-10"></div>
        <img src="	https://cdn.filestackcontent.com/resize=w:432,h:128/auto_image/RuAB6Fc2T2ymATV6D0YX" alt="Global Pickleball Federation" class="h-15" />
      </div>
    </div>
    <div class="py-12 px-4 bg-white text-center container-main">
      <div className=" bg-white">
        <div className="max-w-7xl mx-auto flex md:flex-row justify-anround items-center">
          {/* Left: Heading and description */}
          <div className="md:w-3/4">
            <h2 className="text-4xl md:text-4xl font-bold font-grandstander text-[#0a0b3d] text-start">
              Join over 419,900 Pickleheads
            </h2>
            <p className="mt-4 text-lg md:text-xl font-grandstande text-[#0a0b3d] text-start">
              Become a part of the fastest growing community of pickleball players in the world. Discover local games and
              recruit nearby players. It’s completely free to join!
            </p>
          </div>

          {/* Right: Button */}
          <div className="mt-6 md:mt-0 md:ml-8 text-center md:text-left align-center">
            <Button
            children={"Join Pickleheads Now"}
            className={'font-black py-3 px-7 text-lg'}
            onClick={() => window.location.href = 'http://localhost:5173/input-assessment'}
            >

            </Button>
            <p className="mt-2 text-[#0a0b3d] font-grandstande font-bold text-lg text-base text-center">It’s completely free!</p>
          </div>
        </div>
      </div>
      <div class="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        <div>
          <img src="https://www.pickleheads.com/images/duotone-icons/map.svg" alt="Discover games" class="h-18 mb-2" />
          <p class="font-bold text-2xl text-start font-grandstande text-blue-1000">Discover games<br />in your area</p>
        </div>
        <div class="border-l border-blue-200 pl-4">
          <img src="https://www.pickleheads.com/images/duotone-icons/group-filled.svg" alt="Connect groups" class="h-18 mb-2" />
          <p class="font-bold text-2xl text-start font-grandstande text-blue-1000">Connect with<br />local groups</p>
        </div>
        <div class="border-l border-blue-200 pl-4">
          <img src="	https://www.pickleheads.com/images/duotone-icons/paper-plane.svg" alt="Recruit players" class="h-18 mb-2" />
          <p class="font-bold text-2xl text-start font-grandstande text-blue-1000">Recruit nearby<br />players</p>
        </div>
        <div class="border-l border-blue-200 pl-4">
          <img src="https://www.pickleheads.com/images/duotone-icons/sms.svg" alt="Pickleball app" class="h-18 mb-2" />
          <p class="font-bold text-2xl text-start font-grandstande text-blue-1000">#1 Pickleball<br />mobile app</p>
        </div>
      </div>
    </div>
    {/*Phần tt*/}
    <div className="bg-[#ddf7fe] p-10 text-lg">
      <div className="container-main ">
        {/* Left Content */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black font-grandstander text-[#0a0b3d] text-start">
            Mix it up with our NEW round robin tool!
          </h1>
          <Button
            children={"Learn More"}
            className={'font-black text-2xl py-3 px-7'}
            >
          </Button>
        </div>
        <div className="pt-7 text-xl grid grid-cols-1 lg:grid-cols-[2fr_0.1fr_2fr] gap-8 items-start">
          {/* Left Section */}
          <div className="space-y-8">
            <h2 className="text-[21px] ">
              Add a fun twist to your weekly games with our <span className="font-bold">free round robin tool</span>. It’s the most flexible way to organize play!
            </h2>

            <div className="space-y-6">
              <div className="flex align-center gap-3">
                <img src="https://www.pickleheads.com/images/duotone-icons/round-robin-gauntlet.svg" alt="Choose Format" className="w-10 h-10" />
                <span className="font-bold">Choose from 6 fun formats</span>
              </div>

              <div className="flex align-center gap-3">
                <img src="https://www.pickleheads.com/images/duotone-icons/manage-users.svg" alt="Any number of players" className="w-10 h-10" />
                <span className="font-bold">Any number of courts or players</span>
              </div>

              <div className="flex align-center gap-3">
                <img src="https://www.pickleheads.com/images/duotone-icons/scoring-b.svg" alt="Add scores" className="w-10 h-10" />
                <span className="font-bold">Add scores and view live standings</span>
              </div>

              <div className="flex align-center gap-3">
                <img src="https://www.pickleheads.com/images/duotone-icons/dupr-send.svg" alt="Send scores" className="w-10 h-10" />
                <span className="font-bold">Send scores to DUPR with instant validation</span>
              </div>
            </div>
          </div>

          {/* Dotted Divider */}
          <div className="hidden lg:flex justify-center w-px h-full bg-transparent">
            <div className="w-px h-full border-r-3 border-dotted border-cyan-200"></div>
          </div>

          {/* Right Section */}
          <div className="flex gap-10 text-start">
            {/* Center Subsection */}
            <div className="flex flex-col text-start w-[290px]">
              <img src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.filestackcontent.com%2Fresize%3Dw%3A600%2Fauto_image%2Fo79B0tiTXq4df7UDAEmM&w=828&q=75" alt="Preview Tool" className="rounded-xl shadow-xl w-full" />
              <h3 className="text-2xl text-cyan-700 font-semibold mt-6">Preview the tool</h3>
              <p className="mt-2">Use the simulator to understand how each round robin format works.</p>
              <a href="#" className="mt-4 font-bold hover:underline">Try it now →</a>
            </div>

            {/* Right Subsection */}
            <div className="flex flex-col items-center text-start w-[290px]">
              <img src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.filestackcontent.com%2Fresize%3Dw%3A600%2Fauto_image%2F6urEsprYRI2jOxLkRJBQ&w=828&q=75" alt="Create Round Robin" className="rounded-xl shadow-xl w-full" />
              <h3 className="text-2xl text-cyan-700 font-semibold mt-6">Create a round robin</h3>
              <p className="mt-2">Generate matchups, collect scores and view live standings!</p>
              <a href="#" className="mt-4 font-bold hover:underline">Learn more →</a>
            </div>
          </div>
        </div>
        <div className="mt-12 bg-white rounded-xl shadow-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            {/* Profile Image Placeholder */}
            <div className="">
              <img src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.filestackcontent.com%2Fresize%3Dw%3A304%2Fauto_image%2FKxzCqEzTFCBFhDEj5qof&w=256&q=75" alt="User" className="w-32 h-17 mr-6" />
            </div>
            {/* Text Content */}
            <div>
              <p className="text-[#2d93ad] font-semibold text-xl">
                See it in action - watch the video series!
              </p>
              <p className="text-gray-600 text-lg">
                Get a in-depth look at all <strong>6 formats</strong> and what running a round robin looks like on Pickleheads!
              </p>
            </div>
          </div>
          {/* Button */}
          <button className="border-4 border-[#2d93ad] text-black px-6 py-2 rounded-[50px] text-lg font-semibold cursor-pointer">
            Watch now
          </button>
          
        </div>
      </div>
    </div>
      <div className="max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <div className="space-y-8 border-r border-dotted pr-6 border-[#1a96b7]">
            <h2 className="text-4xl font-extrabold text-[#1a96b7] mb-10">Learn to play</h2>
            {courses.length > 0 ? (
                courses.map((course, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-5 cursor-pointer"
                        onClick={() => navigate(`/course/${course.id || index}`)} // Thêm sự kiện điều hướng
                    >
                      <img
                          src={course.thumbnailUrl || `https://via.placeholder.com/400x266?text=Image+${index + 1}`}
                          alt={`Course ${index + 1}`}
                          className="w-40 h-28 md:w-48 md:h-32 object-cover rounded-xl"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x266'; }}
                      />
                      <div>
                        <span className="inline-block bg-[#bbedff] text-[#0a0b3d] text-sm font-bold px-2 py-1 rounded">
                          Guides
                        </span>
                        <h3 className="mt-2 text-lg font-bold text-[#111943]">
                          {course.title || `Course ${index + 1}`}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {course.description || 'No description available'}
                        </p>
                      </div>
                    </div>
                ))
            ) : (
                <p>Error loading courses. Please check if the API at http://localhost:8080/api/featured-courses is running. See console for details.</p>
            )}
          </div>

          {/* Phần bên phải: Hiển thị lesson "Nhập môn Pickleball" */}
          <div className="space-y-6">
            <div className="relative">
              <iframe
                  width="100%"
                  height="315"
                  src={lesson?.video_url || 'https://www.youtube.com/embed/kqLRRNOpe8U'}
                  title="Nhập môn Pickleball"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-xl border-4 border-black shadow-lg"
              ></iframe>
              <div className="absolute bottom-16 left-4 bg-[#d9f7ff] px-6 py-4 rounded-xl shadow-md max-w-[90%] opacity-70">
                <p className="text-black font-semibold leading-snug text-base">
                  🎯 Học các kỹ thuật cơ bản với video hướng dẫn chi tiết
                </p>
              </div>
            </div>
            <div className="space-x-3">
              <span className="bg-[#bbedff] font-bold text-[#0a0b3d] text-sm px-2 py-1 rounded">Guides</span>
              <span className="bg-[#bbedff] font-bold text-[#0a0b3d] text-sm px-2 py-1 rounded">Learn</span>
            </div>
            <h3 className="text-3xl font-extrabold text-[#111943]">
              {lesson?.title || 'Nhập môn Pickleball'}
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-3">
              <button
                  className="cursor-pointer bg-gradient-to-b from-[#2ca6c9] to-[#1a96b7] hover:from-[#2d93ad] hover:to-[#226a7c] text-white font-bold px-6 py-3 rounded-full shadow transition duration-300"
                  onClick={() => navigate('/lessons/8a3b3a4a-2446-47f9-8a8f-26e49f1e6caf')}
              >
                Watch Now
              </button>
              <p className="text-[#111943] font-medium">
                <span
                    className="text-[#2ca6c9] font-semibold hover:underline inline-flex items-center cursor-pointer"
                    onClick={() => navigate('/learner')}
                >
                  OR read our guides
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    <div className="bg-[#d9f7ff] rounded-2xl p-6 container-main flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Left: Icon + Text */}
      <div className="flex items-center gap-4 w-2/5">
        {/* Replace this with  if needed */}
        <div className="text-4xl"><img src="https://www.pickleheads.com/images/duotone-icons/news.svg" alt="" className='w-[56px] mr-3'/></div>
        <p className="text-[#0076a3] font-bold text-[28px] flex-1">
          Epic points, pro tips & more –<br className="hidden md:block" /> delivered weekly to your inbox
        </p>
      </div>

      {/* Right: Form */}
      <div className=" w-full md:w-3/6">
        <input
          type="email"
          placeholder="Your email address"
          className="w-7/10 px-4 py-3 rounded-l-2xl shadow text-base font-semibold text-[#001933] placeholder:font-normal outline-none bg-white"
        />
        <button
          className="bg-gradient-to-b from-[#2ca6c9] to-[#1a96b7] hover:from-[#2d93ad] hover:to-[#226a7c] text-white font-bold px-6 py-3 rounded-r-2xl shadow transition duration-300"
        >
          Sign me up
        </button>

        <p className="text-sm text-gray-500 mt-2 text-center md:text-left">
          By signing up for the newsletter, you agree to our{' '}
          <a href="#" className="underline">privacy policy</a> and <a href="#" className="underline">terms of use</a>.
        </p>
      </div>
      </div>
      <div className="relative h-[680px] py-16 container-main mt-10">
      <div className="max-w-7xl mx-auto relative">
        {/* VIDEO chính (bên phải) */}
        <div className="relative w-full lg:w-[70%] float-right">
          <video
            controls
            className="w-full rounded-xl border-4 border-black shadow-lg"
            autoPlay
          >
            <source src="https://storage.googleapis.com/pbv-pro/home-video-970.mp4" type="video/mp4" />
            Trình duyệt không hỗ trợ video.
          </video>

          {/* Text overlay video */}
          <div className="absolute bottom-16 left-4 bg-[#d9f7ff] px-6 py-4 rounded-xl shadow-md max-w-[90%] opacity-70">
            <p className="text-black font-semibold leading-snug text-base">
              🎯 Active Play Detection (APD) tracks every player and shot, <br />
              recreating your game in 3D to maximize learning
            </p>
          </div>
        </div>

        {/* ẢNH ĐIỆN THOẠI (nổi bên trái như overlay) */}
        <div className="absolute -top-10 -left-0 w-[433px] z-10">
          <div className="border-[6px] border-black rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://pb.vision/assets/mobile-recording-example-4dc4535b.png"
              alt="Mobile recording"
              className="w-full"
            />
          </div>

          {/* Bubble text nhỏ ở dưới */}
          <div className="absolute -bottom-12 left-2 bg-[#d9f7ff] px-4 py-3 rounded-xl shadow-md w-[280px] opacity-90">
            <p className="font-semibold text-black text-base leading-snug">
              📱 Simply record, <br /> upload, and improve
            </p>
          </div>

        {/* Mũi tên nối lên */}
        <div className="absolute bottom-[-60px] left-[20%] mt-3">
          {/* Đầu mũi tên (hướng lên) */}
          <div className="absolute w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-300 transform -translate-x-1/2 left-1/2 top-0"></div>
          {/* Đường thẳng của mũi tên */}
          <div className="absolute w-0.5 h-35 bg-gray-300 transform -translate-x-1/2 left-1/2 top-[7px]"></div>
        </div>
        <Button
        children={"upload video"}
        className={'absolute bottom-[-260px] left-[20%] transform -translate-x-1/2 mt-3 px-4 py-3'}
        onClick={() => window.location.href = 'http://localhost:5173/upload-video'}
        ></Button>
        <div className="absolute bottom-[-60px] left-[50%] mt-3">
          {/* Đường dọc (từ trên xuống) */}
          <div className="absolute w-0.5 h-45 bg-gray-300 transform -translate-x-1/2 left-1/2 top-0"></div>
          {/* Đường ngang (từ trái sang phải) */}
          <div className="absolute w-38 h-0.5 bg-gray-300 transform -translate-y-1/2 top-[179px] left-0"></div>
          {/* Đầu mũi tên (hướng sang trái) */}
          <div className="absolute w-0 h-0 border-y-8 border-r-8 border-y-transparent border-r-transparent border-l-8 border-l-gray-300 transform -translate-y-1/2 top-[179px] left-[148px]"></div>
        </div>
        </div>
      </div>
    </div>
    <div className="bg-[#ddf7fe]">
      <div className="container-main py-19">
        <h2 className="text-[32px] font-grandstander font-bold text-[#0a0b3d] mb-4">
          Find courts, games, and lessons wherever you go
        </h2>
        <div className="flex space-x-6 mb-4">
          <button className="text-black font-black uppercase border-b-2 border-black">Cities</button>
          <button className="text-gray-400 font-black uppercase">States</button>
          <button className="text-gray-400 uppercase font-black">Countries</button>
          <button className="text-gray-400 uppercase font-black">Court Types</button>
          <button className="text-gray-400 uppercase font-black">Amenities</button>
        </div>
        <div className="relative">
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center">
            ←
          </button>
          <div className="flex overflow-x-auto scrollbar-hide space-x-8">
            {cities.map((city, index) => (
              <div
                key={index}
                className="w-60 rounded-xl overflow-hidden shadow-md bg-white"
              >
                <div className="relative h-40">
                  <img
                    src={city.image}
                    alt={city.city}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold drop-shadow-md">
                      {city.city}
                    </h3>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 text-sm">
                  <div className="flex justify-between py-1">
                    <span>Locations</span>
                    <span className="text-sky-600 font-semibold">{city.locations}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Courts</span>
                    <span className="text-sky-600 font-semibold">{city.courts}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Games</span>
                    <span className="text-sky-600 font-semibold">{city.games}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#2A96AC] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-md hover:bg-[#24839A] transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div className='bg-[#d9f7ff]'>
        <div className='container-main border-t-4 border-dotted border-[#A2DFFF]'>
          <div className="bg-[#d9f6ff] py-12 px-4 sm:px-8 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#061137] mb-10 font-grandstander">Frequently Asked Questions</h2>
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg p-6 mb-4 transition-all duration-300 ${
                  openIndex === index ? "shadow-md" : ""
                }`}
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <span className="text-lg font-bold text-[#061137] font-grandstander ">
                    {faq.question}
                  </span>
                  <span className="text-[#2A96AC] text-xl cursor-pointer">
                    {openIndex === index ? <FiMinus /> : <FiPlus />}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="mt-4 text-gray-700 whitespace-pre-line">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
    </div>
    <section className="text-center py-12 bg-white container-main">
      <div className='flex justify-between mb-10'>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0D0D3F] my-2 font-grandstander">
          Join the fastest growing pickleball community
        </h2>
        <Button
        children={"Join for free"}
        className={'py-1'}
        ></Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
        {/* Item 1 */}
        <div>
          <h3 className="text-3xl font-extrabold text-cyan-500 drop-shadow-[2px_2px_0px_#FACC15]">
            420,600
          </h3>
          <p className="text-cyan-700 font-semibold text-lg mb-2">members</p>
          <p className="text-gray-700 text-sm">
            Join a community of pickleball players and find new friends to play with.
          </p>
        </div>

        {/* Item 2 */}
        <div>
          <h3 className="text-3xl font-extrabold text-cyan-500 drop-shadow-[2px_2px_0px_#FACC15]">
            2,624,300
          </h3>
          <p className="text-cyan-700 font-semibold text-lg mb-2">games</p>
          <p className="text-gray-700 text-sm">
            Browse games and open play sessions anywhere you go.
          </p>
        </div>

        {/* Item 3 */}
        <div>
          <h3 className="text-3xl font-extrabold text-cyan-500 drop-shadow-[2px_2px_0px_#FACC15]">
            20,900
          </h3>
          <p className="text-cyan-700 font-semibold text-lg mb-2">locations</p>
          <p className="text-gray-700 text-sm">
            Find every place to play pickleball in your local area.
          </p>
        </div>

        {/* Item 4 */}
        <div>
          <h3 className="text-3xl font-extrabold text-cyan-500 drop-shadow-[2px_2px_0px_#FACC15]">
            8,500
          </h3>
          <p className="text-cyan-700 font-semibold text-lg mb-2">cities</p>
          <p className="text-gray-700 text-sm">
            Now available worldwide. Find courts & games anywhere!
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
// const miniGuides = [
//   {
//     title: "Cách chơi pickleball - 9 quy tắc đơn giản dành cho người mới bắt đầu",
//     image: "https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F6600e8971938f3d573f194fdc48f079ab32f51c6-736x490.png%3Fauto%3Dformat%26w%3D400%26h%3D266%26fit%3Dclip&w=1920&q=75",
//   },
//   {
//     title: "Xếp hạng kỹ năng chơi pickleball của tôi là bao nhiêu? Hãy làm bài kiểm tra này để...",
//     image: "https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2Fd6feb1e7dcddd082cc630123aea5dee4fc4900f8-736x490.png%3Fauto%3Dformat%26w%3D400%26h%3D266%26fit%3Dclip&w=1920&q=75",
//   },
//   {
//     title: "Cách tổ chức giải đấu nhỏ trên Pickleheads",
//     image: "https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F93f647a93b9c1101b141e9c6815c700e5d515b4d-736x490.png%3Fauto%3Dformat%26w%3D400%26h%3D266%26fit%3Dclip&w=1920&q=75",
//   },
// ];

const cities = [
    { city: 'Chicago', locations: 68, courts: 309, games: 162, image: 'https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.filestackcontent.com%2Fresize%3Dw%3A400%2Ch%3A400%2Fauto_image%2FlWZm6O7gR4yOeOZ0K0b9&w=1920&q=75' },
    { city: 'New York', locations: 62, courts: 231, games: 317, image: 'https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.filestackcontent.com%2Fresize%3Dw%3A400%2Ch%3A400%2Fauto_image%2FlWZm6O7gR4yOeOZ0K0b9&w=1920&q=75' },
    { city: 'Seattle', locations: 62, courts: 249, games: 379, image: 'https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.filestackcontent.com%2Fresize%3Dw%3A400%2Ch%3A400%2Fauto_image%2FlWZm6O7gR4yOeOZ0K0b9&w=1920&q=75' },
    { city: 'San Diego', locations: 58, courts: 261, games: 445, image: 'https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.filestackcontent.com%2Fresize%3Dw%3A400%2Ch%3A400%2Fauto_image%2FlWZm6O7gR4yOeOZ0K0b9&w=1920&q=75' },
    { city: 'Ottawa', locations: 56, courts: 206, games: 285, image: 'https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.filestackcontent.com%2Fresize%3Dw%3A400%2Ch%3A400%2Fauto_image%2FlWZm6O7gR4yOeOZ0K0b9&w=1920&q=75' },
    { city: 'Austin', locations: 55, courts: 216, games: 515, image: 'https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.filestackcontent.com%2Fresize%3Dw%3A400%2Ch%3A400%2Fauto_image%2FlWZm6O7gR4yOeOZ0K0b9&w=1920&q=75' },
  ];


  const faqData = [
  {
    question: "Do I need to bring my own chalk or net?",
    answer:
      "It depends! Some courts have permanent nets and lines. Others require players to bring their own net or draw their own lines.\n\nWhen you search on Pickleheads, you can filter by the type of lines (permanent, chalk or tape) and the type of net (pickleball net, tennis net or bring your own).\n\nPlease note: our data is only as good as what other Pickleheads provide us with. If you see any incorrect line or net information, be sure to suggest changes to your local court and we’ll update it right away.",
  },
  {
    question: "How can I find pickleball courts with lights?",
    answer: "Use filters when searching to find courts with lighting features.",
  },
  {
    question: "Which courts are indoor and which courts are outdoor?",
    answer: "Indoor and outdoor options can be found using the 'type' filter.",
  },
  {
    question: "Is it possible to see only free public pickleball courts?",
    answer: "Yes! Use the 'free to play' filter on the search page.",
  },
  {
    question: "Can I reserve a court through Pickleheads?",
    answer: "Reservations depend on court partnerships. Check the court details page.",
  },
  {
    question: "How can I update information for my local court?",
    answer: "Use the 'suggest edit' button on any court's detail page.",
  },
  {
    question: "What equipment do I need to play pickleball?",
    answer: "You'll need a paddle, a pickleball, and optionally court shoes.",
  },
];