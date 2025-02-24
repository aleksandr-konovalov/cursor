import { parseHTML, queryByTestId, createMockTemplate, createDetailsMock, createMockUser } from '../helpers/templateHelper';

describe('Details View', () => {
    const mockUser = createMockUser(1, 'John Doe', 'john@example.com');
    let document: Document;

    beforeEach(() => {
        const mockContent = createDetailsMock(mockUser);
        document = parseHTML(createMockTemplate(mockContent));
    });

    test('renders page title correctly', () => {
        const title = queryByTestId(document, 'page-title');
        expect(title).toBeInTheDocument();
        expect(title?.textContent?.trim()).toBe('User Details');
    });

    test('renders user details container', () => {
        const container = queryByTestId(document, 'user-details');
        expect(container).toBeInTheDocument();
    });

    test('renders user ID correctly', () => {
        const idRow = queryByTestId(document, 'user-id');
        expect(idRow).toBeInTheDocument();
        expect(idRow?.querySelector('span')?.textContent?.trim()).toBe(mockUser.id.toString());
    });

    test('renders user name correctly', () => {
        const nameRow = queryByTestId(document, 'user-name');
        expect(nameRow).toBeInTheDocument();
        expect(nameRow?.querySelector('span')?.textContent?.trim()).toBe(mockUser.name);
    });

    test('renders user email correctly', () => {
        const emailRow = queryByTestId(document, 'user-email');
        expect(emailRow).toBeInTheDocument();
        expect(emailRow?.querySelector('span')?.textContent?.trim()).toBe(mockUser.email);
    });

    test('renders action buttons', () => {
        const editButton = queryByTestId(document, 'edit-button');
        const deleteButton = queryByTestId(document, 'delete-button');
        const backButton = queryByTestId(document, 'back-button');

        expect(editButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
        expect(backButton).toBeInTheDocument();

        expect(editButton?.textContent?.trim()).toBe('Edit');
        expect(deleteButton?.textContent?.trim()).toBe('Delete');
        expect(backButton?.textContent?.trim()).toBe('Back to List');
    });

    test('action buttons have correct attributes', () => {
        const editButton = queryByTestId(document, 'edit-button') as HTMLAnchorElement;
        const deleteButton = queryByTestId(document, 'delete-button');
        const backButton = queryByTestId(document, 'back-button') as HTMLAnchorElement;

        expect(editButton).toBeInTheDocument();
        expect(editButton.getAttribute('href')).toBe(`/users/edit/${mockUser.id}`);
        
        const deleteForm = deleteButton?.closest('form');
        expect(deleteForm).toBeInTheDocument();
        expect(deleteForm?.getAttribute('action')).toBe(`/users/remove/${mockUser.id}`);
        
        expect(backButton).toBeInTheDocument();
        expect(backButton.getAttribute('href')).toBe('/users');
    });
}); 