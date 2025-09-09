import { Button } from '@workspace/ui/base/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/base/dropdown-menu';
import { useAtom } from 'jotai';
import { Moon, Sun } from 'lucide-react';

import { setThemeAtom } from '@/web/store/theme';

export default function ThemeToggle() {
  const [, setTheme] = useAtom(setThemeAtom);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative" size="icon" variant="outline">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
