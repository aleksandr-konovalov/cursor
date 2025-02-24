import {
    createMockUser,
    createMockTeamMember,
    createMockRequest,
    createMockResponse,
    createTestContext
} from './testUtils';

describe('Test Utilities', () => {
    describe('createMockUser', () => {
        it('should create a mock user with default values', () => {
            const user = createMockUser();
            expect(user).toEqual({
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                position: 'Software Engineer',
                avatar: 'https://via.placeholder.com/150',
                followers: 100,
                following: 50,
                team: []
            });
        });

        it('should override default values with provided values', () => {
            const user = createMockUser({
                id: 2,
                name: 'Custom User',
                email: 'custom@example.com'
            });
            expect(user.id).toBe(2);
            expect(user.name).toBe('Custom User');
            expect(user.email).toBe('custom@example.com');
        });
    });

    describe('createMockTeamMember', () => {
        it('should create a mock team member with default values', () => {
            const member = createMockTeamMember();
            expect(member).toEqual({
                id: 1,
                name: 'Team Member',
                avatar: 'https://via.placeholder.com/40'
            });
        });

        it('should override default values with provided values', () => {
            const member = createMockTeamMember({
                id: 2,
                name: 'Custom Member'
            });
            expect(member.id).toBe(2);
            expect(member.name).toBe('Custom Member');
        });
    });

    describe('createMockRequest', () => {
        it('should create a mock request with default values', () => {
            const req = createMockRequest();
            expect(req.params).toEqual({});
            expect(req.body).toEqual({});
            expect(req.query).toEqual({});
            expect(req.headers).toEqual({});
            expect(req.get).toBeDefined();
        });

        it('should include provided options', () => {
            const req = createMockRequest({
                params: { id: '1' },
                body: { name: 'Test' },
                headers: { 'content-type': 'application/json' }
            });
            expect(req.params.id).toBe('1');
            expect(req.body.name).toBe('Test');
            expect(req.get('content-type')).toBe('application/json');
        });

        it('should have a working get method for headers', () => {
            const req = createMockRequest({
                headers: { 'content-type': 'application/json' }
            });
            expect(req.get('content-type')).toBe('application/json');
            expect(req.get('nonexistent')).toBeUndefined();
        });
    });

    describe('createMockResponse', () => {
        it('should create a mock response with default values', () => {
            const res = createMockResponse();
            expect(res.locals).toEqual({});
            expect(res.statusCode).toBe(200);
            expect(res.status).toBeDefined();
            expect(res.json).toBeDefined();
            expect(res.send).toBeDefined();
            expect(res.render).toBeDefined();
            expect(res.redirect).toBeDefined();
        });

        it('should include provided options', () => {
            const res = createMockResponse({
                locals: { user: { id: 1 } },
                statusCode: 404
            });
            expect(res.locals.user.id).toBe(1);
            expect(res.statusCode).toBe(404);
        });

        it('should have chainable methods', () => {
            const res = createMockResponse();
            expect(res.status(200).json({ test: true })).toBe(res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ test: true });
        });
    });

    describe('createTestContext', () => {
        it('should create a test context with default values', () => {
            const context = createTestContext();
            expect(context.req).toBeDefined();
            expect(context.res).toBeDefined();
            expect(context.mockUser).toBeDefined();
            expect(context.mockTeamMember).toBeDefined();
        });

        it('should include provided request and response options', () => {
            const context = createTestContext(
                { params: { id: '1' } },
                { statusCode: 404 }
            );
            expect(context.req.params.id).toBe('1');
            expect(context.res.statusCode).toBe(404);
        });

        it('should create independent instances for each call', () => {
            const context1 = createTestContext();
            const context2 = createTestContext();
            expect(context1.mockUser).not.toBe(context2.mockUser);
            expect(context1.mockTeamMember).not.toBe(context2.mockTeamMember);
        });
    });
}); 