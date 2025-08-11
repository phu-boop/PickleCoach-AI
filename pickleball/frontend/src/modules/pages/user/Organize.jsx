import Button from "../../../components/Button";
import { FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
const features = [
  {
    text: "Accept credit or debit, Apple Pay, or Google Pay",
    icon: "https://www.pickleheads.com/images/duotone-icons/payment-phone.svg",
  },
  {
    text: "Refund policies with automatic processing",
    icon: "https://www.pickleheads.com/images/duotone-icons/payment-refund.svg",
  },
  {
    text: "Store payment methods for future sessions",
    icon: "https://www.pickleheads.com/images/duotone-icons/payment-card.svg",
  },
];
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
];const formats = [
  {
    name: "Popcorn",
    icon: "https://www.pickleheads.com/images/duotone-icons/round-robin-popcorn.svg",
  },
  {
    name: "Gauntlet",
    icon: "https://www.pickleheads.com/images/duotone-icons/round-robin-gauntlet.svg",
  },
  {
    name: "Up & Down the River",
    icon: "https://www.pickleheads.com/images/duotone-icons/round-robin-up-and-down-the-river.svg",
  },
  {
    name: "Claim the Throne",
    icon: "https://www.pickleheads.com/images/duotone-icons/round-robin-claim-the-throne.svg",
  },
  {
    name: "Cream of the Crop",
    icon: "https://www.pickleheads.com/images/duotone-icons/round-robin-cream-of-the-crop.svg",
  },
  {
    name: "Double Header",
    icon: "https://www.pickleheads.com/images/duotone-icons/round-robin-double-header.svg",
  },
  {
    name: "Mixed Madness",
    icon: "https://www.pickleheads.com/images/duotone-icons/round-robin-mixed-madness.svg",
  },
  {
    name: "Scramble",
    icon: "https://www.pickleheads.com/images/duotone-icons/round-robin-scramble.svg",
  },
];
const Organize = () => {
    const [selected, setSelected] = useState("Popcorn");
  const [partnerFormat, setPartnerFormat] = useState("Rotate");
  return (
    < >
    <div className="mt-30">
        
        <div className="bg-white container-main py-12 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between">
      {/* Left Content */}
      <div className="md:w-1/2 space-y-6">
        <h1 className="text-4xl font-bold font-grandstander text-[#0a0b3d]">
          Try the <span className="text-[#3b4252]">#1 Pickleball</span><br />
          Round Robin Tool
        </h1>
        <p className="text-gray-700 text-lg pr-11">
          Ditch the spreadsheet and run your entire round robin on Pickleheads.
          Generate matchups, track scores, and view standings from your phone. 
          Play social or competitive games with rotating partners – or try our 
          new fixed partner format for mini tournaments!
        </p>
        <div className="flex items-center space-x-8">
            <Button
              children={"Create a round robin"}
                onClick={() => window.location.href = '/organize'}
                className=""
            />
          <a href="#" className="text-[#4c566a] font-black hover:underline">
            or preview the tool →
          </a>
        </div>
      </div>

      {/* Right Image */}
      <div className="mt-10 md:mt-0 md:w-1/2 p-4">
        <div className="relative">
          <img
            src="https://cdn.filestackcontent.com/resize=w:1000/auto_image/o79B0tiTXq4df7UDAEmM"
            alt="Pickleball"
            className="rounded-xl shadow-lg"
          />

          {/* Optional: You can overlay things like tooltips or buttons using absolute positioning */}
        </div>
      </div>
    </div>
    <div className='container-main border-t-4 border-dotted border-[#A2DFFF]'>
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
    
    <div className='container-main border-t-4 border-dotted border-[#A2DFFF]'>
    </div>
    <div className="bg-white py-12 px-18 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold font-grandstander text-[#2e3440] mb-6">
        Select from 9 fun formats
      </h2>

      {/* Partner Format */}
      <div className="mb-6">
        <h4 className="text-sm mb-2 font-black text-gray-800">Partner Format</h4>
        <div className="inline-flex rounded-xl bg-gray-100 overflow-hidden">
          {["Rotate", "Fixed"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 text-sm font-semibold relative ${
                partnerFormat === type
                  ? "bg-[#53cffc] text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setPartnerFormat(type)}
            >
              {type}
              {type === "Fixed" && (
                <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 text-[10px] bg-yellow-300 text-yellow-900 font-bold px-1.5 py-0.5 rounded">
                  
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Game Format List */}
        <div className="w-full lg:w-1/4 space-y-2">
          {formats.map((format) => (
            <button
              key={format.name}
              onClick={() => setSelected(format.name)}
              className={`flex items-center gap-3 border w-full rounded-lg px-4 py-5 text-left text-sm font-semibold transition ${
                selected === format.name
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:bg-gray-100"
              }`}
            >
              <img src={format.icon} alt={format.name} className="w-5 h-5" />
              {format.name}
            </button>
          ))}
        </div>

        {/* Description + Video + Tips */}
        <div className="w-full lg:w-2/3 space-y-6 items-center">
        <div className="flex justify-center items-center">
          {/* How it works */}
          <div>
            <h3 className="font-bold text-2xl text-teal-700 mb-2">How it works</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>{selected}</strong> is a fun, social format that allows players to mix in with as
              many other players as possible. In each round, unique matchups are randomly
              generated. If you don’t like the draw for that round, just hit the Shuffle
              button to get a new one. {selected} works with any number of players or courts!
            </p>
            <a href="#" className="text-[#696cff] font-black text-sm mt-2 inline-block">
              Try it in the simulator →
            </a>
          </div>

          {/* Video demo */}
          <div className="relative w-full h-auto px-2">
            <img
              src="https://cdn.filestackcontent.com/resize=width:780,height:439/auto_image/bsuVi6DtR3ysnHlexBCK"
              alt="Demo"
              className="w-full rounded-lg shadow items-center"
            />
            <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
              demo
            </span>
          </div>
        </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-blue-100 text-blue-900 font-semibold text-xs px-3 py-1 rounded">
              Random Matchups
            </div>
            <div className="bg-gray-100 text-gray-900 font-semibold text-xs px-3 py-1 rounded">
              1 Game per round
            </div>
            <div className="bg-blue-100 text-blue-900 font-semibold text-xs px-3 py-1 rounded">
              Win Percentage
            </div>
          </div>

          {/* Pro tip */}
          <div className="border-t pt-4 mt-30 pt-20 text-sm text-gray-600 flex items-start gap-2">
            <span className="text-yellow-500 text-lg"><img src="https://www.pickleheads.com/images/duotone-icons/tips.svg" alt="" /></span>
            <p>
              <span className="text-blue-700 font-bold">Pro tip:</span> We recommend running{" "}
              <strong>timed rounds</strong> to eliminate waiting between games. Instead of playing to 11,
              play until the buzzer sounds. If tied, play one more rally point.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-[#ddf6ff] ">
    <div className="px-6 py-16 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
      {/* Left: Image */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <img
          src="https://cdn.filestackcontent.com/aHF3znTS5m7soR6B2y6B"
          alt="Payment form"
          className="max-w-full w-[400px]"
        />
      </div>

      {/* Right: Content */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0a0b3d] mb-4">
          Seamlessly collect payments
        </h2>

        <p className="text-gray-700 text-sm font-bold mb-6 leading-relaxed">
          No more tracking down payments! Charge players for a spot in any<br></br> session. Perfect for clinics, round robins, leagues and more.
        </p>

        <ul className="space-y-4">
          {features.map((f, index) => (
            <li key={index} className="flex items-center gap-3">
              <img src={f.icon} alt="" className="w-9 h-9 mt-1" />
              <span className="text-sm text-indigo-900 font-black">{f.text}</span>
            </li>
          ))}
        </ul>
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
    
    </div>
    </>
  );
}
export default Organize;
