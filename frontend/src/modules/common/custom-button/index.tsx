import Image from 'next/image';

import { Button } from '@/components/ui/button';

export enum BUTTON_VARIANT {
  DEFAULT = 'default',
  OUTLINE = 'outline',
  SECONDARY = 'secondary',
  DESTRUCTIVE = 'destructive',
  GHOST = 'ghost',
  LINK = 'link',
}

interface ButtonProps {
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  loadingText?: string;
  onClick?: () => void;
  variant?: BUTTON_VARIANT;
}

const CustomButton = ({
  isLoading,
  className,
  children,
  disabled,
  loadingText,
  variant,
  onClick,
}: ButtonProps) => {
  return (
    <Button
      type='button'
      disabled={isLoading || disabled}
      variant={variant ?? 'default'}
      className={className ?? 'shad-primary-btn'}
      onClick={onClick}
    >
      {isLoading ? (
        <div className='flex items-center gap-4'>
          <Image
            src='/assets/icons/loader.svg'
            alt='loader'
            width={24}
            height={24}
            className='animate-spin'
          />
          {loadingText ? (
            <>{loadingText} </>
          ) : (
            <> Loading... </>
          )}
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default CustomButton;
