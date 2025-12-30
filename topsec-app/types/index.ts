export interface Client {
    id: number;
    name: string;
    location?: string;
}

export interface Guard {
    id: number;
    name: string;
    idNumber: string;
    phoneNumber?: string | null;
    homeResidence: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    posts?: PostGuard[]; // Points to the assignment records
}

// 1. Updated PostGuard to include the new backend fields
export interface PostGuard {
    id: number;          // Primary key from backend
    postId: number;
    guardId: number;
    shift: 'DAY' | 'NIGHT'; // Added: Critical for frontend filtering
    assignedAt: string;     // Added: To show deployment date
    post?: Post;
    guard: Guard;        // The actual guard details
}

// 2. Updated Post to include the guards array
export interface Post {
    id: number;
    title: string;
    content?: string | null;
    location?: string;
    clientId: number;
    client: Client;
    guards: PostGuard[]; // Array of assignments (can have multiple)
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: number;
}