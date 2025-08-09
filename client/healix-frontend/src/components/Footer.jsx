import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="
        bg-white
        shadow-lg
        rounded-t-3xl
        px-8 py-6
        max-w-7xl mx-auto
       mt-0 sm:mt-0 md:-mt-8
        opacity-0 animate-fadeIn
        text-gray-700
      "
      style={{ animationFillMode: "forwards", animationDuration: "1s" }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left section */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-extrabold text-teal-600 mb-2">Healix AI Healthcare</h2>
          <p className="text-sm max-w-sm mx-auto md:mx-0">
            Empowering your health journey with AI-driven insights and personalized care.
          </p>
          <p className="text-xs mt-4 text-gray-400">&copy; {new Date().getFullYear()} Healix. All rights reserved.</p>
        </div>

        {/* Right section: social icons */}
        <div className="flex space-x-6 text-gray-500 hover:text-teal-600 transition-colors duration-300">
          <a href="#" aria-label="Facebook" className="hover:text-teal-700">
            <FaFacebookF size={20} />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-teal-700">
            <FaTwitter size={20} />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-teal-700">
            <FaLinkedinIn size={20} />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-teal-700">
            <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
