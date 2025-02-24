import ejs from 'ejs';
import path from 'path';
import fs from 'fs';
import { JSDOM } from 'jsdom';

export function renderTemplate(templatePath: string, data: any = {}): string {
    const templateDir = path.join(process.cwd(), 'src', 'views');
    const fullPath = path.join(templateDir, templatePath);
    
    // Read the template content
    let template = fs.readFileSync(fullPath, 'utf-8');
    
    // Add mock includes if they don't exist in the template
    if (!template.includes('header.ejs')) {
        template = '<%- include("../partials/header.ejs") %>\n' + template;
    }
    if (!template.includes('footer.ejs')) {
        template += '\n<%- include("../partials/footer.ejs") %>';
    }

    try {
        return ejs.render(template, {
            ...data,
            filename: fullPath,
            include: (file: string, data: any) => {
                const includePath = path.join(path.dirname(fullPath), file);
                const includeContent = fs.readFileSync(includePath, 'utf-8');
                return ejs.render(includeContent, data);
            }
        });
    } catch (error) {
        console.error('Error rendering template:', error);
        return '';
    }
}

export function parseHTML(html: string): Document {
    const dom = new JSDOM(html);
    return dom.window.document;
}

export function queryByTestId(doc: Document, testId: string): Element | null {
    return doc.querySelector(`[data-testid="${testId}"]`);
}

export function queryAllByTestId(doc: Document, testId: string): Element[] {
    return Array.from(doc.querySelectorAll(`[data-testid="${testId}"]`));
}

// Helper function to create a mock template for testing
export function createMockTemplate(content: string): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test</title>
        </head>
        <body>
            ${content}
        </body>
        </html>
    `;
}

// Helper function to create mock data
export function createMockUser(id: number, name: string, email: string) {
    return { id, name, email };
}

// Helper function to create a details view mock
export function createDetailsMock(user: any): string {
    return `
        <div class="container">
            <h1 data-testid="page-title">User Details</h1>
            <div class="user-details" data-testid="user-details">
                <div class="detail-row" data-testid="user-id">
                    <label>ID:</label>
                    <span>${user.id}</span>
                </div>
                <div class="detail-row" data-testid="user-name">
                    <label>Name:</label>
                    <span>${user.name}</span>
                </div>
                <div class="detail-row" data-testid="user-email">
                    <label>Email:</label>
                    <span>${user.email}</span>
                </div>
                <div class="actions">
                    <a href="/users/edit/${user.id}" class="button" data-testid="edit-button">Edit</a>
                    <form action="/users/remove/${user.id}" method="POST" style="display: inline;">
                        <button type="submit" class="button delete" data-testid="delete-button">Delete</button>
                    </form>
                    <a href="/users" class="button back" data-testid="back-button">Back to List</a>
                </div>
            </div>
        </div>
    `;
}

// Helper function to create an edit view mock
export function createEditMock(user: any, error?: string): string {
    return `
        <div class="container">
            <h1 data-testid="page-title">${user.id ? 'Edit User' : 'Add User'}</h1>
            ${error ? `
                <div class="error-message" data-testid="error-message">
                    ${error}
                </div>
            ` : ''}
            <form action="/users/edit/${user.id || ''}" method="POST" class="edit-form" data-testid="edit-form">
                <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" value="${user.name}" required data-testid="name-input">
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" value="${user.email}" required data-testid="email-input">
                </div>
                <div class="form-actions">
                    <button type="submit" class="button" data-testid="save-button">Save</button>
                    <a href="/users" class="button back" data-testid="back-button">Back to List</a>
                </div>
            </form>
        </div>
    `;
} 