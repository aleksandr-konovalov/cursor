import { User, TeamMember } from './user';
import { UserRequest, UserResponse } from './express';

// Mock data types
export type MockUser = Required<User>;
export type MockTeamMember = Required<TeamMember>;

// Test data factory types
export type CreateUserOptions = Partial<User>;
export type CreateTeamMemberOptions = Partial<TeamMember>;

// Mock request/response types
export type MockRequestOptions = {
    params?: Record<string, string>;
    body?: Record<string, any>;
    query?: Record<string, string>;
    headers?: Record<string, string>;
};

export type MockResponseOptions = {
    locals?: Record<string, any>;
    statusCode?: number;
};

// Test result types
export type TestResult<T> = {
    success: boolean;
    data?: T;
    error?: Error;
};

// View test types
export type ViewTestData = {
    document: Document;
    elements: {
        [key: string]: Element | null;
    };
};

// Controller test types
export type ControllerTestContext = {
    req: UserRequest;
    res: UserResponse;
    mockUser: MockUser;
    mockTeamMember: MockTeamMember;
};

// Test utility types
export type TestCase<Input, Expected> = {
    name: string;
    input: Input;
    expected: Expected;
};

export type ValidationTestCase = TestCase<{
    name?: string;
    email?: string;
}, {
    isValid: boolean;
    errorMessage?: string;
}>;

// Mock function types
export type MockFunction<T extends (...args: any[]) => any> = jest.Mock<ReturnType<T>, Parameters<T>>;

// Assertion helper types
export type ElementAssertion = {
    element: Element | null;
    testId: string;
    expectedContent?: string;
    expectedAttributes?: Record<string, string>;
};

// Test suite configuration types
export type TestSuiteConfig = {
    setupFiles?: string[];
    mockData?: Record<string, any>;
    cleanup?: (() => void)[];
};

// Route test types
export type RouteTestCase = TestCase<{
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    params?: Record<string, string>;
    body?: Record<string, any>;
}, {
    statusCode: number;
    responseType: 'view' | 'redirect' | 'json';
    redirectPath?: string;
    viewName?: string;
}>;

// Template test types
export type TemplateTestCase = TestCase<{
    templateName: string;
    data: Record<string, any>;
}, {
    containsElements: string[];
    notContainsElements?: string[];
    textContent?: Record<string, string>;
}>; 