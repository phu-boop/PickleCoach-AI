import React, { useState } from 'react';
import Button from '../../../components/Button';
import { useInView } from 'react-intersection-observer';

const sections = [
  { id: 'how-to-play', title: 'How to play' },
  { id: 'starting-a-rally', title: 'Starting a rally' },
  { id: 'two-bounce-rule', title: 'Two bounce rule' },
  { id: 'faults', title: 'Faults' },
  { id: 'nvz', title: 'The "NVZ"' },
  { id: 'winning-points', title: 'Winning points' },
  { id: 'serving', title: 'Serving' },
  { id: 'first-to-11', title: 'First to 11' },
  { id: 'getting-started', title: 'Getting started' },
  { id: 'types-of-shots', title: 'Types of shots' },
  { id: 'serving-2', title: 'Serving' },
  { id: 'keeping-score', title: 'Keeping score' },
  { id: 'two-bounce-rule-2', title: 'Two-bounce rule' },
  { id: 'doubles', title: 'Doubles' },
  { id: 'singles', title: 'Singles' },
  { id: 'solo-practice', title: 'Solo practice' },
  { id: 'beginner-tips', title: 'Beginner tips' },
  { id: 'finding-courts', title: 'Finding courts' },
  { id: 'bottom-line', title: 'Bottom line' },
  { id: 'faqs', title: 'FAQs' },
];

