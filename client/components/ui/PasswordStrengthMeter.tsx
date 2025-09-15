// client/components/ui/PasswordStrengthMeter.tsx
import zxcvbn from 'zxcvbn';

export const PasswordStrengthMeter = ({ password }: { password?: string }) => {
  if (!password) return null;

  const result = zxcvbn(password);
  const score = result.score; // Score from 0 (worst) to 4 (best)

  const getLabel = () => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const getBarColor = () => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getBarWidth = () => {
    return `${((score + 1) / 5) * 100}%`;
  };

  return (
    <div className="w-full mt-2">
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getBarColor()}`}
          style={{ width: getBarWidth() }}
        ></div>
      </div>
      <p className="text-xs text-right mt-1 text-gray-400">{getLabel()}</p>
    </div>
  );
};