"use client"
import axios from 'axios';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';


export function LogoutButton() {
    const router = useRouter();
    const handleLogout = async () => {
        try {
            const response = await axios.post('/api/logout');
            if (response.status === 200) {
                router.push('/login')
            }
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
        >
            <LogOut className="w-5 h-5" /> {/* Ajuste o tamanho do ícone */}
            Sair
        </button>

    );
}
