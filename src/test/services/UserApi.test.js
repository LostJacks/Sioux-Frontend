import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { listUsersByRole, listManagers } from '../../services/UserApi';

describe('UserApi', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    // ── listUsersByRole ────────────────────────────────────────────────────

    describe('listUsersByRole', () => {
        it('appends role query param when role is provided', async () => {
            fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

            await listUsersByRole('MANAGER');

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/api/users?role=MANAGER'
            );
        });

        it('omits query param when role is falsy', async () => {
            fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

            await listUsersByRole(null);

            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/users');
        });

        it('returns parsed JSON on success', async () => {
            const users = [{ id: 1, firstName: 'Alice' }];
            fetch.mockResolvedValueOnce({ ok: true, json: async () => users });

            const result = await listUsersByRole('EMPLOYEE');

            expect(result).toEqual(users);
        });

        it('throws an error when response is not ok', async () => {
            fetch.mockResolvedValueOnce({ ok: false, status: 403 });

            await expect(listUsersByRole('ADMIN')).rejects.toThrow(
                'Failed to load users (403)'
            );
        });
    });

    // ── listManagers ───────────────────────────────────────────────────────

    describe('listManagers', () => {
        it('requests users with MANAGER role', async () => {
            fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });

            await listManagers();

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/api/users?role=MANAGER'
            );
        });
    });
});
