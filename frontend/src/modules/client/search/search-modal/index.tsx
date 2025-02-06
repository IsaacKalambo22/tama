import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => React.Dispatch<
    React.SetStateAction<boolean>
  >;
  name: string;
};

const SearchModal = ({
  children,
  isOpen,
  onClose,
  name,
}: Props) => {
  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>{name} </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
