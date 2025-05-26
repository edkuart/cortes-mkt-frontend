// 📁 components/tests/RecuperarPassword.test.tsx

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecPasswordPage from '@/pages/recuperar-password';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('RecuperarPasswordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('valida que no se puede enviar un correo vacío', async () => {
    render(<RecPasswordPage />);

    const input = screen.getByLabelText(/correo/i);
    fireEvent.change(input, { target: { value: '' } });
    input.removeAttribute('required');

    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Ingresa un correo válido');
    });
  });

  it('envía el formulario correctamente con un correo válido', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ mensaje: 'Correo enviado' })
      })
    ) as jest.Mock;

    render(<RecPasswordPage />);
    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: 'correo@prueba.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/auth/recuperar-password',
        expect.objectContaining({
          method: 'POST'
        })
      );
      expect(toast.success).toHaveBeenCalledWith('Correo enviado');
    });
  });

  it('muestra error si el servidor falla', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ mensaje: 'No se pudo enviar el correo' })
      })
    ) as jest.Mock;

    render(<RecPasswordPage />);
    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: 'correo@fallo.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se pudo enviar el correo');
    });
  });

  it('muestra mensaje visual de éxito tras enviar el correo', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ mensaje: 'Correo enviado' })
      })
    ) as jest.Mock;

    render(<RecPasswordPage />);
    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: 'test@correo.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    const mensaje = await screen.findByText(/Correo enviado correctamente/i);
    expect(mensaje).toBeInTheDocument();
  });

  it('deshabilita el botón mientras se está enviando', async () => {
    let resolver: any;
    const fetchPromise = new Promise(resolve => {
      resolver = resolve;
    });

    global.fetch = jest.fn(() => fetchPromise) as jest.Mock;

    render(<RecPasswordPage />);
    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: 'test@correo.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText(/Enviando.../i)).toBeInTheDocument();

    await act(async () => {
      resolver({ ok: true, json: () => Promise.resolve({ mensaje: 'Correo enviado' }) });
    });
  });
});
