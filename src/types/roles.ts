export const Roles = {
    ADMIN: 'admin',
    USER: 'user',
    EDITOR: 'editor',
    OWNER: 'owner',
    VIEWER: 'viewer'
} as const;

export type RoleType = typeof Roles[keyof typeof Roles];