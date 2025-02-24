import { User, NewUser } from '../types/user';
import { UserRequest, UserResponse } from '../types/express';

class UserController {
    private users: User[] = [
        {
            id: 1,
            name: 'Victoria Davidson',
            email: 'victoria@example.com',
            position: 'Project Manager',
            avatar: 'https://via.placeholder.com/400x400',
            followers: 64,
            following: 326,
            team: [
                { id: 1, name: 'Sarah Johnson', avatar: 'https://via.placeholder.com/40x40' },
                { id: 2, name: 'Mike Chen', avatar: 'https://via.placeholder.com/40x40' },
                { id: 3, name: 'Anna Smith', avatar: 'https://via.placeholder.com/40x40' },
                { id: 4, name: 'Tom Wilson', avatar: 'https://via.placeholder.com/40x40' }
            ]
        },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com' }
    ];
    private readonly INITIAL_ID = 1;
    private nextId: number;

    constructor() {
        this.nextId = this.calculateNextId();
    }

    private calculateNextId(): number {
        if (this.users.length === 0) {
            return this.INITIAL_ID;
        }
        
        const maxId = Math.max(...this.users.map(user => user.id));
        return maxId + 1;
    }

    private ensureValidNextId(): void {
        // Recalculate nextId if it's not greater than all existing IDs
        const maxId = Math.max(...this.users.map(user => user.id));
        if (this.nextId <= maxId) {
            this.nextId = maxId + 1;
        }
    }

    public listUsers(req: UserRequest, res: UserResponse): void {
        res.render('users/list', { 
            users: this.users,
            path: '/users'
        });
    }

    public editUser(req: UserRequest, res: UserResponse): void {
        const userId = this.getUserId(req);
        const user = this.findOrCreateUser(userId);
        res.render('users/edit', { 
            user,
            path: '/users/edit'
        });
    }

    private getUserId(req: UserRequest): number | null {
        if (!req.params.id) return null;
        
        const parsedId = parseInt(req.params.id);
        return !isNaN(parsedId) ? parsedId : null;
    }

    private findOrCreateUser(userId: number | null): User | NewUser {
        if (!userId) return this.createNewUser();
        
        const existingUser = this.users.find(user => user.id === userId);
        return existingUser || this.createNewUser();
    }

    private createNewUser(): NewUser {
        return { id: null, name: '', email: '' };
    }

    private validateUserInput(name: string, email: string): string | null {
        if (!name || name.trim().length === 0) {
            return 'Name is required';
        }
        if (!email || email.trim().length === 0) {
            return 'Email is required';
        }
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return 'Invalid email format';
        }
        return null;
    }

    public saveUser(req: UserRequest, res: UserResponse): void {
        const userId = this.getUserId(req);
        const { name, email } = req.body;

        const validationError = this.validateUserInput(name, email);
        if (validationError) {
            res.status(400).render('users/edit', { 
                user: { id: userId, name, email },
                error: validationError,
                path: '/users/edit'
            });
            return;
        }
        
        try {
            if (userId !== null) {
                const userIndex = this.users.findIndex(user => user.id === userId);
                if (userIndex !== -1) {
                    this.users[userIndex] = { id: userId, name, email };
                } else {
                    throw new Error('User not found');
                }
            } else {
                this.ensureValidNextId();
                const newUser: User = { id: this.nextId++, name, email };
                this.users.push(newUser);
            }
            res.redirect('/users');
        } catch (error) {
            res.status(500).render('users/edit', { 
                user: { id: userId, name, email },
                error: 'Failed to save user',
                path: '/users/edit'
            });
        }
    }

    public removeUser(req: UserRequest, res: UserResponse): void {
        const userId = this.getUserId(req);
        
        if (userId === null) {
            res.status(400).redirect('/users');
            return;
        }

        try {
            const initialLength = this.users.length;
            this.users = this.users.filter(user => user.id !== userId);
            
            if (this.users.length === initialLength) {
                res.status(404).redirect('/users');
                return;
            }
            
            res.redirect('/users');
        } catch (error) {
            res.status(500).redirect('/users');
        }
    }

    public showUserDetails(req: UserRequest, res: UserResponse): void {
        const userId = this.getUserId(req);
        
        if (userId === null) {
            res.status(400).redirect('/users');
            return;
        }

        const user = this.users.find(user => user.id === userId);
        
        if (!user) {
            res.status(404).redirect('/users');
            return;
        }
        
        res.render('users/details', { 
            user,
            path: `/users/details/${userId}`
        });
    }
}

export default UserController;