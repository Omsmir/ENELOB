import Image from 'next/image';

import { Button } from '../ui/button';

interface ButtonProps {
    isLoading?: boolean;
    className?: string;
    children: React.ReactNode;
    onclick?: () => void;
    innerText?: string;
    disabled?: boolean;
    disabledText?: string;
}

const SubmitButton = ({
    isLoading,
    className,
    children,
    onclick,
    innerText,
    disabled,
    disabledText,
}: ButtonProps) => {
    return (
        <Button
            type="submit"
            disabled={disabled || isLoading}
            className={className ?? 'shad-primary-btn w-full'}
            onClick={onclick}
        >
            {isLoading ? (
                <div className="flex items-center gap-4">
                    <Image
                        src="/assets/icons/loader.svg"
                        alt="loader"
                        width={24}
                        height={24}
                        className="animate-spin"
                    />
                    {innerText || 'Loading...'}
                </div>
            ) : disabled ? (
                <div className="flex">
                    <p>{disabledText || 'no data'}</p>
                </div>
            ) : (
                children
            )}
        </Button>
    );
};

export default SubmitButton;
