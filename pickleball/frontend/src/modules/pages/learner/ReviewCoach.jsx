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
];
import { FiPlus, FiMinus } from 'react-icons/fi';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../components/Button';
import { getCoaches } from '../../../api/admin/coach';
import {fetchUserById} from '../../../api/admin/user';
import { Link } from 'react-router-dom';
const ReviewCoach = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState(null);
     const toggleIndex = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    console.log('coaches', coaches);
    const fetchCoaches = async () => {
        try {
            const response = await getCoaches();
            console.log('Fetched coaches:', response);

            const avataResponses = await Promise.all(
            response.map(async (coach) => {
                const userResponse = await fetchUserById(coach.userId);
                console.log('User response:', userResponse.data.urlavata);
                return {
                ...coach,
                urlavata: userResponse.data.urlavata,
                };
            })
            );

            console.log('Fetched after coaches:', avataResponses);
            setCoaches(avataResponses);
            setLoading(false);
        } catch (err) {
            console.log('Error fetching coaches:', err);
            setLoading(false);
        }
        };

    useEffect(() => {
        fetchCoaches();
    }, []);
    return (
        <>
        <div className="mt-15 flex flex-col gap-25 md:flex-row items-center justify-between max-w-6xl mx-auto py-10 px-4 bg-white">
        {/* Left section: Title, description, and button */}
        <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl font-bold font-grandstander text-[#0a0b3d] mb-4">Why You Need a Coach</h1>
            <p className="text-gray-600 mb-6 font-grandstander font-bold">
            A professional coach can significantly improve your pickleball skills. You’ll learn essential techniques, smart gameplay strategies, and how to enhance your personal performance. Most importantly, a coach provides personalized guidance to help you progress quickly and avoid unnecessary injuries.
            </p>
            <Button
            className="text-white mt-20 px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300">
            Start the Coach
            </Button>
        </div>

        {/* Right section: Image/video placeholder */}
        <div className="md:w-1/2 mt-6 md:mt-0">
            <div className="relative bg-while rounded-lg shadow-lg p-4">
            <a href="">
                <div className="relative">
                    <img
                    src="https://cdn.filestackcontent.com/FX2E1IWSSHikp7fhAfwo" // Replace with actual image URL if available
                    alt="Coach illustration"
                    className="w-full h-auto rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-[#2d93ad] text-white rounded-full w-16 h-16 flex items-center justify-center transition duration-300 cursor-pointer">
                        <span className="text-3xl">▶</span>
                    </div>
                    </div>
                </div>
            </a>
            <div className="text-gray-500 mt-2">00:45</div>
            <div className="text-[#0a0b3d] font-bold mt-2 text-2xl">Introduction</div>
            <p className="text-gray-600 mt-10 text-sm font-grandstander font-bold">
                This course introduces why a coach is essential for improving your skills, from basic techniques to advanced strategies.
            </p>
            </div>
        </div>
        </div>
        <div className='container-main border-t-4 border-dotted border-[#A2DFFF]'>
        <h2 className="mt-20 text-3xl font-bold text-center text-[#061137] mb-10 font-grandstander">
        Meet Our Coaches
      </h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading coaches...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coaches && coaches.length > 0 ? (
            coaches.map((coach) => (
                <a href={`/DetailCoach/${coach.userId}`} key={coach.userId}> 
                    <div
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                        <img
                        src={
                            coach.urlavata ||
                            'https://randomuser.me/api/portraits/men/1.jpg' // Fallback ảnh ngẫu nhiên
                        }
                        alt={coach.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                        />
                        <h3 className="text-xl font-semibold text-[#061137] mb-2 text-center font-grandstander">
                        {coach.name}
                        </h3>
                        <p className="text-gray-600 mb-4 text-center font-grandstander">
                        {coach.certifications && coach.certifications.length > 0
                            ? coach.certifications.join(', ')
                            : 'No certifications available'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {coach.specialties &&
                            coach.specialties.map((specialty, idx) => (
                            <span
                                key={idx}
                                className="bg-[#2d93ad] text-white text-xs px-3 py-1 rounded-full font-medium hover:bg-[#1a6f8c] transition-colors duration-200 cursor-default"
                            >
                                {specialty}
                            </span>
                            ))}
                        </div>
                        <button
                        onClick={() => alert(`Booking for ${coach.name} is not implemented yet.`)}
                        className="bg-[#2d93ad] hover:bg-[#1a6f8c] text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 w-full text-center cursor-pointer"
                        >
                        see now
                        </button>
                    </div>
                </a>
            ))
          ) : (
            <p className="text-center text-gray-500">No coaches available.</p>
          )}
        </div>
      )}
        </div>
        <div className='bg-[#d9f7ff]'>
                <div className='mt-20 container-main border-t-4 border-dotted border-[#A2DFFF]'>
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

export default ReviewCoach;

 