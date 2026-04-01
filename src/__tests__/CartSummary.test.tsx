import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

function CartSummary({ items, onRemove }: { items: CartItem[]; onRemove: (id: number) => void }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div data-testid="cart-summary">
      {items.map(item => (
        <div key={item.id} data-testid={'cart-item-' + item.id}>
          <span>{item.name}</span>
          <span data-testid={'quantity-' + item.id}>{item.quantity}</span>
          <button onClick={() => onRemove(item.id)}>Remove</button>
        </div>
      ))}
      <div data-testid="cart-total">{'$' + total.toFixed(2)}</div>
    </div>
  );
}

describe('CartSummary', () => {
  const mockItems: CartItem[] = [
    { id: 1, name: 'Career Coaching', price: 150.00, quantity: 1 },
    { id: 2, name: 'Resume Review', price: 75.00, quantity: 2 },
  ];

  test('renders all cart items', () => {
    render(<CartSummary items={mockItems} onRemove={() => {}} />);
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-2')).toBeInTheDocument();
  });

  test('calculates total correctly', () => {
    render(<CartSummary items={mockItems} onRemove={() => {}} />);
    expect(screen.getByTestId('cart-total')).toHaveTextContent('300.00');
  });

  test('calls onRemove when remove button clicked', () => {
    const mockRemove = jest.fn();
    render(<CartSummary items={mockItems} onRemove={mockRemove} />);
    fireEvent.click(screen.getAllByText('Remove')[0]);
    expect(mockRemove).toHaveBeenCalledWith(1);
  });
});
