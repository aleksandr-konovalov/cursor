import '@testing-library/jest-dom';

// Setup TextEncoder and TextDecoder for JSDOM
if (typeof global.TextEncoder === 'undefined') {
    const { TextEncoder, TextDecoder } = require('util');
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;
}

// Mock EJS includes
jest.mock('ejs', () => ({
    render: (template: string, data: any, options: any) => {
        // Simple mock that just returns the template
        return template;
    }
}));

// Mock file system operations
jest.mock('fs', () => ({
    readFileSync: (path: string) => {
        // Return mock templates based on the path
        if (path.includes('header.ejs')) {
            return '<header><h1>User Management System</h1><nav></nav></header>';
        }
        if (path.includes('footer.ejs')) {
            return '<footer><p>&copy; 2024</p></footer>';
        }
        // Return the original template for the main views
        return '';
    }
}));

// Setup global document for JSDOM
if (!global.document) {
    global.document = window.document;
} 