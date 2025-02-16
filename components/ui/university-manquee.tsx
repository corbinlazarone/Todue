import React from 'react';
import { Marquee } from './manquee';
import Image from 'next/image';

const universities = [
  {
    name: "Pacific Lutheran University",
    logo: "/plu.png"
  },
  {
    name: "University of Southern California",
    logo: "/usc.png"
  },
  {
    name: "University of California, San Diego",
    logo: "/uscd.png"
  },
  {
    name: "University of Toledo",
    logo: "/utoledo.png"
  },
  {
    name: "Dominican University of California",
    logo: "/dominican.jpeg"
  },
  {
    name: "Gettysburg College",
    logo: "/gettysburg.jpeg"
  }
];

export default function UniversityMarquee() {
  const firstRow = universities.slice(0, universities.length / 2);
  const secondRow = universities.slice(universities.length / 2);

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
          Used by students from these universities
        </h2>
        
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((university, index) => (
              <div
                key={index}
                className="mx-8 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200"
              >
                <Image
                  src={university.logo}
                  alt={university.name}
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
            ))}
          </Marquee>
          
          <Marquee reverse pauseOnHover className="[--duration:20s] mt-8">
            {secondRow.map((university, index) => (
              <div
                key={index}
                className="mx-8 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-200"
              >
                <Image
                  src={university.logo}
                  alt={university.name}
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white" />
        </div>
      </div>
    </div>
  );
};