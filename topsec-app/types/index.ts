export interface Client {
    id: number;
    name: string;
    location?: string;
}


// 2. Update Post to include the guards array
export interface Post {
    id: number;
    title: string;
    content?: string | null;
    clientId: number;
    client: Client;
    guards: PostGuard[]; // <--- This fixes the error in posts.tsx
}

export interface Guard {
    id: number;
    name: string;
    idNumber: string;
    phoneNumber?: string | null;
    homeResidence: string;
    createdAt?: string | Date; 
    updatedAt?: string | Date; 
    posts?: {
        post: {
            id: number;
            title: string;
            client?: {
                name: string;
            };
        };
    }[];
}

// Ensure PostGuard and Post are also synced
export interface PostGuard {
    postId: number;
    guardId: number;
    post: Post;
    guard: Guard;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: number;
}