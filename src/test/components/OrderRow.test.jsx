import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderRow from '../../components/OrderRow';

const baseOrder = {
    id: 'TRK-001',
    trackingNumber: 'TRK-001',
    status: 'STORED',
    pkgId: 10,
};

describe('OrderRow', () => {
    // ── Status rendering ───────────────────────────────────────────────────

    it('renders the tracking number', () => {
        render(<OrderRow order={baseOrder} />);

        expect(screen.getByText('TRK-001')).toBeInTheDocument();
    });

    it('renders the status text', () => {
        render(<OrderRow order={baseOrder} />);

        expect(screen.getByText('STORED')).toBeInTheDocument();
    });

    it('renders status from object shape (status.name)', () => {
        const order = { ...baseOrder, status: { name: 'REGISTERED' } };
        render(<OrderRow order={order} />);

        expect(screen.getByText('REGISTERED')).toBeInTheDocument();
    });

    // ── Picked-up state ────────────────────────────────────────────────────

    it('shows "Picked up" badge when status is PICKED_UP', () => {
        const order = { ...baseOrder, status: 'PICKED_UP' };
        render(<OrderRow order={order} />);

        expect(screen.getByText('Picked up')).toBeInTheDocument();
    });

    it('hides "Mark as Picked Up" button when already picked up', () => {
        const order = { ...baseOrder, status: 'PICKED_UP' };
        render(<OrderRow order={order} onPickup={vi.fn()} />);

        expect(screen.queryByText('Mark as Picked Up')).not.toBeInTheDocument();
    });

    // ── Pickup button ──────────────────────────────────────────────────────

    it('shows "Mark as Picked Up" button for stored order with pkgId', () => {
        render(<OrderRow order={baseOrder} onPickup={vi.fn()} />);

        expect(screen.getByText('Mark as Picked Up')).toBeInTheDocument();
    });

    it('calls onPickup with pkgId when button is clicked', async () => {
        const onPickup = vi.fn();
        render(<OrderRow order={baseOrder} onPickup={onPickup} />);

        await userEvent.click(screen.getByText('Mark as Picked Up'));

        expect(onPickup).toHaveBeenCalledWith(10);
    });

    // ── Send reminder button ───────────────────────────────────────────────

    it('shows "Send reminder" button for STORED orders with handler', () => {
        render(<OrderRow order={baseOrder} onSendReminder={vi.fn()} />);

        expect(screen.getByText('Send reminder')).toBeInTheDocument();
    });

    it('hides "Send reminder" button when order is not STORED', () => {
        const order = { ...baseOrder, status: 'REGISTERED' };
        render(<OrderRow order={order} onSendReminder={vi.fn()} />);

        expect(screen.queryByText('Send reminder')).not.toBeInTheDocument();
    });

    it('calls onSendReminder with the order when clicked', async () => {
        const onSendReminder = vi.fn();
        render(<OrderRow order={baseOrder} onSendReminder={onSendReminder} />);

        await userEvent.click(screen.getByText('Send reminder'));

        expect(onSendReminder).toHaveBeenCalledWith(baseOrder);
    });

    // ── Notify managers button ─────────────────────────────────────────────

    it('shows "Notify managers" button for company orders (no employee, has pkgId)', () => {
        const order = { ...baseOrder, employee: undefined };
        render(<OrderRow order={order} onNotifyManagers={vi.fn()} />);

        expect(screen.getByText('Notify managers')).toBeInTheDocument();
    });

    it('hides "Notify managers" button when order has an assigned employee', () => {
        const order = { ...baseOrder, employee: { firstName: 'Alice', lastName: 'Smith' } };
        render(<OrderRow order={order} onNotifyManagers={vi.fn()} />);

        expect(screen.queryByText('Notify managers')).not.toBeInTheDocument();
    });

    // ── Courier tracking ───────────────────────────────────────────────────

    it('shows "Courier website" button when courier is set', () => {
        const order = { ...baseOrder, courier: 'DHL' };
        render(<OrderRow order={order} />);

        expect(screen.getByText('Courier website')).toBeInTheDocument();
    });

    it('does not show courier button when no courier is set', () => {
        render(<OrderRow order={baseOrder} />);

        expect(screen.queryByText('Courier website')).not.toBeInTheDocument();
    });
});
