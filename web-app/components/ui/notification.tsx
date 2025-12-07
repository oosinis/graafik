import { Button } from './button';
import { Info } from 'lucide-react';

export function Notification({
  message,
  onConfirm,
  onClose,
}: {
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="flex flex-col items-center text-black px-12 py-8 bg-white  rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-2 text-[#7636ff]">
          <Info />
        </div>

        <div className="mb-3 text-center">{message}</div>

        <div className="flex gap-2">
          <Button
            className="bg-[#7636ff] text-white hover:bg-[#5a27cc]"
            onClick={onConfirm}
          >
            OK
          </Button>

          <Button
            className="bg-gray-200 text-black hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
