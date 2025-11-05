export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-600">
          <p>© 2025 Inventory Manager. All rights reserved.</p>
          <div className="flex gap-4">
            <button className="hover:text-blue-600 transition-colors">
              Privacy
            </button>
            <button className="hover:text-blue-600 transition-colors">
              Terms
            </button>
            <button className="hover:text-blue-600 transition-colors">
              Contact
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
