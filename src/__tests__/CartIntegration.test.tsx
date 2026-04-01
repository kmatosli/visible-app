import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

function ShopIntegration() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const products: Product[] = [
    { id: 1, name: 'Career Coaching', price: 150 },
    { id: 2, name: 'Resume Review', price: 75 },
  ];

  return (
    <div>
      <div data-testid="cart-count">{'Cart: ' + cartCount}</div>
      {products.map(p => (
        <div key={p.id}>
          <span>{p.name}</span>
          <button onClick={() => addToCart(p)} data-testid={'add-' + p.id}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

describe('Cart Integration', () => {
  test('cart count starts at zero', () => {
    render(<ShopIntegration />);
    expect(screen.getByTestId('cart-count')).toHaveTextContent('Cart: 0');
  });

  test('cart updates when product is added', () => {
    render(<ShopIntegration />);
    fireEvent.click(screen.getByTestId('add-1'));
    expect(screen.getByTestId('cart-count')).toHaveTextContent('Cart: 1');
  });

  test('cart count increases when multiple products added', () => {
    render(<ShopIntegration />);
    fireEvent.click(screen.getByTestId('add-1'));
    fireEvent.click(screen.getByTestId('add-2'));
    expect(screen.getByTestId('cart-count')).toHaveTextContent('Cart: 2');
  });

  test('quantity increases when same product added twice', () => {
    render(<ShopIntegration />);
    fireEvent.click(screen.getByTestId('add-1'));
    fireEvent.click(screen.getByTestId('add-1'));
    expect(screen.getByTestId('cart-count')).toHaveTextContent('Cart: 2');
  });
});
