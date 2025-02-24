import { Express } from 'express';
import UserController from '../controllers/userController';

export function setRoutes(app: Express): void {
    const controller = new UserController();
    
    // List users
    app.get(['/', '/users'], controller.listUsers.bind(controller));
    
    // Edit user form
    app.get('/users/edit/:id?', controller.editUser.bind(controller));
    
    // View user details
    app.get('/users/details/:id', controller.showUserDetails.bind(controller));
    
    // Save user (create/update)
    app.post('/users/edit/:id?', controller.saveUser.bind(controller));
    
    // Delete user
    app.post('/users/remove/:id', controller.removeUser.bind(controller));
}