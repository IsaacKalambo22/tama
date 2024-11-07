import { Accordion } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import FAQAccordionItem from '../faqaccordion-content';

export function FrequentlyAskedQuestions() {
  return (
    <Card className='shadow-none p-8 w-full flex flex-col gap-8 '>
      <Accordion
        type='multiple'
        className='w-full'
      >
        <div className='flex flex-col gap-4'>
          <span className='green_subtitle text-center font-bold text-lg md:text-xl lg:text-2xl mb-4'>
            Frequently Asked Questions
          </span>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <FAQAccordionItem
              value='item-1'
              question='How Do I become a TAMA Farmers Trust member?'
              answer={
                <>
                  TAMA Farmers Trust membership is
                  voluntary and renews annually
                  for tobacco growers. To become a
                  member, a grower (whether
                  small-scale, medium, or
                  corporate) must register with
                  the Tobacco Commission (TC) for
                  the following year&apos;s
                  production. The TC registration
                  form asks for the grower&apos;s
                  association, where TAMA should
                  be written. This officially
                  registers the grower as a
                  member, entitling them to
                  TAMA&apos;s services, including
                  advocacy and tobacco sales
                  representation. Membership
                  extends to the club and its
                  registered members or estate
                  (including managers). Members
                  are also encouraged to diversify
                  their crops, with TAMA assisting
                  in marketing these products both
                  within Malawi and
                  internationally.
                </>
              }
            />
            <FAQAccordionItem
              value='item-2'
              question='What are the benefits of TAMA Farmers Trust membership?'
              answer={
                <ul className='list-disc pl-5'>
                  <li>
                    Production and marketing of
                    tobacco and non-tobacco
                    commodities
                  </li>
                  <li>
                    Satellite Depot Operations
                  </li>
                  <li>Hessian Operations</li>
                  <li>
                    Transportation Brokerage
                  </li>
                  <li>
                    International (ITGA) and Local
                    Representation
                  </li>
                  <li>
                    Advocacy (Local &
                    International)
                  </li>
                  <li>
                    Supporting of Cooperative
                    Businesses
                  </li>
                  <li>
                    Agro-dealership services
                  </li>
                  <li>
                    Child Labour Prevention &
                    Protection
                  </li>
                  <li>
                    Marketing of member products
                    within and outside Malawi
                  </li>
                </ul>
              }
            />
            <FAQAccordionItem
              value='item-3'
              question='How does TAMA protect farmers?'
              answer='Tobacco production is not easy but there are other unscrupulous individuals and groups of people who just want to reap heavily ignoring the producer. This is the time TAMA comes in to aid so that the producer earns what he or she deserves through a win-win protocol.'
            />
            <FAQAccordionItem
              value='item-4'
              question='Do I have to also register with Tobacco Commission?'
              answer='Yes, all growers are encouraged to register with TCC and endorse TAMA as their Association. Members of the association benefit from the association’s services on both local and international fronts.'
            />
          </div>
        </div>
      </Accordion>
    </Card>
  );
}
