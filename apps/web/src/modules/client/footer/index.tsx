import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Facebook, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { navItems } from "../constants/nav-items"

const Footer = () => {
  return (
    <Card className="w-full min-w-full bg-[#FFFFFF66] max-w-7xl p-8 sm:p-20 shadow-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-2 flex gap-10 flex-col  h-full w-full ">
        <div className="flex gap-2 flex-wrap justify-between w-full">
          {/* Column 1 - Logo and Text */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/images/logo.png"
                alt="logo"
                width={50}
                height={50}
              />
            </Link>
            <p className="my-4 text-gray-600 text-[.9rem] font-sans font-normal">
              Leading farmers to prosperity.
            </p>

            <div className="flex space-x-4">
              <Link
                href="https://x.com/TamaTrust"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="rounded-full" variant="outline" size="icon">
                  <X />
                </Button>
              </Link>

              <Link
                href="https://web.facebook.com/TamaFarmersTrust"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="rounded-full" variant="outline" size="icon">
                  <Facebook />
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-gray-600 text-[.9rem] font-sans font-normal">
              © {new Date().getFullYear()} TAMA Farmers Trust.
            </p>
          </div>

          {/* Column 2 - Tobacco Business Links */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">
              Tobacco Business
            </h3>
            <ul className="flex flex-col gap-3">
              {navItems
                .filter((item) => item.title === "Tobacco Business")
                .map((item) =>
                  item.subMenuItems?.map((subItem) => (
                    <li key={subItem.href}>
                      <Link
                        href={subItem.href}
                        className="text-gray-600 text-[.9rem] font-sans font-normal hover:text-gray-900"
                      >
                        {subItem.title}
                      </Link>
                    </li>
                  ))
                )}
            </ul>
          </div>

          {/* Column 3 - Resources Links */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">News & Updates</h3>
            <ul className="flex flex-col gap-3">
              {navItems
                .filter((item) => item.title === "News & Updates")
                .map((item) =>
                  item.subMenuItems?.map((subItem) => (
                    <li key={subItem.href}>
                      <Link
                        href={subItem.href}
                        className="text-gray-600 text-[.9rem] font-sans font-normal hover:text-gray-900"
                      >
                        {subItem.title}
                      </Link>
                    </li>
                  ))
                )}
            </ul>
          </div>

          {/* Column 4 - Contact Us */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Contact Us</h3>
            <div className="flex flex-col gap-3">
              <address className="text-gray-600">
                TAMA HOUSE, Independence Drive,
                <br />
                P.O. Box 31360, Capital City,
                <br />
                Lilongwe 3, Malawi
              </address>
              <p className="text-gray-600">
                Email:{" "}
                <a
                  href="mailto:tama@tamalawi.com"
                  className="hover:text-gray-900"
                >
                  tama@tamalawi.com
                </a>
              </p>
              <p className="text-gray-600">Phone: 01 773 099</p>
            </div>
          </div>
          {/* Column 4 - Contact Us */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Region Offices</h3>
            <div className="flex flex-col gap-3">
              <address className="text-gray-600">
                Mzuzu P/Bag 95, Mzuzu. Phone: +265 997 752 394
                <br />
              </address>
              <address className="text-gray-600">
                Limbe P.O. Box 51112, Limbe.
                <br />
              </address>
              <address className="text-gray-600">
                Chinkhoma Phone: +265 990 226 850
                <br />
              </address>
              <address className="text-gray-600">
                Mchezi Phone: +265 994 065 062
                <br />
              </address>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-center space-y-2 border-t pt-6 md:flex-row md:space-y-0 md:space-x-1">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} TAMA Farmers Trust. All rights
            reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center space-x-2 text-center">
            Powered by
            <Link
              href="https://infi-tech.net"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary flex items-center"
            >
              <span className="hover:underline px-1"> INFI-TECH INC</span>
            </Link>
          </p>
        </div>
      </div>
    </Card>
  )
}

export default Footer
