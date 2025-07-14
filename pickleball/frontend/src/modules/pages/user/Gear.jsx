
import React, { useState } from 'react';
import Button from '../../../components/Button';
import { useInView } from 'react-intersection-observer';

const sections = [
  { id: 'best-in-2025', title: 'Best in 2025', isMainHeading: true },
  { id: 'best-overall', title: 'Best overall', parentId: 'best-in-2025' },
  { id: 'best-pro-net', title: 'Best pro net', parentId: 'best-in-2025' },
  { id: 'best-cheap', title: 'Best cheap', parentId: 'best-in-2025' },
  { id: 'best-on-wheels', title: 'Best on wheels', parentId: 'best-in-2025' },
  { id: 'best-outdoor', title: 'Best outdoor', parentId: 'best-in-2025' },
  { id: 'best-set', title: 'Best set', parentId: 'best-in-2025' },
  { id: 'how-to-choose', title: 'How to choose' },
  { id: 'why-get-one', title: 'Why get one?' },
  { id: 'bottom-line', title: 'Bottom line' },
  { id: 'faqs', title: 'FAQs' },
];

export default function Gear() {
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
                className={`hover:underline transition-colors duration-300 ${sec.isMainHeading ? 'text-[#01b6e4] text-base' : (sec.parentId ? 'ml-4' : '')} ${activeSection === sec.id ? 'text-blue-700' : ''}`}
                style={sec.isMainHeading ? { fontWeight: 'bold' } : {}}
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
          <h1 className="text-3xl font-bold text-[#162556] mb-4">Best pickleball net in 2025 – 6 picks to play anywhere</h1>
          <div className="flex items-center mb-4">
            <img
              src="https://www.pickleheads.com/assets/logo-lockup.svg"
              alt="Author"
              className="w-10 h-10 rounded-full mr-2"
            />
            <div>
              <p className="text-sm text-gray-600">Brandon Mackie</p>
              <p className="text-sm text-gray-500">Updated on: Mar 9, 2025</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Over 75% of the courts on Pickleheads don’t have a permanent pickleball net,
            so having your own is often necessary to play. Whether you’re looking for a
            portable net for personal use or a professional net for your pickleball
            facility, you’ve come to the right place.
          </p>
          <p className="text-gray-700 mb-4">
            I’ve ranked the best pickleball nets in 2025 to get you started. Some are
            portable for quick assembly at a court, while others are portable with wheels for
            tournament organizers or mixed-use facilities. I’ve also picked a semi-permanent
            net for anyone building a dedicated pickleball facility.
          </p>
          <p className="text-gray-700 mb-4">
            Read on to see why the SwiftNet 2.1, JOOLA Pro Net, and ZENY are some of the
            best pickleball nets you can buy today.
          </p>

          {/* New Section: Best pickleball nets at a glance */}
          <section id="best-nets-at-a-glance" className="scroll-mt-16 mb-8">
            <h2 className="text-2xl font-bold text-[#162556] mb-2">Best pickleball nets at a glance</h2>
            <div className="text-gray-700 mb-4">
              <p className="text-sm text-gray-500 italic mb-2">Note: our discount codes may be subject to change when products are on sale. Check the final price at checkout.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Best overall */}
                <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <p className="text-xs font-semibold text-[#01b6e4] mb-2">Best overall</p>
                  <img src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F2c7be1ae56ba9152fccce6482ea316436e3628a0-640x640.jpg%3Fauto%3Dformat%26w%3D380%26h%3D380%26fit%3Dcrop&w=1920&q=75" alt="SwiftNet 2.1 Portable Net" className="w-full h-auto mb-2 rounded-lg" />
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-[#162556] mb-1">SwiftNet 2.1 Portable Net</h3>
                  <p className="text-sm text-gray-700 mb-3">The SwiftNet 2.1 is the best pickleball net on the market because it’s the lightest, fastest to assemble, and performs like a permanent net even though it’s portable.</p>
                  <a href="#" className="block bg-[#01b6e4] text-white py-2 px-4 rounded-md text-center text-sm font-semibold mb-2 hover:bg-opacity-90 transition-colors"><span>$369.99 at Pickleball Central</span></a>
                  <a href="#" className="block bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-center text-sm font-semibold hover:bg-gray-300 transition-colors"><span>$369.99 at Amazon</span></a>
                  <a href="#" className="block text-blue-600 underline text-sm mt-2">Read my deep dive ↓</a>
                </div>

                {/* Best pro net */}
                <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <p className="text-xs font-semibold text-[#01b6e4] mb-2">Best pro net</p>
                  <img src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F043bf80564aab74705e122d3b1470407a9b48ee5-850x850.webp%3Fauto%3Dformat%26w%3D380%26h%3D380%26fit%3Dcrop&w=1920&q=75" alt="JOOLA Pro Pickleball Net" className="w-full h-auto mb-2 rounded-lg" />
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < 4.5 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-[#162556] mb-1">JOOLA Pro Pickleball Net</h3>
                  <p className="text-sm text-gray-700 mb-3">This heavy-duty JOOLA net is great for tournaments and events. It's the closest you'll find to a pro-level net right now because it plays like a permanent net.</p>
                  <a href="#" className="block bg-[#01b6e4] text-white py-2 px-4 rounded-md text-center text-sm font-semibold mb-2 hover:bg-opacity-90 transition-colors"><span>$2200 at JOOLA</span></a>
                  <a href="#" className="block bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-center text-sm font-semibold mb-2 hover:bg-gray-300 transition-colors"><span>$2200 at Pickleball W...</span></a>
                  <a href="#" className="block bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-center text-sm font-semibold hover:bg-gray-300 transition-colors"><span>$2178 at Amazon</span></a>
                  <a href="#" className="block text-blue-600 underline text-sm mt-2">Read my deep dive ↓</a>
                </div>

                {/* Best cheap */}
                <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <p className="text-xs font-semibold text-[#01b6e4] mb-2">Best cheap</p>
                  <img src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F5fce832ffd45984f968a52eb7f4205e65efbf095-1500x1117.jpg%3Fauto%3Dformat%26w%3D380%26h%3D380%26fit%3Dcrop&w=1920&q=75" alt="ZENY Portable Pickleball Net Set System" className="w-full h-auto mb-2 rounded-lg" />
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-[#162556] mb-1">ZENY Portable Pickleball Net Set System</h3>
                  <p className="text-sm text-gray-700 mb-3">The ZENY Portable Pickleball Net is the best full-size net for under $100. It's only 18 lbs and super easy to set up.</p>
                  <a href="#" className="block bg-[#01b6e4] text-white py-2 px-4 rounded-md text-center text-sm font-semibold mb-2 hover:bg-opacity-90 transition-colors"><span>$58.99 at Amazon</span></a>
                  <a href="#" className="block text-blue-600 underline text-sm mt-2">Read my deep dive ↓</a>
                </div>
              </div>
            </div>
          </section>
          {/* End New Section */}

          {sections.map((sec) => {
            const { ref, inView } = useInView({
              threshold: 0.5,
              onChange: (inView) => updateActiveSection(sec.id, inView),
            });

            // Render content based on section ID
            switch (sec.id) {
              case 'best-overall':
                return (
                  <section key={sec.id} id={sec.id} ref={ref} className="scroll-mt-16 mb-8">
                    <h2 className="text-2xl font-bold text-[#162556] mb-2">{sec.title}: SwiftNet 2.1 Portable Net</h2>
                    <div className="text-gray-700">
                      <img
                        src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F6200c738c8cf2d432110b524db3cda137a0ff489-800x600.png%3Fauto%3Dformat%26w%3D736&w=1920&q=75"
                        alt="SwiftNet 2.1 Portable Net"
                        className="w-full h-auto mb-4 rounded-lg"
                      />
                      <p className="mb-2">The SwiftNet 2.1 is the best pickleball net on the market because it beats all the competition with its blend of weight, setup time, durability, quality, and price. Plus, it has advanced features that make it play like a permanent net.</p>
                      <p className="mb-2">The newly redesigned SwiftNet 2.1 is great for portability. Permanent nets are the most popular among players because most courts don’t have permanent nets, meaning you’ll have to bring your own.</p>
                      <p className="font-bold mt-4 mb-2">Key Features:</p>
                      <ul className="list-disc pl-5 mb-2">
                        <li><strong>Weight:</strong> 17 lbs</li>
                        <li><strong>Wheels:</strong> No</li>
                        <li><strong>Carry Bag:</strong> Yes, with long straps</li>
                        <li><strong>Dimensions:</strong> 22' wide, 36" at posts, and 34" high</li>
                        <li><strong>Indoor Or Outdoor:</strong> Both</li>
                        <li><strong>Frame:</strong> Aluminum</li>
                      </ul>
                      <p className="font-bold mt-4 mb-2">Performance Ratings:</p>
                      <ul className="list-disc pl-5 mb-2">
                        <li><strong>Durability:</strong> 8/10</li>
                        <li><strong>Ease of use:</strong> 9/10</li>
                        <li><strong>Portability:</strong> 10/10</li>
                      </ul>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <a href="#" className="bg-[#01b6e4] text-white py-2 px-4 rounded-md text-center text-sm font-semibold hover:bg-opacity-90 transition-colors">Buy at Pickleball Central ($369.99)</a>
                        <a href="#" className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-center text-sm font-semibold hover:bg-gray-300 transition-colors">Buy at Amazon ($369.99)</a>
                      </div>
                    </div>
                  </section>
                );
              case 'best-pro-net':
                return (
                  <section key={sec.id} id={sec.id} ref={ref} className="scroll-mt-16 mb-8">
                    <h2 className="text-2xl font-bold text-[#162556] mb-2">{sec.title}: JOOLA Pro Pickleball Net</h2>
                    <div className="text-gray-700">
                      <img
                        src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F57661a5bac59d9e7b6e195ea944682e51b443653-4240x2832.webp%3Fauto%3Dformat%26w%3D736&w=1920&q=75"
                        alt="JOOLA Pro Pickleball Net"
                        className="w-full h-auto mb-4 rounded-lg"
                      />
                      <p className="mb-2">This heavy-duty JOOLA net is great for tournaments and events. It's the closest you'll find to a pro-level net right now because it plays like a permanent net.</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <a href="#" className="bg-[#01b6e4] text-white py-2 px-4 rounded-md text-center text-sm font-semibold hover:bg-opacity-90 transition-colors">Buy at JOOLA ($2200)</a>
                        <a href="#" className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-center text-sm font-semibold hover:bg-gray-300 transition-colors">Buy at Pickleball W... ($2200)</a>
                        <a href="#" className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-center text-sm font-semibold hover:bg-gray-300 transition-colors">Buy at Amazon ($2178)</a>
                      </div>
                    </div>
                  </section>
                );
              case 'best-cheap':
                return (
                  <section key={sec.id} id={sec.id} ref={ref} className="scroll-mt-16 mb-8">
                    <h2 className="text-2xl font-bold text-[#162556] mb-2">{sec.title}: ZENY Portable Pickleball Net Set System</h2>
                    <div className="text-gray-700">
                      <img
                        src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2Fa0210e61e54edc4d3b60c97647db3ef3e1baffd0-4240x2832.webp%3Fauto%3Dformat%26w%3D736&w=1920&q=75"
                        alt="ZENY Portable Pickleball Net Set System"
                        className="w-full h-auto mb-4 rounded-lg"
                      />
                      <p className="mb-2">The ZENY Portable Pickleball Net is the best full-size net for under $100. It's only 18 lbs and super easy to set up.</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <a href="#" className="bg-[#01b6e4] text-white py-2 px-4 rounded-md text-center text-sm font-semibold hover:bg-opacity-90 transition-colors">Buy at Amazon ($58.99)</a>
                      </div>
                    </div>
                  </section>
                );
              case 'best-in-2025':
                // This is a main heading and doesn't have direct content
                return null;
              default:
                // Placeholder for sections without specific content provided
                return (
                  <section key={sec.id} id={sec.id} ref={ref} className="scroll-mt-16 mb-8">
                    {sec.isMainHeading && <h2 className="text-2xl font-bold text-[#162556] mb-2">{sec.title}</h2>}
                    {!sec.isMainHeading && !sec.parentId && <h2 className="text-2xl font-bold text-[#162556] mb-2">{sec.title}</h2>}
                    <div className="text-gray-700">
                      <p className="mb-2">Content for {sec.title} goes here. (Currently placeholder, as specific content related to pickleball nets was not provided for this section.)</p>
                    </div>
                  </section>
                );
            }
          })}
        </div>
      </main>

      {/* Find Paddle (Sticky Sidebar Right) */}
      <aside className="sticky top-0 mt-15 w-40 p-4 bg-white border-l border-gray-200 h-fit overflow-y-auto hidden md:block ml-4 rounded-lg shadow-md">
        <div className="flex flex-col items-center p-4"> {/* Adjusted to use flexbox and center items */}
          <img
            alt="illustration of a pickleball paddle"
            loading="lazy"
            width="80"
            height="80"
            decoding="async"
            data-nimg="1"
            src="https://www.pickleheads.com/images/duotone-icons/paddle.svg"
            style={{ color: 'transparent', margin: '0 auto', display: 'block' }}
          />
          <p className="text-sm text-gray-700 text-center mt-2">Find the right paddle for your game</p> {/* Adjusted class names */}
          <a className="block text-center bg-[#01b6e4] text-white py-2 px-4 rounded-md text-sm font-semibold mt-4 hover:bg-opacity-90 transition-colors" href="/quiz" target="_blank">Take the Quiz</a>
        </div>
      </aside>
    </div>
  );
}