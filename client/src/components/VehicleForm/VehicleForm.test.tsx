import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleForm } from './VehicleForm';

const mockFetch = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetAllMocks();
});

describe('VehicleForm', () => {
  it('renders the make dropdown with all available makes', () => {
    render(<VehicleForm />);
    expect(screen.getByLabelText('Make')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ford' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'BMW' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Tesla' })).toBeInTheDocument();
  });

  it('model and badge dropdowns are disabled on initial render', () => {
    render(<VehicleForm />);
    expect(screen.getByLabelText('Model')).toBeDisabled();
    expect(screen.getByLabelText('Badge')).toBeDisabled();
  });

  it('selecting a make enables and populates the model dropdown', async () => {
    render(<VehicleForm />);
    await userEvent.selectOptions(screen.getByLabelText('Make'), 'tesla');
    const modelSelect = screen.getByLabelText('Model');
    expect(modelSelect).not.toBeDisabled();
    expect(screen.getByRole('option', { name: 'Model 3' })).toBeInTheDocument();
  });

  it('selecting a model enables and populates the badge dropdown', async () => {
    render(<VehicleForm />);
    await userEvent.selectOptions(screen.getByLabelText('Make'), 'tesla');
    await userEvent.selectOptions(screen.getByLabelText('Model'), 'Model 3');
    const badgeSelect = screen.getByLabelText('Badge');
    expect(badgeSelect).not.toBeDisabled();
    expect(screen.getByRole('option', { name: 'Performance' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Long Range' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Dual Motor' })).toBeInTheDocument();
  });

  it('changing the make clears model and badge selections', async () => {
    render(<VehicleForm />);
    await userEvent.selectOptions(screen.getByLabelText('Make'), 'tesla');
    await userEvent.selectOptions(screen.getByLabelText('Model'), 'Model 3');
    await userEvent.selectOptions(screen.getByLabelText('Badge'), 'Performance');
    await userEvent.selectOptions(screen.getByLabelText('Make'), 'ford');
    expect(screen.getByLabelText('Model')).toHaveValue('');
    expect(screen.getByLabelText('Badge')).toHaveValue('');
  });

  it('changing the model clears the badge selection', async () => {
    render(<VehicleForm />);
    await userEvent.selectOptions(screen.getByLabelText('Make'), 'ford');
    await userEvent.selectOptions(screen.getByLabelText('Model'), 'Ranger');
    await userEvent.selectOptions(screen.getByLabelText('Badge'), 'Raptor');
    await userEvent.selectOptions(screen.getByLabelText('Model'), 'Falcon');
    expect(screen.getByLabelText('Badge')).toHaveValue('');
  });

  it('file upload input is hidden until a badge is selected', async () => {
    render(<VehicleForm />);
    expect(screen.queryByLabelText('Service Logbook')).not.toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText('Make'), 'tesla');
    await userEvent.selectOptions(screen.getByLabelText('Model'), 'Model 3');
    await userEvent.selectOptions(screen.getByLabelText('Badge'), 'Performance');
    expect(screen.getByLabelText('Service Logbook')).toBeInTheDocument();
  });

  it('submit button is disabled until all fields including logbook are filled', async () => {
    render(<VehicleForm />);
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    expect(submitBtn).toBeDisabled();
    await userEvent.selectOptions(screen.getByLabelText('Make'), 'tesla');
    await userEvent.selectOptions(screen.getByLabelText('Model'), 'Model 3');
    await userEvent.selectOptions(screen.getByLabelText('Badge'), 'Performance');
    expect(submitBtn).toBeDisabled();
  });

  it('quick select buttons pre-fill all three dropdowns', async () => {
    render(<VehicleForm />);
    await userEvent.click(screen.getByRole('button', { name: 'Tesla Model 3 Performance' }));
    expect(screen.getByLabelText('Make')).toHaveValue('tesla');
    expect(screen.getByLabelText('Model')).toHaveValue('Model 3');
    expect(screen.getByLabelText('Badge')).toHaveValue('Performance');
  });

  it('shows submission result after successful form submit', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        make: 'tesla',
        model: 'Model 3',
        badge: 'Performance',
        logbookContents: 'Service on 01/01/2024',
      }),
    });

    render(<VehicleForm />);
    await userEvent.selectOptions(screen.getByLabelText('Make'), 'tesla');
    await userEvent.selectOptions(screen.getByLabelText('Model'), 'Model 3');
    await userEvent.selectOptions(screen.getByLabelText('Badge'), 'Performance');

    const file = new File(['Service on 01/01/2024'], 'log.txt', { type: 'text/plain' });
    await userEvent.upload(screen.getByLabelText('Service Logbook'), file);
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText('Submission Successful')).toBeInTheDocument();
    });
    expect(screen.getByText('Service on 01/01/2024')).toBeInTheDocument();
  });

  it('shows an error message when the server returns an error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Logbook file is required' }),
    });

    render(<VehicleForm />);
    await userEvent.selectOptions(screen.getByLabelText('Make'), 'tesla');
    await userEvent.selectOptions(screen.getByLabelText('Model'), 'Model 3');
    await userEvent.selectOptions(screen.getByLabelText('Badge'), 'Performance');

    const file = new File(['content'], 'log.txt', { type: 'text/plain' });
    await userEvent.upload(screen.getByLabelText('Service Logbook'), file);
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Logbook file is required');
    });
  });
});