export default function Learn() {
  const [activeSection, setActiveSection] = useState(null);

  const updateActiveSection = (id, inView) => {
    if (inView) {
      setActiveSection(id);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen container-main font-grandstander mt-20 px-30">
      {/* Menu (Sticky Sidebar Left) */}
      <aside className="sticky top-0 w-40 p-4 bg-white border-r border-gray-200 h-screen overflow-y-auto hidden md:block shadow-md">
        <h2 className="text-lg font-black mb-4 font-grandstander text-[#ff6200]">Jump to:</h2>
        <ul className="space-y-2 font-bold text-sm text-[#8790b1]">
          {sections.map((sec) => (
            <li key={sec.id}>
              <a
                href={`#${sec.id}`}
                className={`hover:underline transition-colors duration-300 ${activeSection === sec.id ? 'text-blue-700' : ''}`}
              >
                {sec.title}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[#162556] mb-4">How to play pickleball – 9 simple rules for beginners</h1>
          <div className="flex items-center mb-4">
            <img
              src="https://www.pickleheads.com/assets/logo-lockup.svg"
              alt="Author"
              className="w-10 h-10 rounded-full mr-2"
            />
            <div>
              <p className="text-sm text-gray-600">Brandon Mackie</p>
              <p className="text-sm text-gray-500">Updated on: Jul 19, 2024</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            This article was written in collaboration with <span className="font-bold">USAPickleball</span>.
          </p>
          <img
            src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F654b70bffde64657262645d12cda272a0b2112bb-1472x1104.png%3Fauto%3Dformat%26w%3D512&w=1920&q=75"
            alt="Pickleball players"
            className="w-full h-auto mb-4 rounded-lg"
          />
          <p className="text-gray-700 mb-4">
            Ready to learn how to play pickleball? You’re not alone. Pickleball is now the fastest-growing sport in America, and it’s tons of fun. Whether you’re an absolute beginner or a seasoned player looking to refresh your game, I’ve got you covered with this quick guide. Follow these 7 simple rules and you’ll be out playing in no time.
          </p>
          <p className="text-gray-700 mb-4">
            To get started, all you need is a quality pickleball paddle, pickleball balls to play with, and a pickleball court near you. The best way to learn the basics is with a private lesson or beginner’s clinic. They often provide equipment if you’re not ready to invest in gear yet.
          </p>
          {sections.map((sec) => {
            const { ref, inView } = useInView({
              threshold: 0.5,
              onChange: (inView) => updateActiveSection(sec.id, inView),
            });

            return (
              <section key={sec.id} id={sec.id} ref={ref} className="scroll-mt-16 mb-8">
                <h2 className="text-2xl font-bold text-[#162556] mb-2">{sec.title}</h2>
                {sec.id === 'how-to-play' && (
                  <div className="text-gray-700">
                    <p className="mb-2">
                      Pickleball is played on a badminton-sized court (20' x 44') with a net at 36" at the sidelines and 34" at the center. Each side has a 7’ non-volley zone (NVZ or "kitchen") where volleys are prohibited.
                    </p>
                    <p className="mb-2">
                      It’s typically played in doubles (two per team), but singles is an option—check my{' '}
                      <a href="https://www.pickleheads.com/guides/pickleball-singles" className="text-blue-600 underline">singles guide</a>.
                    </p>
                    <img
                      src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2Fcf666fbf668da2882d7e55fa8932f3ce8afc5392-736x490.png%3Fauto%3Dformat%26w%3D800%26fit%3Dclip&w=1920&q=75"
                      alt="Pickleball doubles"
                      className="w-full h-auto mb-2 rounded-lg"
                    />
                  </div>
                )}
                {sec.id === 'starting-a-rally' && (
                  <div className="text-gray-700">
                    <p className="mb-2">Each rally begins with a serve from the right side, diagonally to the opponent’s service box.</p>
                    <img
                      src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F0aa2764258ca0bd3be8896232c3f2ed62c283373-736x450.png%3Fauto%3Dformat%26w%3D736%26fit%3Dcrop&w=1920&q=75"
                      alt="Serve area"
                      className="w-full h-auto mb-2 rounded-lg"
                    />
                    <p className="mb-2">Serve underhand below the waist with an upward arc, clearing the kitchen line.</p>
                  </div>
                )}
                {sec.id === 'two-bounce-rule' && (
                  <div className="text-gray-700">
                    <p className="mb-2">The ball must bounce once on each side before volleying (two-bounce rule) to ensure fair play.</p>
                    <img
                      src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F612e2422df42b98e80205c98a2ea67ff60b110e3-736x450.png%3Fauto%3Dformat%26w%3D736%26fit%3Dcrop&w=1920&q=75"
                      alt="Two-bounce rule"
                      className="w-full h-auto mb-2 rounded-lg"
                    />
                  </div>
                )}
                {sec.id === 'faults' && (
                  <div className="text-gray-700">
                    <p className="mb-2">A fault ends the rally: serve out, ball out, net hit, or double bounce.</p>
                    <img
                      src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2Ff279c48b3e428c3fec413bd99170151d45147ee0-736x450.png%3Fauto%3Dformat%26w%3D736%26fit%3Dcrop&w=1920&q=75"
                      alt="Fault examples"
                      className="w-full h-auto mb-2 rounded-lg"
                    />
                  </div>
                )}
                {sec.id === 'nvz' && (
                  <div className="text-gray-700">
                    <p className="mb-2">The 7’ non-volley zone (NVZ or kitchen) prohibits volleys. You can hit after a bounce but not enter with momentum after a volley.</p>
                    <img
                      src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2Ff64602ef25b407873733b20effd99c5cd1def4a4-736x450.png%3Fauto%3Dformat%26w%3D736%26fit%3Dcrop&w=1920&q=75"
                      alt="NVZ zone"
                      className="w-full h-auto mb-2 rounded-lg"
                    />
                  </div>
                )}
                {sec.id === 'winning-points' && (
                  <div className="text-gray-700">
                    <p className="mb-2">Only the serving team scores points. Switch sides with your partner after each point until a fault.</p>
                  </div>
                )}
                {sec.id === 'serving' && (
                  <div className="text-gray-700">
                    <p className="mb-2">Call the score (serving team, receiving team, server number, e.g., "0-0-2") before serving.</p>
                    <img
                      src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2Fd1ca72d95335d32aa6e58e310fd7ad3afb675410-736x300.png%3Fauto%3Dformat%26w%3D736%26fit%3Dcrop&w=1920&q=75"
                      alt="Score call"
                      className="w-full h-auto mb-2 rounded-lg"
                    />
                  </div>
                )}
                {sec.id === 'first-to-11' && (
                  <div className="text-gray-700">
                    <p className="mb-2">First team to 11 wins, but must lead by 2 (e.g., 11-9 or 12-10).</p>
                  </div>
                )}
                {sec.id === 'getting-started' && (
                  <div className="text-gray-700">
                    <p className="mb-2">You need a paddle, balls, and a court. Try a lesson for basics.</p>
                    <img
                      src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F12aa0206afc6ccba808a6a07111c31830a868777-736x552.png%3Fauto%3Dformat%26w%3D512&w=1920&q=75"
                      alt="Gear"
                      className="w-full h-auto mb-2 rounded-lg"
                    />
                  </div>
                )}
                {sec.id === 'types-of-shots' && (
                  <div className="text-gray-700">
                    <ul className="list-disc pl-5">
                      <li>Drives: Powerful baseline shots.</li>
                      <li>Drop Shots: Land in the kitchen.</li>
                      <li>Dinks: Soft kitchen shots.</li>
                      <li>Volleys: Air hits outside NVZ.</li>
                      <li>Lobs: High defensive shots.</li>
                      <li>Overheads: Smashes on lobs.</li>
                    </ul>
                  </div>
                )}
                {sec.id === 'serving-2' && (
                  <div className="text-gray-700">
                    <p className="mb-2">Serve underhand below the waist, diagonally, clearing the kitchen. The 2021 rule allows a drop serve.</p>
                    <img
                      src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F802ebdf72e3fc3e690d8253e469900456b2537f8-736x450.png%3Fauto%3Dformat%26w%3D736%26fit%3Dcrop&w=1920&q=75"
                      alt="Serve technique"
                      className="w-full h-auto mb-2 rounded-lg"
                    />
                  </div>
                )}
                {sec.id === 'keeping-score' && (
                  <div className="text-gray-700">
                    <p className="mb-2">Start with "0-0-2", switch sides after points until a fault.</p>
                    <img
                      src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F33b70bd8bfc118a0641a5726bac16e3722905f54-3806x3036.jpg%3Fauto%3Dformat%26w%3D736%26fit%3Dcrop&w=1920&q=75"
                      alt="Score setup"
                      className="w-full h-auto mb-2 rounded-lg"
                    />
                  </div>
                )}
                {sec.id === 'two-bounce-rule-2' && (
                  <div className="text-gray-700">
                    <p className="mb-2">Reiterates the two-bounce rule for fair play.</p>
                  </div>
                )}
                {sec.id === 'doubles' && (
                  <div className="text-gray-700">
                    <p className="mb-2">Two players per team, standard rules apply.</p>
                    <img
                      src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2Fb5247363b108ae36cb7d2b7c7fd6e43e7bda410a-736x450.png%3Fauto%3Dformat%26w%3D736%26fit%3Dcrop&w=1920&q=75"
                      alt="Doubles play"
                      className="w-full h-auto mb-2 rounded-lg"
                    />
                  </div>
                )}
                {sec.id === 'singles' && (
                  <div className="text-gray-700">
                    <p className="mb-2">One player per side, serve from right (even) or left (odd).</p>
                    <img
                      src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2Fe484a29164be270ecc6eec0a1e55548842e36bb7-4931x2769.jpg%3Fauto%3Dformat%26w%3D736%26fit%3Dcrop&w=1920&q=75"
                      alt="Singles play"
                      className="w-full h-auto mb-2 rounded-lg"
                    />
                  </div>
                )}
                {sec.id === 'solo-practice' && (
                  <div className="text-gray-700">
                    <p className="mb-2">Practice solo with a wall, rebound net, or pickleball machine like Erne.</p>
                  </div>
                )}
                {sec.id === 'beginner-tips' && (
                  <div className="text-gray-700">
                    <ul className="list-disc pl-5">
                      <li>Move to NVZ after serve return.</li>
                      <li>Keep paddle up.</li>
                      <li>Use a loose grip on dinks.</li>
                      <li>Avoid wrist flicks.</li>
                      <li>Bend knees.</li>
                      <li>Skip lobs, favor dinks.</li>
                      <li>Be patient with power.</li>
                      <li>Practice drop shots.</li>
                      <li>Serve deep.</li>
                    </ul>
                  </div>
                )}
                {sec.id === 'finding-courts' && (
                  <div className="text-gray-700">
                    <p className="mb-2">Find courts via <a href="https://www.pickleheads.com/search" className="text-blue-600 underline">court finder</a> or local parks.</p>
                    <img
                      src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F27157b53735bb11ead44f0219b7312a167f7a783-1920x1285.jpg%3Fauto%3Dformat%26w%3D736%26fit%3Dcrop&w=1920&q=75"
                      alt="Court location"
                      className="w-full h-auto mb-2 rounded-lg"
                    />
                  </div>
                )}
                {sec.id === 'bottom-line' && (
                  <div className="text-gray-700">
                    <p className="mb-2">Pickleball is fun and simple. Key rules: serve underhand, two-bounce, no NVZ volley, score on serve, call score, win by 2.</p>
                  </div>
                )}
                {sec.id === 'faqs' && (
                  <div className="text-gray-700">
                    <ul className="list-disc pl-5">
                      <li><strong>Similar sport?</strong> Padel.</li>
                      <li><strong>Invented?</strong> 1965 by Pritchard, Bell, McCallum.</li>
                      <li><strong>Courts?</strong> Over 10,000 in the US.</li>
                      <li><strong>Golden rule?</strong> Have fun.</li>
                    </ul>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>

      {/* Find Coach (Sticky Sidebar Right) */}
      <aside className="sticky top-0 mt-15 w-40 p-4 bg-[#ddf7fe] border-l border-gray-200 h-70 overflow-y-auto hidden md:block ml-4 rounded-lg shadow-md">
        <div className="text-center">
          <img
            src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F24c230142f23d51c845cf93e562a5e29a9c8b903-160x160.png&w=128&q=75"
            alt="Coach Icon"
            className="w-16 h-16 mx-auto mb-2"
          />
          <h3 className="text-lg font-bold text-[#162556] mb-2">Learn the basics with a private lesson</h3>
          <p className="text-gray-600 text-sm mb-4"></p>
          <Button>Find a coach</Button>
        </div>
      </aside>
    </div>
  );
}