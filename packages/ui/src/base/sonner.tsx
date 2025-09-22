import { Toaster as Sonner, ToasterProps } from 'sonner';

interface ToasterCustomProps extends ToasterProps {
  theme?: 'light' | 'dark' | 'system';
}

const Toaster = ({ theme = 'system', ...props }: ToasterCustomProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
