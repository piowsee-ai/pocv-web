export interface Session {
    token: string;
    userId: string;
    expiresAt: Date;
}

export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string;
}

export interface SessionData {
    user: Session;
    session: User;
}

// improved version: (not used right now)
// export interface Session {
//     token: string;
//     userId: string;
//     expiresAt: Date;
//     createdAt: Date;
//     updatedAt: Date;
//     ipAddress?: string;
//     userAgent?: string;
// }

// export interface User {
//     id: string;
//     name: string;
//     email: string;
//     emailVerified: boolean;
//     image?: string;
//     createdAt: Date;
//     updatedAt: Date;
// }


// add "| null" if needed