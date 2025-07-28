import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card } from "@/components/ui/card"

export default function CustomFaq() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Accordion type="single" collapsible className="w-full">
        <Card className="p-8 rounded-2xl shadow-none">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-[1rem] font-semibold text-gray-700 hover:text-green-600 transition hover:no-underline">
              How Do I become a TAMA Farmers Trust member?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 mt-4 text-sm leading-relaxed">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>
                    TAMA Farmers Trust membership is voluntary and renews
                    annually for tobacco growers
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>
                    Growers (small-scale, medium, or corporate) must register
                    with the Tobacco Commission (TC) for the following year's
                    production
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>
                    Write "TAMA" in the association field on the TC registration
                    form
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>
                    Registration entitles growers to TAMA's services, including
                    advocacy and tobacco sales representation
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>
                    Membership extends to the club and its registered members or
                    estate (including managers)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>
                    TAMA assists members in crop diversification and marketing
                    both within Malawi and internationally
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-[1rem] font-semibold text-gray-700 hover:text-green-600 transition hover:no-underline">
              What are the benefits of TAMA Farmers Trust membership?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 mt-4 text-sm leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>
                    Production and marketing of tobacco and non-tobacco
                    commodities
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>Satellite Depot Operations</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>Hessian Operations</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>Transportation Brokerage</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>International and Local Representation</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>Advocacy (Local & International)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>Supporting of Cooperative Businesses</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>Agro-dealership services</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>Child Labour Prevention & Protection</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>Forced Labour Prevention & Protection</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>Marketing of member products within and outside Malawi</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-[1rem] font-semibold text-gray-700 hover:text-green-600 transition hover:no-underline">
              How does TAMA protect farmers?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 mt-4 text-sm leading-relaxed">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>
                    Protects farmers from unscrupulous individuals and groups
                    who aim to exploit them
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>
                    Ensures farmers receive fair compensation through a win-win
                    protocol
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>
                    Protects farmers' livelihoods and secures equitable market
                    opportunities
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-[1rem] font-semibold text-gray-700 hover:text-green-600 transition hover:no-underline">
              Do I have to also register with Tobacco Commission?
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 mt-4 text-sm leading-relaxed">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>
                    Yes, all growers are encouraged to register with Tobacco
                    Commission
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>Endorse TAMA as your Association during registration</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 text-[1rem]">✔</span>
                  <p>
                    Members benefit from the association's services on both
                    local and international fronts
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Card>
      </Accordion>
    </div>
  )
}
