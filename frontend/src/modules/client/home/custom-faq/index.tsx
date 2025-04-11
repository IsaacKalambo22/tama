import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';

export function CustomFaq() {
  return (
    <Accordion
      type='single'
      collapsible
      className='w-full'
    >
      <Card className='p-8 rounded-2xl shadow-none'>
        <AccordionItem value='item-1'>
          <AccordionTrigger className='text-[1rem] font-semibold text-gray-700 hover:text-green-600 transition hover:no-underline'>
            How Do I become a TAMA Farmers Trust
            member?
          </AccordionTrigger>
          <AccordionContent className='text-gray-700 mt-4 text-sm leading-relaxed'>
            TAMA Farmers Trust membership is
            voluntary and renews annually for
            tobacco growers.
            <br />
            To become a member, a grower (whether
            small-scale, medium, or corporate)
            must register with the Tobacco
            Commission (TC) for the following
            year&apos;s production.
            <br />
            The TC registration form asks for the
            grower&apos;s association, where TAMA
            should be written. This officially
            registers the grower as a member,
            entitling them to TAMA&apos;s
            services, including advocacy and
            tobacco sales representation.
            <br />
            Membership extends to the club and its
            registered members or estate
            (including managers).
            <br />
            Members are also encouraged to
            diversify their crops, with TAMA
            assisting in marketing these products
            both within Malawi and
            internationally.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='item-2'>
          <AccordionTrigger className='text-[1rem] font-semibold text-gray-700 hover:text-green-600 transition hover:no-underline'>
            What are the benefits of TAMA Farmers
            Trust membership?
          </AccordionTrigger>
          <AccordionContent className='text-gray-700 mt-4 text-sm leading-relaxed'>
            Membership offers several benefits,
            including:
            <div className='mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='flex items-start gap-3'>
                <span className='text-green-500 text-[1rem]'>
                  ✔
                </span>
                <p>
                  Production and marketing of
                  tobacco and non-tobacco
                  commodities
                </p>
              </div>
              <div className='flex items-start gap-3'>
                <span className='text-green-500 text-[1rem]'>
                  ✔
                </span>
                <p>Satellite Depot Operations</p>
              </div>
              <div className='flex items-start gap-3'>
                <span className='text-green-500 text-[1rem]'>
                  ✔
                </span>
                <p>Hessian Operations</p>
              </div>
              <div className='flex items-start gap-3'>
                <span className='text-green-500 text-[1rem]'>
                  ✔
                </span>
                <p>Transportation Brokerage</p>
              </div>
              <div className='flex items-start gap-3'>
                <span className='text-green-500 text-[1rem]'>
                  ✔
                </span>
                <p>
                  International and Local
                  Representation
                </p>
              </div>
              <div className='flex items-start gap-3'>
                <span className='text-green-500 text-[1rem]'>
                  ✔
                </span>
                <p>
                  Advocacy (Local & International)
                </p>
              </div>
              <div className='flex items-start gap-3'>
                <span className='text-green-500 text-[1rem]'>
                  ✔
                </span>
                <p>
                  Supporting of Cooperative
                  Businesses
                </p>
              </div>
              <div className='flex items-start gap-3'>
                <span className='text-green-500 text-[1rem]'>
                  ✔
                </span>
                <p>Agro-dealership services</p>
              </div>
              <div className='flex items-start gap-3'>
                <span className='text-green-500 text-[1rem]'>
                  ✔
                </span>
                <p>
                  Child Labour Prevention &
                  Protection
                </p>
              </div>
              <div className='flex items-start gap-3'>
                <span className='text-green-500 text-[1rem]'>
                  ✔
                </span>
                <p>
                  False Labour Prevention &
                  Protection
                </p>
              </div>
              <div className='flex items-start gap-3'>
                <span className='text-green-500 text-[1rem]'>
                  ✔
                </span>
                <p>
                  Marketing of member products
                  within and outside Malawi
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='item-3'>
          <AccordionTrigger className='text-[1rem] font-semibold text-gray-700 hover:text-green-600 transition hover:no-underline'>
            How does TAMA protect farmers?
          </AccordionTrigger>
          <AccordionContent className='text-gray-700 mt-4 text-sm leading-relaxed'>
            Tobacco production is not easy, and
            some unscrupulous individuals and
            groups aim to exploit farmers.
            <br />
            TAMA steps in to ensure farmers
            receive fair compensation through a
            win-win protocol, protecting their
            livelihoods and securing equitable
            market opportunities.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value='item-4'>
          <AccordionTrigger className='text-[1rem] font-semibold text-gray-700 hover:text-green-600 transition hover:no-underline'>
            Do I have to also register with
            Tobacco Commission?
          </AccordionTrigger>
          <AccordionContent className='text-gray-700 mt-4 text-sm leading-relaxed'>
            Yes, all growers are encouraged to
            register with Tobacco Commission and
            endorse TAMA as their Association.
            <br />
            Members of the association benefit
            from the association’s services on
            both local and international fronts.
          </AccordionContent>
        </AccordionItem>
      </Card>
    </Accordion>
  );
}
