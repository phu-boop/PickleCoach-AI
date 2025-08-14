import React from 'react';

const BookingPackages = ({ handleCreateSession, coachLevel }) => {
    // Base prices for BEGINNER level (in VND)
    const basePrices = {
        basic: 2000000,
        advanced: 3500000,
        pro: 6500000,
    };

    // Price multipliers based on coach level
    const priceMultipliers = {
        BEGINNER: 1.0,
        INTERMEDIATE: 1.2, // 20% increase
        ADVANCED: 1.4,    // 40% increase
    };

    // Format price as VND
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    // Calculate prices based on coach level
    const multiplier = priceMultipliers[coachLevel] || priceMultipliers.BEGINNER;
    const packages = [
        {
            title: 'Basic Package - 5 Sessions',
            price: formatPrice(basePrices.basic * multiplier),
            description: 'A 5-session package with a personal coach, ideal for beginners looking to get started with pickleball. Each session lasts 1 hour, including basic technique instruction and practice.',
            features: [
                'Learn paddle grip and ball striking',
                'Basic movement guidance',
                '1-hour sessions, flexible scheduling',
            ],
            pakage:"PAKAGE_5SESION",
            popular: false,
        },
        {
            title: 'Advanced Package - 10 Sessions',
            price: formatPrice(basePrices.advanced * multiplier),
            description: 'A 10-session in-depth package for players aiming to improve skills and tactics. Each 1-hour session includes professional coaching and technique analysis.',
            features: [
                'Singles and doubles strategy training',
                'Video-based technique analysis (if available)',
                'Personalized scheduling support',
            ],
            pakage:"PAKAGE_10SESION",
            popular: true,
        },
        {
            title: 'Pro Package - 20 Sessions',
            price: formatPrice(basePrices.pro * multiplier),
            description: 'A 20-session package for players targeting professional-level skills. Includes advanced tactics, match practice, and progress tracking.',
            features: [
                'Advanced match tactics',
                'Practice with competitive matches',
                'Progress tracking and evaluation',
            ],
            pakage:"PAKAGE_20SESION",
            popular: false,
        },
    ];

    return (
        <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-14">
                    <h2 className="text-4xl font-extrabold text-gray-900">
                        Our Training Packages
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Choose the perfect package for your pickleball journey with a {coachLevel} coach
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                    {packages.map((pkg, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl shadow-lg overflow-hidden bg-white transition-all duration-300 ease-out transform hover:-translate-y-2 hover:shadow-2xl ${
                                pkg.popular ? 'ring-2 ring-teal-500 scale-[1.02]' : 'ring-1 ring-gray-200'
                            }`}
                        >
                            {pkg.popular && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-teal-500 to-green-400 text-white text-xs font-semibold px-4 py-1 transform translate-x-2 -translate-y-2 rotate-12 shadow-md rounded-full">
                                    ⭐ Most Popular
                                </div>
                            )}
                            <div className="px-8 py-10">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{pkg.title}</h3>
                                <p className="text-4xl font-extrabold text-teal-600 mb-5">{pkg.price}</p>
                                <p className="text-gray-600 mb-6 leading-relaxed">{pkg.description}</p>

                                <ul className="space-y-3 mb-8">
                                    {pkg.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <svg
                                                className="flex-shrink-0 w-5 h-5 text-teal-500 mt-0.5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleCreateSession(pkg)}
                                    className={`w-full px-6 py-3 rounded-lg font-medium shadow-md transform transition-all duration-300 ease-in-out ${
                                        pkg.popular
                                            ? 'bg-gradient-to-r from-teal-600 to-green-500 hover:from-teal-700 hover:to-green-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-teal-600'
                                    }`}
                                >
                                    Select Package
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BookingPackages;