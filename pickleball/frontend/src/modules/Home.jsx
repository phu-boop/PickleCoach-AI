import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function SearchSection() {
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
    <div class="py-12 px-4 bg-white text-center">
      <div className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Left: Heading and description */}
          <div className="md:w-3/4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950">
              Join over 419,900 Pickleheads
            </h2>
            <p className="mt-4 text-lg md:text-xl text-gray-700">
              Become a part of the fastest growing community of pickleball players in the world. Discover local games and
              recruit nearby players. It’s completely free to join!
            </p>
          </div>

          {/* Right: Button */}
          <div className="mt-6 md:mt-0 md:ml-8 text-center md:text-left">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full text-lg">
              Join Pickleheads Now
            </button>
            <p className="mt-2 text-blue-950 font-medium text-base">It’s completely free!</p>
          </div>
        </div>
      </div>
      <div class="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        <div>
          <img src="link-to-image1.png" alt="Discover games" class="mx-auto h-16 mb-4" />
          <p class="font-bold text-lg text-blue-950">Discover games<br />in your area</p>
        </div>
        <div class="border-l border-blue-200 pl-4">
          <img src="link-to-image2.png" alt="Connect groups" class="mx-auto h-16 mb-4" />
          <p class="font-bold text-lg text-blue-950">Connect with<br />local groups</p>
        </div>
        <div class="border-l border-blue-200 pl-4">
          <img src="link-to-image3.png" alt="Recruit players" class="mx-auto h-16 mb-4" />
          <p class="font-bold text-lg text-blue-950">Recruit nearby<br />players</p>
        </div>
        <div class="border-l border-blue-200 pl-4">
          <img src="link-to-image4.png" alt="Pickleball app" class="mx-auto h-16 mb-4" />
          <p class="font-bold text-lg text-blue-950">#1 Pickleball<br />mobile app</p>
        </div>
      </div>
    </div>

    </>
  );
}
