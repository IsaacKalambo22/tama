import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQAccordionItemProps {
  value: string;
  question: string;
  answer: string | React.ReactNode;
}

const FAQAccordionItem = ({
  value,
  question,
  answer,
}: FAQAccordionItemProps) => {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className='no-underline hover:no-underline text-[1.1rem] leading-tight'>
        {question}
      </AccordionTrigger>
      <AccordionContent className='text-muted-foreground leading-tight text-[1rem]'>
        {answer}
      </AccordionContent>
    </AccordionItem>
  );
};

export default FAQAccordionItem;
