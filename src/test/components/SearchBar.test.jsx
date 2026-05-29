import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../../components/Searchbar';

describe('SearchBar', () => {
    it('renders the input with placeholder text', () => {
        render(<SearchBar searchTerm="" setSearchTerm={() => {}} />);

        expect(screen.getByPlaceholderText('Order number')).toBeInTheDocument();
    });

    it('displays the current searchTerm value', () => {
        render(<SearchBar searchTerm="TRK-001" setSearchTerm={() => {}} />);

        expect(screen.getByDisplayValue('TRK-001')).toBeInTheDocument();
    });

    it('calls setSearchTerm when user types', async () => {
        const setSearchTerm = vi.fn();
        render(<SearchBar searchTerm="" setSearchTerm={setSearchTerm} />);

        await userEvent.type(screen.getByPlaceholderText('Order number'), 'A');

        expect(setSearchTerm).toHaveBeenCalled();
    });

    it('does not show clear button when searchTerm is empty', () => {
        render(<SearchBar searchTerm="" setSearchTerm={() => {}} />);

        expect(screen.queryByText('✕')).not.toBeInTheDocument();
    });

    it('shows clear button when searchTerm is non-empty', () => {
        render(<SearchBar searchTerm="hello" setSearchTerm={() => {}} />);

        expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('calls setSearchTerm with empty string when clear button is clicked', async () => {
        const setSearchTerm = vi.fn();
        render(<SearchBar searchTerm="hello" setSearchTerm={setSearchTerm} />);

        await userEvent.click(screen.getByText('✕'));

        expect(setSearchTerm).toHaveBeenCalledWith('');
    });
});
