import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import logo from '../../../public/assets/Doclink.png';

const Footer = () => {
  return (
    <footer className="bg-[#007E85] text-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 md:gap-10">
          <div className="col-span-1">
            <img
              src={logo}
              alt="DocLink Logo"
              className="w-32 sm:w-32 md:w-48 mb-2"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-lg sm:text-base md:text-lg">Product</h4>
            <ul className="space-y-2 text-sm sm:text-base md:text-base">
              <li><a href="https://doclink.com/product/features" className="hover:underline">Features</a></li>
              <li><a href="https://doclink.com/product/pricing" className="hover:underline">Pricing</a></li>
              <li><a href="https://doclink.com/product/case-studies" className="hover:underline">Case studies</a></li>
              <li><a href="https://doclink.com/product/reviews" className="hover:underline">Reviews</a></li>
              <li><a href="https://doclink.com/product/updates" className="hover:underline">Updates</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-lg sm:text-base md:text-lg">Company</h4>
            <ul className="space-y-2 text-sm sm:text-base md:text-base">
              <li><a href="https://doclink.com/company/about" className="hover:underline">About</a></li>
              <li><a href="https://doclink.com/company/contact" className="hover:underline">Contact us</a></li>
              <li><a href="https://doclink.com/company/careers" className="hover:underline">Careers</a></li>
              <li><a href="https://doclink.com/company/culture" className="hover:underline">Culture</a></li>
              <li><a href="https://doclink.com/company/blog" className="hover:underline">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-lg sm:text-base md:text-lg">Support</h4>
            <ul className="space-y-2 text-sm sm:text-base md:text-base">
              <li><a href="https://doclink.com/support/getting-started" className="hover:underline">Getting started</a></li>
              <li><a href="https://doclink.com/support/help-center" className="hover:underline">Help center</a></li>
              <li><a href="https://doclink.com/support/server-status" className="hover:underline">Server status</a></li>
              <li><a href="https://doclink.com/support/report-bug" className="hover:underline">Report a bug</a></li>
              <li><a href="https://doclink.com/support/chat" className="hover:underline">Chat support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2 sm:mb-3 text-lg sm:text-base md:text-lg">Follow us</h4>
            <ul className="space-y-2 text-sm sm:text-base md:text-base">
              <li className="flex items-center">
                <a href="https://facebook.com/doclink" className="flex items-center hover:underline">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </a>
              </li>
              <li className="flex items-center">
                <a href="https://twitter.com/doclink" className="flex items-center hover:underline">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </a>
              </li>
              <li className="flex items-center">
                <a href="https://instagram.com/doclink" className="flex items-center hover:underline">
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </a>
              </li>
              <li className="flex items-center">
                <a href="https://linkedin.com/company/doclink" className="flex items-center hover:underline">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
              </li>
              <li className="flex items-center">
                <a href="https://youtube.com/doclink" className="flex items-center hover:underline">
                  <Youtube className="w-4 h-4 mr-2" />
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="mt-6 sm:mt-8 border-white/30" />

        <div className="pt-4 sm:pt-6 text-center">
          <p className="text-sm sm:text-base md:text-base">Copyright © 2022 BRIX Templates</p>
          <p className="text-sm sm:text-base md:text-base">All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;