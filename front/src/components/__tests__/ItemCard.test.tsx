import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ItemCard } from '../ItemCard/ItemCard';
import { BrowserRouter } from 'react-router-dom';

const mockItem = {
  id: 1,
  title: 'Item de Teste',
  description: 'Descrição do item de teste',
  price: 99.99,
  available: true,
  imageUrl: 'https://example.com/image.jpg',
  ownerId: 1,
  owner: {
    id: 1,
    name: 'Owner',
    email: 'owner@example.com',
  },
  createdAt: new Date().toISOString(),
};

describe('ItemCard', () => {
  it('deve renderizar o título do item', () => {
    const mockOnClick = vi.fn();
    
    render(
      <BrowserRouter>
        <ItemCard item={mockItem} onClick={mockOnClick} />
      </BrowserRouter>
    );

    expect(screen.getByText('Item de Teste')).toBeInTheDocument();
  });

  it('deve renderizar o preço formatado', () => {
    const mockOnClick = vi.fn();
    
    render(
      <BrowserRouter>
        <ItemCard item={mockItem} onClick={mockOnClick} />
      </BrowserRouter>
    );

    expect(screen.getByText(/R\$/)).toBeInTheDocument();
    expect(screen.getByText(/99,99/)).toBeInTheDocument();
  });

  it('deve chamar onClick quando clicado', () => {
    const mockOnClick = vi.fn();
    
    render(
      <BrowserRouter>
        <ItemCard item={mockItem} onClick={mockOnClick} />
      </BrowserRouter>
    );

    const card = screen.getByText('Item de Teste').closest('div');
    if (card) {
      card.click();
      expect(mockOnClick).toHaveBeenCalled();
    }
  });
});

