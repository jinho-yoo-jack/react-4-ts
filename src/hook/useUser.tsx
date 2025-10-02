import {useState} from 'react';

export type UserRole = 'admin' | 'viewer';

interface User {
    id: number;
    name: string;
    role: UserRole;
}

export function useUser(): [User, React.Dispatch<React.SetStateAction<User>>] {
    const [user, setUser] = useState<User>({
        id: 1,
        name: 'Kent C. Dodds',
        role: 'admin',
    });

    return [user, setUser];
}