import { render, screen } from '@testing-library/react';
import App from './App';

test('renders account selection page heading', () => {
  render(<App />);
  expect(screen.getByText(/choose your account type/i)).toBeInTheDocument();
});
