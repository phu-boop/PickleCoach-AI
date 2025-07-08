import Button from "../../../components/Button";
import { FaCheckCircle } from "react-icons/fa";
const Earn = () => {
  return (
    <>
     <div className="bg-white mt-30 px-22 font-grandstander container-main max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
      
      {/* Left Content */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-3xl font-bold font-grandstander text-[#0a0b3d] mb-4 leading-tight">
          Get paid to organize<br />pickleball
        </h2>
        <p className="text-gray-700 text-base mb-6">
          Bring fun pickleball programming to your area and make money out on the court.
          You can run your whole business on Pickleheads – we’ll show you how!
        </p>

        <div className="flex items-center gap-7">
          <Button
          >Get a live walkthrough</Button>
          <a href="#" className="text-[#35211a] font-bold text-sm hover:underline">
            See it in action →
          </a>
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full lg:w-1/2 relative">
        <img
          src="https://cdn.filestackcontent.com/resize=w:1254/auto_image/hL9qw5NmTiGMimEePhyL"
          alt="organizer"
          className="w-full max-w-md mx-auto"
        />

        {/* Badge 1 - Top right */}
        <div className="absolute top-4 right-8 bg-white border-2 border-blue-100 shadow-md rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
          <img
            src="https://www.pickleheads.com/images/duotone-icons/calendar.svg"
            alt="calendar"
            className="w-5 h-5"
          />
          <span>15 sessions per week</span>
        </div>

        {/* Badge 2 - Bottom left */}
        <div className="absolute bottom-4 left-8 bg-white border-2 border-blue-100 shadow-md rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
          <img
            src="https://www.pickleheads.com/images/duotone-icons/money-bag.svg"
            alt="money"
            className="w-5 h-5"
          />
          <div className="leading-tight">
            <div>$10,320</div>
            <div className="text-xs text-gray-500">Last month</div>
          </div>
        </div>
      </div>
    </div>
    <div className='container-main border-t-4 py-5 mt-10 border-dotted border-[#A2DFFF]'>
    </div>
         <div className="bg-white container-main py-12 px-6 md:px-20 flex flex-col justify-center md:flex-row md:items-start md:space-x-12 space-y-8 md:space-y-0">
           {/* Left Side */}
           <div className="md:w-1/3">
             <h2 className="text-2xl font-black text-indigo-900 leading-snug mb-4">
               How it works
             </h2>
             <ul className="space-y-2 text-base text-gray-700">
               <li className="flex items-center space-x-2">
                 <FaCheckCircle className="text-green-500" />
                 <span>Unlimited rounds</span>
               </li>
               <li className="flex items-center space-x-2">
                 <FaCheckCircle className="text-green-500" />
                 <span>Any number of players</span>
               </li>
               <li className="flex items-center space-x-2">
                 <FaCheckCircle className="text-green-500" />
                 <span>Any number of courts</span>
               </li>
             </ul>
           </div>
     
           {/* Right Side - Cards */}
           <div className="md:w-2/3 grid grid-cols-1 mt-6 md:grid-cols-3 gap-4">
             {cardData.map((card, index) => (
               <div
                 key={index}
                 className="border rounded-lg p-4 shadow-sm hover:shadow-md transition text-sm"
               >
                 <div className="flex items-center mb-2 space-x-2">
                   <img src={card.icon} alt={card.title} className="w-6 h-6" />
                   <h3 className="text-indigo-900 font-bold text-base leading-tight">
                     {card.title}
                   </h3>
                 </div>
                 <hr className="border-dotted border-t-2 border-blue-200 mb-2" />
                 <p className="text-gray-700">{card.description}</p>
               </div>
             ))}
           </div>
         </div>
         <div className="bg-white px-6 py-16 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 font-grandstander">
      
      {/* Left image with badge */}
      <div className="w-full lg:w-1/2 relative">
        <img
          src="https://cdn.filestackcontent.com/rWIkr0cYQeWo9G01eUX9"
          alt="clinic"
          className="rounded-x w-full max-w-md mx-auto"
        />
        
        {/* Info Badge */}
        <div className="absolute bottom-4 left-4 bg-white border border-blue-200 rounded-xl shadow-lg px-4 py-2 flex items-center gap-3">
          <img
            src="https://www.pickleheads.com/images/duotone-icons/calendar.svg"
            alt="calendar"
            className="w-6 h-6"
          />
          <div className="text-sm leading-tight">
            <div className="font-semibold text-indigo-900">Learn to play pickleball</div>
            <div className="text-blue-600 text-sm">Southside Park</div>
            <div className="text-gray-600 text-sm">$20.00</div>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl md:text-3xl font-bold text-[#162556] mb-4">
          Teach new players how to play with <br className="hidden md:inline" /> beginner clinics
        </h2>

        <p className="text-gray-700 text-sm mb-6 leading-relaxed">
          Help players start their pickleball journey off right by running a beginner clinic.
          You can even target new players on Pickleheads.
        </p>

        <ul className="space-y-4">
          <li className="flex items-center gap-3">
            <img
              src="https://www.pickleheads.com/images/duotone-icons/group-court.svg"
              alt="group"
              className="w-5 h-5"
            />
            <span className="text-indigo-900 font-semibold text-sm">
              Organize group clinics of any size
            </span>
          </li>
          <li className="flex items-center gap-3">
            <img
              src="https://www.pickleheads.com/images/duotone-icons/dupr-send.svg"
              alt="dupr"
              className="w-5 h-5"
            />
            <span className="text-indigo-900 font-semibold text-sm">
              Track sign up fees ahead of time
            </span>
          </li>
          <li className="flex items-center gap-3">
            <img
              src="https://www.pickleheads.com/images/duotone-icons/trophy.svg"
              alt="trophy"
              className="w-5 h-5"
            />
            <span className="text-indigo-900 font-semibold text-sm">
              Promote to new players on Pickleheads
            </span>
          </li>
        </ul>
      </div>
    </div>
    </>
  );
}
export default Earn;


const cardData = [
  {
    title: "Create Matchups",
    icon: "https://www.pickleheads.com/images/duotone-icons/matchups.svg",
    description: "Add as many courts as you want and even give them custom names!",
  },
  {
    title: "Compete and add scores",
    icon: "https://www.pickleheads.com/images/duotone-icons/scoring.svg",
    description: "Tap to add scores for each matchup. Players can add their own scores too!",
  },
  {
    title: "Crown a Winner!",
    icon: "https://www.pickleheads.com/images/duotone-icons/tropy-gold.svg",
    description: "Watch the standings update in real-time. When it’s over, a winner is crowned!",
  },
];