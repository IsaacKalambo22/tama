'use client';

import { Button } from '@/components/ui/button';
import ModalNewBlog from '@/modules/admin/blog/modal-new-blog';
import ModalNewForm from '@/modules/admin/forms-documents/modal-new-form';
import ModalNewCouncilList from '@/modules/admin/modal-new-council-list';
import ModalNewPublication from '@/modules/admin/modal-new-publication';
import ModalNewNews from '@/modules/admin/news/modal-new-news';
import ModalNewShop from '@/modules/admin/shop/modal-new-shop';
import { PlusSquare } from 'lucide-react';
import { ReactElement, useState } from 'react';

export enum AddNewType {
  NEW_FORM = 'New Form',
  NEW_REPORT_OR_PUBLICATION = 'New Report or Publication',
  NEW_SHOP = 'New Shop',
  NEW_BLOG = 'New Blog',
  ADD_NEWS = 'Add News',
  NEW_COUNCIL_LIST = 'New Council List',
}

interface HeaderProps {
  name: string; // Dynamic header title
  buttonName?: string; // Use the enum for button name
}

const AddNewHeader = ({
  name,
  buttonName,
}: HeaderProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = () => {
    console.log({ buttonName });
    console.log('Button name:', buttonName); // Debugging log
    setIsOpen((prev) => !prev); // Toggle isOpen state
    console.log(`${buttonName} button clicked!`);
  };

  const handleClose = () => {
    setIsOpen(false); // Close modal
    console.log('Modal closed!');
  };

  return (
    <div className='mb-5 flex w-full items-center justify-between'>
      <h1 className='text-lg font-semibold dark:text-white'>
        {name}
      </h1>
      {buttonName && (
        <>
          <Button onClick={handleButtonClick}>
            <PlusSquare className='h-4 w-4' />
            {buttonName}{' '}
            {/* Display button name */}
          </Button>
        </>
      )}

      {isOpen &&
        buttonName === AddNewType.NEW_FORM && (
          <ModalNewForm
            isOpen={isOpen}
            onClose={handleClose}
          />
        )}
      {isOpen &&
        buttonName ===
          AddNewType.NEW_REPORT_OR_PUBLICATION && (
          <ModalNewPublication
            isOpen={isOpen}
            onClose={handleClose}
          />
        )}
      {isOpen &&
        buttonName === AddNewType.NEW_SHOP && (
          <ModalNewShop
            isOpen={isOpen}
            onClose={handleClose}
          />
        )}
      {isOpen &&
        buttonName === AddNewType.NEW_BLOG && (
          <ModalNewBlog
            isOpen={isOpen}
            onClose={handleClose}
          />
        )}
      {isOpen &&
        buttonName === AddNewType.ADD_NEWS && (
          <ModalNewNews
            isOpen={isOpen}
            onClose={handleClose}
          />
        )}
      {isOpen &&
        buttonName ===
          AddNewType.NEW_COUNCIL_LIST && (
          <ModalNewCouncilList
            isOpen={isOpen}
            onClose={handleClose}
          />
        )}
    </div>
  );
};

export default AddNewHeader;
