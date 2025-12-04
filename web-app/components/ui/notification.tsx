import { Button } from './button';

export function Notification({
  message,
  type,
  onConfirm,
  onClose,
}: {
  message: string;
  type: 'success' | 'error' | 'info';
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div>
      <div>{/* add icon here */}</div>
      <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg">
        {message}
      </div>
      <div>
        <Button onClick={onConfirm}>OK</Button>
        <Button onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}
