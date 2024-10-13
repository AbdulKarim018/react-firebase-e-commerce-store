import React from "react";
import Package from "../assets/package.webp";
import support from "../assets/support.webp";
import trophy from "../assets/trophy.webp";
import warranty from "../assets/warranty.webp";

export default function Footer() {
  return (
    <footer className="max-w-8xl container mx-auto bg-white p-8 text-gray-900">
      <div className="mb-8 mt-8 bg-[#fbf1e7] p-16 pb-12">
        <div className="flex max-md:flex-col max-md:gap-8 md:justify-evenly">
          <div className="flex items-center">
            <img src={trophy} alt="" className="h-12 w-12" />
            <div className="ml-4 flex flex-col">
              <span className="text-[16px] font-extrabold text-black">
                High Quality
              </span>
              <span className="text-[16px] text-[#5e7da3]">
                Crafted from top materials
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <img src={warranty} alt="" className="h-12 w-12" />
            <div className="ml-4 flex flex-col">
              <span className="text-[16px] font-extrabold text-black">
                Warranty Protection
              </span>
              <span className="text-[16px] text-[#5e7da3]">Over 2 years</span>
            </div>
          </div>

          <div className="flex items-center">
            <img src={Package} alt="" className="h-12 w-12" />
            <div className="ml-4 flex flex-col">
              <span className="text-[16px] font-extrabold text-black">
                Free Shipping
              </span>
              <span className="text-[16px] text-[#5e7da3]">
                Order over 150 $
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <img src={support} alt="" className="h-12 w-12" />
            <div className="ml-4 flex flex-col">
              <span className="text-[16px] font-extrabold text-black">
                24/7 Support
              </span>
              <span className="text-[16px] text-[#5e7da3]">
                Dedicated support
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-wrap justify-between">
        <div className="mb-4 w-full md:w-1/4">
          <h3 className="mb-4 text-xl font-bold">Furniro</h3>
          <p>400 University Drive Suite 200</p>
          <p>Coral Gables, FL 33134 USA</p>
        </div>

        <div className="mb-4 w-full md:w-1/4">
          <h3 className="mb-4 text-xl font-bold">Links</h3>
          <ul className="space-y-6">
            <li>
              <a href="#" className="hover:text-gray-600">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-600">
                Shop
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-600">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-600">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div className="mb-4 w-full md:w-1/4">
          <h3 className="mb-4 text-xl font-bold">Home</h3>
          <ul className="space-y-6">
            <li>
              <a href="#" className="hover:text-gray-600">
                Payment Options
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-600">
                Returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-600">
                Privacy Policies
              </a>
            </li>
          </ul>
        </div>

        <div className="mb-4 w-full md:w-1/4">
          <h3 className="mb-4 text-xl font-bold">Newsletter</h3>
          <p>Enter Your Email Address</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              placeholder="Your Email"
              className="flex-1 rounded-l border-b border-black bg-transparent p-2 text-gray-900 focus:border-b-4 focus:outline-none"
            />
            <button className="rounded-r border-b-3 border-black bg-white p-2 font-bold text-black hover:bg-gray-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-400 pl-2 pt-4 text-left">
        <p>&copy; 2024 Furniro. All rights reserved.</p>
      </div>
    </footer>
  );
}
