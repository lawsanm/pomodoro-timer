import { create } from "zustand";

export interface Task {
    id: string;
    text: string;
    completed: boolean;
    emoji: string;
    color: string;
    isFocusPriority: boolean;
    createdAt: number;
}

const COLORS = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#8b5cf6"];
const EMOJIS = ["📝", "💡", "🎯", "📚", "💻", "✏️", "🔬", "📊"];

interface TaskStore {
    tasks: Task[];
    addTask: (text: string) => void;
    deleteTask: (id: string) => void;
    toggleTask: (id: string) => void;
    setFocusPriority: (id: string) => void;
    reorderTasks: (fromIndex: number, toIndex: number) => void;
    getFocusTask: () => Task | undefined;
    loadFromStorage: () => void;
    saveToStorage: () => void;
}

const STORAGE_KEY = "lawzen-tasks";

export const useTaskStore = create<TaskStore>((set, get) => ({
    tasks: [],

    addTask: (text) => {
        const task: Task = {
            id: crypto.randomUUID(),
            text,
            completed: false,
            emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            isFocusPriority: false,
            createdAt: Date.now(),
        };
        set((state) => ({ tasks: [...state.tasks, task] }));
        get().saveToStorage();
    },

    deleteTask: (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
        get().saveToStorage();
    },

    toggleTask: (id) => {
        set((state) => ({
            tasks: state.tasks.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            ),
        }));
        get().saveToStorage();
    },

    setFocusPriority: (id) => {
        set((state) => ({
            tasks: state.tasks.map((t) => ({
                ...t,
                isFocusPriority: t.id === id ? !t.isFocusPriority : false,
            })),
        }));
        get().saveToStorage();
    },

    reorderTasks: (fromIndex, toIndex) => {
        set((state) => {
            const newTasks = [...state.tasks];
            const [removed] = newTasks.splice(fromIndex, 1);
            newTasks.splice(toIndex, 0, removed);
            return { tasks: newTasks };
        });
        get().saveToStorage();
    },

    getFocusTask: () => {
        return get().tasks.find((t) => t.isFocusPriority && !t.completed);
    },

    loadFromStorage: () => {
        if (typeof window === "undefined") return;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) set({ tasks: JSON.parse(raw) });
        } catch { /* ignore */ }
    },

    saveToStorage: () => {
        if (typeof window === "undefined") return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(get().tasks));
    },
}));
