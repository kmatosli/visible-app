import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

function ProductCard({ name, price }: { name: string; price: number }) {
  return (
    <div data-testid="product-card">
      <h2 data-testid="product-name">{name}</h2>
      <p data-testid="product-price">{price.toFixed(2)}</p>
    </div>
  );
}

describe('ProductCard', () => {
  test('renders product name correctly', () => {
    render(<ProductCard name="Career Coaching Session" price={150.00} />);
    expect(screen.getByTestId('product-name')).toHaveTextContent('Career Coaching Session');
  });

  test('renders product price correctly', () => {
    render(<ProductCard name="Resume Review" price={75.50} />);
    expect(screen.getByTestId('product-price')).toHaveTextContent('75.50');
  });

  test('renders product card container', () => {
    render(<ProductCard name="Test Product" price={10.00} />);
    expect(screen.getByTestId('product-card')).toBeInTheDocument();
  });
});
