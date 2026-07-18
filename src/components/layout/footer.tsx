import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "@esmate/shadcn/pkgs/lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#f4f1e8] border-t border-[#d8a928]/30">
      <div className="w-full px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand / Logo */}
          <div className="space-y-4">
            <Link href="/" className="-m-1.5 p-1.5 block">
              <span className="sr-only">MM Laptop Center</span>
              <Image
                src="/logo/mmlaptop.png"
                alt="MM Laptop Center"
                width={150}
                height={150}
                className="max-w-[150px] h-auto"
              />
            </Link>

            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              Your Trusted Tech Destination — premium laptops, gaming gear, and accessories with genuine warranty support.
            </p>

            <div className="flex space-x-4">
              <Link href="#" className="text-[#d8a928] hover:text-[#b57910] transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-[#d8a928] hover:text-[#b57910] transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-[#d8a928] hover:text-[#b57910] transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Shop</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li>
                <Link href="/collections" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/gaming-laptops" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Gaming Laptops
                </Link>
              </li>
              <li>
                <Link href="/category/business-laptops" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Business Laptops
                </Link>
              </li>
              <li>
                <Link href="/category/accessories" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/collections/hot-deals" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Hot Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900">Customer Care</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li>
                <Link href="/admin/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Contact Us
                </Link>
              </li>
              
              <li>
                <Link href="/about-us" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900 mb-4">Contact Us</h3>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#d8a928] shrink-0" />
                <span>Sardheri Bazar Charsadda Mardan Road KPK Pakistan | All Pakistan delivery available</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#d8a928] shrink-0" />
                <span>+92 304 8928282</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#d8a928] shrink-0" />
                <span>info.mmlaptopcenter@gmail.com</span>
              </div>
              <div className="pt-2">
                <span className="text-xs text-gray-500">Founder: Mudassir Meer</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#d8a928]/30 pt-8">
          <p className="text-center text-xs leading-5 text-gray-600">
            &copy; {new Date().getFullYear()} MM Laptop Center. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
