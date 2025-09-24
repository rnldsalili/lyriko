import { useState } from 'react';
import { Check, Palette } from 'lucide-react';
import { Button } from '@workspace/ui/base/button';
import { Input } from '@workspace/ui/base/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/base/popover';
import { cn } from '@workspace/ui/lib/utils';

const PRESET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#d946ef', // fuchsia
  '#ec4899', // pink
  '#64748b', // slate
  '#6b7280', // gray
];

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({
  value = '#6366f1',
  onChange,
  className,
}: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(value);
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
  };

  const handleCustomColorApply = () => {
    if (customColor && /^#[0-9A-Fa-f]{6}$/.test(customColor)) {
      onChange(customColor);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start gap-2 h-10', className)}
        >
          <div
            className="w-4 h-4 rounded border border-border"
            style={{ backgroundColor: value }}
          />
          <Palette className="w-4 h-4" />
          <span className="font-mono text-sm">{value}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Preset Colors</p>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className={cn(
                    'w-8 h-8 rounded border-2 border-border hover:border-foreground transition-colors relative',
                    value === color && 'border-foreground',
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => handlePresetColorSelect(color)}
                  type="button"
                >
                  {value === color && (
                    <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-sm" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-sm font-medium mb-2">Custom Color</p>
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="w-10 h-10 rounded border border-border cursor-pointer"
                />
              </div>
              <Input
                value={customColor}
                onChange={(e) => handleCustomColorChange(e.target.value)}
                placeholder="#6366f1"
                className="flex-1 font-mono text-sm"
              />
              <Button
                size="sm"
                onClick={handleCustomColorApply}
                disabled={
                  !customColor || !/^#[0-9A-Fa-f]{6}$/.test(customColor)
                }
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
