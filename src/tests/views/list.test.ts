import { renderTemplate, parseHTML, queryByTestId, queryAllByTestId, createMockTemplate } from '../helpers/templateHelper';

describe('List View', () => {
    const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];

    let document: Document;

    beforeEach(() => {
        const mockContent = `
            <div class="container">
                <h1 data-testid="page-title">User List</h1>
                <button onclick="window.location.href='/users/edit'" class="button" data-testid="add-user-button">Add User</button>
                <ul class="user-list" data-testid="user-list">
                    ${mockUsers.map(user => `
                        <li data-testid="user-item">
                            <span data-testid="user-info">${user.name} - ${user.email}</span>
                            <div class="user-actions">
                                <a href="/users/details/${user.id}" class="button" data-testid="view-details-button">View Details</a>
                                <a href="/users/edit/${user.id}" class="button" data-testid="edit-button">Edit</a>
                                <form action="/users/remove/${user.id}" method="POST" style="display: inline;">
                                    <button type="submit" class="button delete" data-testid="delete-button">Remove</button>
                                </form>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        document = parseHTML(createMockTemplate(mockContent));
    });

    test('renders page title correctly', () => {
        const title = queryByTestId(document, 'page-title');
        expect(title).toBeInTheDocument();
        expect(title?.textContent).toBe('User List');
    });

    test('renders add user button', () => {
        const button = queryByTestId(document, 'add-user-button');
        expect(button).toBeInTheDocument();
        expect(button?.textContent).toBe('Add User');
    });

    test('renders correct number of user items', () => {
        const userItems = queryAllByTestId(document, 'user-item');
        expect(userItems).toHaveLength(mockUsers.length);
    });

    test('renders user information correctly', () => {
        const userInfos = queryAllByTestId(document, 'user-info');
        expect(userInfos[0]?.textContent).toBe('John Doe - john@example.com');
        expect(userInfos[1]?.textContent).toBe('Jane Smith - jane@example.com');
    });

    test('renders action buttons for each user', () => {
        const userItems = queryAllByTestId(document, 'user-item');
        userItems.forEach((item, index) => {
            const viewButton = item.querySelector('[data-testid="view-details-button"]');
            const editButton = item.querySelector('[data-testid="edit-button"]');
            const deleteButton = item.querySelector('[data-testid="delete-button"]');

            expect(viewButton).toBeInTheDocument();
            expect(editButton).toBeInTheDocument();
            expect(deleteButton).toBeInTheDocument();

            expect(viewButton?.getAttribute('href')).toBe(`/users/details/${mockUsers[index].id}`);
            expect(editButton?.getAttribute('href')).toBe(`/users/edit/${mockUsers[index].id}`);
            expect(deleteButton?.closest('form')?.getAttribute('action')).toBe(`/users/remove/${mockUsers[index].id}`);
        });
    });
}); 