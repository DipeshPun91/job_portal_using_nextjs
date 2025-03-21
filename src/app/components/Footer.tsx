export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Footer Logo and Description */}
          <div className="footer-col">
            <div className="mb-4">
              <a href="#" className="text-teal-500 text-2xl font-bold">JobHub</a>
            </div>
            <p className="mb-4 text-gray-600">
              Elevate your career with our job portal that connects you with top employers and the latest opportunities.
            </p>
            <ul className="flex gap-4">
              <li><a href="#" className="text-gray-600 hover:text-teal-500"><i className="ri-facebook-fill text-xl"></i></a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-500"><i className="ri-twitter-fill text-xl"></i></a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-500"><i className="ri-linkedin-fill text-xl"></i></a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-500"><i className="ri-pinterest-fill text-xl"></i></a></li>
            </ul>
          </div>

          {/* Services Links */}
          <div className="footer-col">
            <h4 className="text-teal-500 text-xl font-medium mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-teal-500">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-500">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-500">Help Center</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="footer-col">
            <h4 className="text-teal-500 text-xl font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-teal-500">FAQs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-500">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-500">Terms</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="footer-col">
            <h4 className="text-teal-500 text-xl font-medium mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-teal-500">Contact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-500">Cancellation Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-teal-500">Security</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 py-4 text-center text-gray-500 text-sm">
        <p>&copy; 2024 JobHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
