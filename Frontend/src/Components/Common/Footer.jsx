import React from 'react';
import logo from '../../../public/assets/logo-transparent.png'

const Footer = () => {
  return (
    <footer className="bg-[#007E85] text-white py-4 px-4 sm:px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
        <div className="col-span-1">
          <p className='text-3xl sm:text-2xl font-bold'>DOCLINK</p>
          <p className="text-xs sm:text-sm">Copyright © 2022 BRIX Templates<br />All Rights Reserved</p>
        </div>

        <div>
          <h4 className="font-semibold mb-1 sm:mb-2 text-base sm:text-sm">Product</h4>
          <ul className="space-y-1 text-xs sm:text-sm">
            <li>Features</li>
            <li>Pricing</li>
            <li>Case studies</li>
            <li>Reviews</li>
            <li>Updates</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-1 sm:mb-2 text-base sm:text-sm">Company</h4>
          <ul className="space-y-1 text-xs sm:text-sm">
            <li>About</li>
            <li>Contact us</li>
            <li>Careers</li>
            <li>Culture</li>
            <li>Blog</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-1 sm:mb-2 text-base sm:text-sm">Support</h4>
          <ul className="space-y-1 text-xs sm:text-sm">
            <li>Getting started</li>
            <li>Help center</li>
            <li>Server status</li>
            <li>Report a bug</li>
            <li>Chat support</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-1 sm:mb-2 text-base sm:text-sm">Follow us</h4>
          <ul className="space-y-1 text-xs sm:text-sm">
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
            <li>LinkedIn</li>
            <li>YouTube</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;