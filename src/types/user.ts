export type User = {
    id: number;
    name: string;
    email: string;
    position?: string;
    avatar?: string;
    followers?: number;
    following?: number;
    team?: TeamMember[];
}

export type TeamMember = {
    id: number;
    name: string;
    avatar: string;
}

export type NewUser = Omit<User, 'id'> & {
    id: null;
} 