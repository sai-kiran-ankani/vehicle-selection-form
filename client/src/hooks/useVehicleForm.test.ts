import { renderHook, act } from '@testing-library/react';
import { useVehicleForm } from './useVehicleForm';

describe('useVehicleForm', () => {
  it('initialises with empty selections', () => {
    const { result } = renderHook(() => useVehicleForm());
    expect(result.current.form.make).toBe('');
    expect(result.current.form.model).toBe('');
    expect(result.current.form.badge).toBe('');
    expect(result.current.form.logbook).toBeNull();
    expect(result.current.models).toEqual([]);
    expect(result.current.badges).toEqual([]);
  });

  it('populates models when a make is selected', () => {
    const { result } = renderHook(() => useVehicleForm());
    act(() => result.current.setMake('tesla'));
    expect(result.current.models).toEqual(['Model 3']);
  });

  it('clears model and badge when make changes', () => {
    const { result } = renderHook(() => useVehicleForm());
    act(() => result.current.setMake('tesla'));
    act(() => result.current.setModel('Model 3'));
    act(() => result.current.setBadge('Performance'));
    act(() => result.current.setMake('ford'));
    expect(result.current.form.model).toBe('');
    expect(result.current.form.badge).toBe('');
  });

  it('clears badge when model changes', () => {
    const { result } = renderHook(() => useVehicleForm());
    act(() => result.current.setMake('ford'));
    act(() => result.current.setModel('Ranger'));
    act(() => result.current.setBadge('Raptor'));
    act(() => result.current.setModel('Falcon'));
    expect(result.current.form.badge).toBe('');
  });

  it('populates badges when make and model are selected', () => {
    const { result } = renderHook(() => useVehicleForm());
    act(() => result.current.setMake('tesla'));
    act(() => result.current.setModel('Model 3'));
    expect(result.current.badges).toEqual(['Performance', 'Long Range', 'Dual Motor']);
  });

  it('populates correct badges for ford Falcon', () => {
    const { result } = renderHook(() => useVehicleForm());
    act(() => result.current.setMake('ford'));
    act(() => result.current.setModel('Falcon'));
    expect(result.current.badges).toEqual(['XR6', 'XR6 Turbo', 'XR8']);
  });

  it('applies a preset and sets all three fields', () => {
    const { result } = renderHook(() => useVehicleForm());
    act(() =>
      result.current.applyPreset({ make: 'tesla', model: 'Model 3', badge: 'Performance' }),
    );
    expect(result.current.form.make).toBe('tesla');
    expect(result.current.form.model).toBe('Model 3');
    expect(result.current.form.badge).toBe('Performance');
  });

  it('is not ready to submit without a logbook', () => {
    const { result } = renderHook(() => useVehicleForm());
    act(() => result.current.setMake('tesla'));
    act(() => result.current.setModel('Model 3'));
    act(() => result.current.setBadge('Performance'));
    expect(result.current.isReadyToSubmit).toBe(false);
  });

  it('is ready to submit when all fields and logbook are set', () => {
    const { result } = renderHook(() => useVehicleForm());
    act(() => result.current.setMake('tesla'));
    act(() => result.current.setModel('Model 3'));
    act(() => result.current.setBadge('Performance'));
    act(() =>
      result.current.setLogbook(new File(['content'], 'log.txt', { type: 'text/plain' })),
    );
    expect(result.current.isReadyToSubmit).toBe(true);
  });

  it('reset clears all fields', () => {
    const { result } = renderHook(() => useVehicleForm());
    act(() => result.current.setMake('tesla'));
    act(() => result.current.setModel('Model 3'));
    act(() => result.current.setBadge('Performance'));
    act(() => result.current.reset());
    expect(result.current.form.make).toBe('');
    expect(result.current.form.model).toBe('');
    expect(result.current.form.badge).toBe('');
  });
});
