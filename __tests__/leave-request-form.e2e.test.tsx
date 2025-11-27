// @ts-nocheck
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeaveRequestForm } from '@/components/leaves/leave-request-form';

const mockRouter = {
  push: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

const originalFetch = global.fetch;

let historyBackSpy: ReturnType<typeof vi.spyOn>;
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  Object.values(mockRouter).forEach((fn) => fn.mockReset());
  historyBackSpy = vi
    .spyOn(window.history, 'back')
    .mockImplementation(() => undefined);
  fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({}),
  } as any);
  global.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
  fetchMock.mockReset();
  historyBackSpy.mockRestore();
  global.fetch = originalFetch;
});

describe('LeaveRequestForm – flux complet', () => {
  it('calcule les jours ouvrés de la société et les inclut dans le payload soumis', async () => {
    render(<LeaveRequestForm workingDays={[1, 2, 3, 4, 5]} />);

    const startInput = screen.getByLabelText('Date de début *');
    const endInput = screen.getByLabelText('Date de fin *');

    fireEvent.change(startInput, { target: { value: '2025-01-06' } });
    fireEvent.change(endInput, { target: { value: '2025-01-10' } });

    await waitFor(() => {
      expect(
        screen.getByText(/Durée estimée : 5 jours ouvrés/i)
      ).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', {
      name: 'Soumettre la demande',
    });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/leaves');
    expect(options?.method).toBe('POST');

    const payload = JSON.parse(options?.body as string);
    expect(payload).toMatchObject({
      leaveType: 'CP',
      totalDays: 5,
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard/leaves');
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  it('affiche l’erreur et bloque la soumission si la période est invalide', async () => {
    render(<LeaveRequestForm workingDays={[1, 2, 3, 4, 5]} />);

    const startInput = screen.getByLabelText('Date de début *');
    const endInput = screen.getByLabelText('Date de fin *');

    fireEvent.change(startInput, { target: { value: '2025-01-10' } });
    fireEvent.change(endInput, { target: { value: '2025-01-06' } });

    await waitFor(() => {
      expect(
        screen.getByText(
          'La date de fin doit être postérieure à la date de début.'
        )
      ).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', {
      name: 'Soumettre la demande',
    });

    expect(submitButton).toBeDisabled();

    expect(
      screen.getByText(
        'La date de fin doit être postérieure à la date de début.'
      )
    ).toBeInTheDocument();

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
