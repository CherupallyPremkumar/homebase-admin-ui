/**
 * Artisan Work API
 * Provides task and production metrics for artisan users
 */

// Mock data for artisan work dashboard
const MOCK_ARTISAN_STATS = {
    assignedProducts: 12,
    inProgress: 5,
    completed: 35,
    pendingApproval: 2,
};

const MOCK_ASSIGNED_TASKS: AssignedTask[] = [
    {
        id: 'TASK-001',
        productName: 'Ceramic Vase Set',
        sku: 'VASE-BLUE-001',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        quantity: 10,
        completed: 6,
        assignedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'TASK-002',
        productName: 'Handwoven Table Runner',
        sku: 'RUNNER-RED-002',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        quantity: 15,
        completed: 0,
        assignedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'TASK-003',
        productName: 'Clay Pottery Bowl',
        sku: 'BOWL-EARTH-003',
        status: 'completed',
        priority: 'low',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        quantity: 8,
        completed: 8,
        assignedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'TASK-004',
        productName: 'Decorative Wall Hanging',
        sku: 'WALL-ART-004',
        status: 'pending_approval',
        priority: 'medium',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        quantity: 5,
        completed: 5,
        assignedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

export interface ArtisanStats {
    assignedProducts: number;
    inProgress: number;
    completed: number;
    pendingApproval: number;
}

export interface AssignedTask {
    id: string;
    productName: string;
    sku: string;
    status: 'pending' | 'in_progress' | 'completed' | 'pending_approval';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    quantity: number;
    completed: number;
    assignedDate: string;
}

class ArtisanApiService {
    private getHeaders(): HeadersInit {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const headers: HeadersInit = {
            'Authorization': `Bearer ${token}`,
        };

        const tenantId = localStorage.getItem('userTenantId');
        if (tenantId) {
            headers['x-tenant-id'] = tenantId;
        }

        const sellerId = localStorage.getItem('currentSellerId');
        if (sellerId) {
            headers['x-seller-id'] = sellerId;
        }

        const artisanId = localStorage.getItem('currentArtisanId');
        if (artisanId) {
            headers['x-artisan-id'] = artisanId;
        }

        return headers;
    }

    /**
     * Get artisan work statistics
     */
    async getArtisanStats(): Promise<ArtisanStats> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return MOCK_ARTISAN_STATS;
        }

        const response = await fetch(`${API_BASE_URL}/api/artisan/stats`, {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch artisan stats');
        }

        return response.json();
    }

    /**
     * Get assigned tasks/products
     */
    async getAssignedTasks(): Promise<AssignedTask[]> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return MOCK_ASSIGNED_TASKS;
        }

        const response = await fetch(`${API_BASE_URL}/api/artisan/tasks`, {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch assigned tasks');
        }

        return response.json();
    }

    /**
     * Update task status
     */
    async updateTaskStatus(taskId: string, status: string, completed?: number): Promise<void> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            // Mock: Update local data
            const task = MOCK_ASSIGNED_TASKS.find(t => t.id === taskId);
            if (task) {
                task.status = status as any;
                if (completed !== undefined) {
                    task.completed = completed;
                }
            }
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/artisan/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                ...this.getHeaders(),
            },
            body: JSON.stringify({ status, completed }),
        });

        if (!response.ok) {
            throw new Error('Failed to update task status');
        }
    }
}

export const artisanApi = new ArtisanApiService();
