import UserController from '../../controllers/userController';
import { createMockRequest, createMockResponse } from '../helpers/mockHelper';
import { createMockUser } from '../helpers/templateHelper';

describe('UserController', () => {
    let controller: UserController;

    beforeEach(() => {
        controller = new UserController();
    });

    describe('listUsers', () => {
        it('should render users list', () => {
            const req = createMockRequest();
            const res = createMockResponse();

            controller.listUsers(req, res);

            expect(res.render).toHaveBeenCalledWith('users/list', {
                users: expect.any(Array),
                path: '/users'
            });
        });
    });

    describe('editUser', () => {
        it('should render edit form for new user', () => {
            const req = createMockRequest();
            const res = createMockResponse();

            controller.editUser(req, res);

            expect(res.render).toHaveBeenCalledWith('users/edit', {
                user: expect.objectContaining({
                    id: null,
                    name: '',
                    email: ''
                }),
                path: '/users/edit'
            });
        });

        it('should render edit form for existing user', () => {
            const req = createMockRequest({ id: '1' });
            const res = createMockResponse();

            controller.editUser(req, res);

            expect(res.render).toHaveBeenCalledWith('users/edit', {
                user: expect.objectContaining({
                    id: 1,
                    name: expect.any(String),
                    email: expect.any(String)
                }),
                path: '/users/edit'
            });
        });
    });

    describe('saveUser', () => {
        it('should create new user', () => {
            const newUser = {
                name: 'Test User',
                email: 'test@example.com'
            };
            const req = createMockRequest({}, newUser);
            const res = createMockResponse();

            controller.saveUser(req, res);

            expect(res.redirect).toHaveBeenCalledWith('/users');
        });

        it('should update existing user', () => {
            const updatedUser = {
                name: 'Updated User',
                email: 'updated@example.com'
            };
            const req = createMockRequest({ id: '1' }, updatedUser);
            const res = createMockResponse();

            controller.saveUser(req, res);

            expect(res.redirect).toHaveBeenCalledWith('/users');
        });

        it('should handle validation errors', () => {
            const invalidUser = {
                name: '',
                email: 'invalid-email'
            };
            const req = createMockRequest({}, invalidUser);
            const res = createMockResponse();

            controller.saveUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.render).toHaveBeenCalledWith('users/edit', expect.objectContaining({
                error: expect.any(String)
            }));
        });
    });

    describe('removeUser', () => {
        it('should remove existing user', () => {
            const req = createMockRequest({ id: '1' });
            const res = createMockResponse();

            controller.removeUser(req, res);

            expect(res.redirect).toHaveBeenCalledWith('/users');
        });

        it('should handle non-existent user', () => {
            const req = createMockRequest({ id: '999' });
            const res = createMockResponse();

            controller.removeUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.redirect).toHaveBeenCalledWith('/users');
        });
    });

    describe('showUserDetails', () => {
        it('should render user details', () => {
            const req = createMockRequest({ id: '1' });
            const res = createMockResponse();

            controller.showUserDetails(req, res);

            expect(res.render).toHaveBeenCalledWith('users/details', {
                user: expect.objectContaining({
                    id: 1,
                    name: expect.any(String),
                    email: expect.any(String)
                }),
                path: '/users/details/1'
            });
        });

        it('should handle non-existent user', () => {
            const req = createMockRequest({ id: '999' });
            const res = createMockResponse();

            controller.showUserDetails(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.redirect).toHaveBeenCalledWith('/users');
        });
    });
}); 