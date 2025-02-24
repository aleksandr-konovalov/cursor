import { parseHTML, queryByTestId, createMockTemplate, createEditMock, createMockUser } from '../helpers/templateHelper';

describe('Edit View', () => {
    describe('New User Mode', () => {
        let document: Document;
        const newUser = createMockUser(null as any, '', '');

        beforeEach(() => {
            const mockContent = createEditMock(newUser);
            document = parseHTML(createMockTemplate(mockContent));
        });

        test('renders correct title for new user', () => {
            const title = queryByTestId(document, 'page-title');
            expect(title).toBeInTheDocument();
            expect(title?.textContent?.trim()).toBe('Add User');
        });

        test('renders empty form fields', () => {
            const nameInput = queryByTestId(document, 'name-input') as HTMLInputElement;
            const emailInput = queryByTestId(document, 'email-input') as HTMLInputElement;
            
            expect(nameInput).toBeInTheDocument();
            expect(emailInput).toBeInTheDocument();
            
            expect(nameInput.value).toBe('');
            expect(emailInput.value).toBe('');
        });
    });

    describe('Edit User Mode', () => {
        let document: Document;
        const mockUser = createMockUser(1, 'John Doe', 'john@example.com');

        beforeEach(() => {
            const mockContent = createEditMock(mockUser);
            document = parseHTML(createMockTemplate(mockContent));
        });

        test('renders correct title for editing user', () => {
            const title = queryByTestId(document, 'page-title');
            expect(title).toBeInTheDocument();
            expect(title?.textContent?.trim()).toBe('Edit User');
        });

        test('renders form with user data', () => {
            const nameInput = queryByTestId(document, 'name-input') as HTMLInputElement;
            const emailInput = queryByTestId(document, 'email-input') as HTMLInputElement;
            
            expect(nameInput).toBeInTheDocument();
            expect(emailInput).toBeInTheDocument();
            
            expect(nameInput.value).toBe(mockUser.name);
            expect(emailInput.value).toBe(mockUser.email);
        });

        test('renders form with correct action', () => {
            const form = queryByTestId(document, 'edit-form') as HTMLFormElement;
            expect(form).toBeInTheDocument();
            expect(form.getAttribute('action')).toBe(`/users/edit/${mockUser.id}`);
        });
    });

    describe('Error State', () => {
        let document: Document;
        const newUser = createMockUser(null as any, '', '');
        const errorMessage = 'Test error message';

        beforeEach(() => {
            const mockContent = createEditMock(newUser, errorMessage);
            document = parseHTML(createMockTemplate(mockContent));
        });

        test('displays error message when present', () => {
            const errorElement = queryByTestId(document, 'error-message');
            expect(errorElement).toBeInTheDocument();
            expect(errorElement?.textContent?.trim()).toBe(errorMessage);
        });
    });

    test('renders save and back buttons', () => {
        const newUser = createMockUser(null as any, '', '');
        const mockContent = createEditMock(newUser);
        const document = parseHTML(createMockTemplate(mockContent));

        const saveButton = queryByTestId(document, 'save-button');
        const backButton = queryByTestId(document, 'back-button');

        expect(saveButton).toBeInTheDocument();
        expect(backButton).toBeInTheDocument();

        expect(saveButton?.textContent?.trim()).toBe('Save');
        expect(backButton?.textContent?.trim()).toBe('Back to List');
    });
}); 