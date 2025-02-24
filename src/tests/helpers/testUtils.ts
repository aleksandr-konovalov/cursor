import { 
    MockUser, 
    MockTeamMember, 
    MockRequestOptions, 
    MockResponseOptions,
    TestResult,
    ElementAssertion,
    ViewTestData,
    ControllerTestContext
} from '../../types/testing';
import { UserRequest, UserResponse } from '../../types/express';

// Create mock user data
export const createMockUser = (overrides: Partial<MockUser> = {}): MockUser => ({
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    position: 'Software Engineer',
    avatar: 'https://via.placeholder.com/150',
    followers: 100,
    following: 50,
    team: [],
    ...overrides
});

// Create mock team member data
export const createMockTeamMember = (overrides: Partial<MockTeamMember> = {}): MockTeamMember => ({
    id: 1,
    name: 'Team Member',
    avatar: 'https://via.placeholder.com/40',
    ...overrides
});

// Create mock request
export const createMockRequest = (options: MockRequestOptions = {}): UserRequest => {
    const { params = {}, body = {}, query = {}, headers = {} } = options;
    return {
        params,
        body,
        query,
        headers,
        get: jest.fn((key: string) => headers[key]),
    } as unknown as UserRequest;
};

// Create mock response
export const createMockResponse = (options: MockResponseOptions = {}): UserResponse => {
    const { locals = {}, statusCode = 200 } = options;
    return {
        locals,
        statusCode,
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        render: jest.fn().mockReturnThis(),
        redirect: jest.fn().mockReturnThis(),
    } as unknown as UserResponse;
};

// Create test context for controller tests
export const createTestContext = (
    reqOptions: MockRequestOptions = {},
    resOptions: MockResponseOptions = {}
): ControllerTestContext => ({
    req: createMockRequest(reqOptions),
    res: createMockResponse(resOptions),
    mockUser: createMockUser(),
    mockTeamMember: createMockTeamMember()
});

// Assert element properties
export const assertElement = ({ 
    element, 
    testId, 
    expectedContent, 
    expectedAttributes 
}: ElementAssertion): TestResult<Element> => {
    if (!element) {
        return {
            success: false,
            error: new Error(`Element with test-id "${testId}" not found`)
        };
    }

    if (expectedContent && element.textContent !== expectedContent) {
        return {
            success: false,
            error: new Error(`Content mismatch for "${testId}". Expected: "${expectedContent}", Got: "${element.textContent}"`)
        };
    }

    if (expectedAttributes) {
        for (const [attr, value] of Object.entries(expectedAttributes)) {
            if (element.getAttribute(attr) !== value) {
                return {
                    success: false,
                    error: new Error(`Attribute "${attr}" mismatch for "${testId}". Expected: "${value}", Got: "${element.getAttribute(attr)}"`)
                };
            }
        }
    }

    return { success: true, data: element };
};

// Parse HTML and extract elements by test-id
export const parseTestView = (html: string): ViewTestData => {
    const parser = new DOMParser();
    const document = parser.parseFromString(html, 'text/html');
    
    const elements: ViewTestData['elements'] = {};
    document.querySelectorAll('[data-testid]').forEach(element => {
        const testId = element.getAttribute('data-testid');
        if (testId) {
            elements[testId] = element;
        }
    });

    return { document, elements };
};

// Wait for element to be present
export const waitForElement = async (
    testId: string, 
    timeout: number = 5000
): Promise<Element | null> => {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
        const element = document.querySelector(`[data-testid="${testId}"]`);
        if (element) return element;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return null;
};

// Clean up test artifacts
export const cleanupTest = () => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
};

// Simulate user events
export const simulateUserEvent = async (
    element: Element | null,
    eventType: 'click' | 'input' | 'submit',
    value?: string
): Promise<void> => {
    if (!element) throw new Error('Element not found');

    switch (eventType) {
        case 'click':
            element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            break;
        case 'input':
            if (value && element instanceof HTMLInputElement) {
                element.value = value;
                element.dispatchEvent(new Event('input', { bubbles: true }));
            }
            break;
        case 'submit':
            if (element instanceof HTMLFormElement) {
                element.dispatchEvent(new Event('submit', { bubbles: true }));
            }
            break;
    }

    // Wait for any potential state updates
    await new Promise(resolve => setTimeout(resolve, 0));
}; 