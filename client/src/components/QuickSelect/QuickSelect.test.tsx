import { render, screen, fireEvent } from '@testing-library/react';
import { QuickSelect } from './QuickSelect';
import { QUICK_PRESETS } from '../../data/vehicles';

describe('QuickSelect', () => {
  it('renders a button for each preset', () => {
    render(<QuickSelect onSelect={() => {}} />);
    QUICK_PRESETS.forEach((preset) => {
      expect(screen.getByRole('button', { name: preset.label })).toBeInTheDocument();
    });
  });

  it('calls onSelect with the correct preset when first button is clicked', () => {
    const onSelect = vi.fn();
    render(<QuickSelect onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: QUICK_PRESETS[0].label }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(QUICK_PRESETS[0]);
  });

  it('calls onSelect with the correct preset when second button is clicked', () => {
    const onSelect = vi.fn();
    render(<QuickSelect onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: QUICK_PRESETS[1].label }));
    expect(onSelect).toHaveBeenCalledWith(QUICK_PRESETS[1]);
  });
});
