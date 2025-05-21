import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button';
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
    </>
  );
}
