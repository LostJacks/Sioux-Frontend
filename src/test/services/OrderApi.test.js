import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getArrivalNotification, getPickupReminder } from '../../services/OrderApi';

describe('OrderApi', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    // ── getArrivalNotification ──────────────────────────────────────────────

    describe('getArrivalNotification', () => {
        it('calls the correct endpoint with POST', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 1, title: 'Your package has arrived' }),
            });

            await getArrivalNotification(42);

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/api/orders/42/arrival-notification',
                { method: 'POST' }
            );
        });

        it('returns parsed JSON on success', async () => {
            const payload = { id: 1, title: 'Your package has arrived' };
            fetch.mockResolvedValueOnce({ ok: true, json: async () => payload });

            const result = await getArrivalNotification(42);

            expect(result).toEqual(payload);
        });

        it('throws an error when response is not ok', async () => {
            fetch.mockResolvedValueOnce({ ok: false, status: 404 });

            await expect(getArrivalNotification(99)).rejects.toThrow(
                'Failed to fetch arrival notification (404)'
            );
        });
    });

    // ── getPickupReminder ──────────────────────────────────────────────────

    describe('getPickupReminder', () => {
        it('calls the correct endpoint with POST', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 2, title: 'Pickup reminder' }),
            });

            await getPickupReminder(7);

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/api/orders/7/reminder-notification',
                { method: 'POST' }
            );
        });

        it('returns parsed JSON on success', async () => {
            const payload = { id: 2, title: 'Pickup reminder' };
            fetch.mockResolvedValueOnce({ ok: true, json: async () => payload });

            const result = await getPickupReminder(7);

            expect(result).toEqual(payload);
        });

        it('throws an error when response is not ok', async () => {
            fetch.mockResolvedValueOnce({ ok: false, status: 500 });

            await expect(getPickupReminder(7)).rejects.toThrow(
                'Failed to fetch pickup reminder (500)'
            );
        });
    });
});
