"use client";

import { useState, useCallback } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useStatsStore } from "@/store/statsStore";
import { Plus, Trash2, Star, GripVertical } from "lucide-react";
import confetti from "canvas-confetti";

export default function TaskList() {
    const { tasks, addTask, deleteTask, toggleTask, setFocusPriority, reorderTasks } = useTaskStore();
    const { addTaskCompleted } = useStatsStore();
    const [newTask, setNewTask] = useState("");
    const [dragIndex, setDragIndex] = useState<number | null>(null);

    const handleAdd = useCallback(() => {
        if (newTask.trim()) {
            addTask(newTask.trim());
            setNewTask("");
        }
    }, [newTask, addTask]);

    const handleToggle = useCallback(
        (id: string, completed: boolean) => {
            toggleTask(id);
            if (!completed) {
                addTaskCompleted();
                confetti({
                    particleCount: 80,
                    spread: 60,
                    origin: { y: 0.7 },
                    colors: ["#6366f1", "#ec4899", "#f59e0b", "#10b981"],
                });
            }
        },
        [toggleTask, addTaskCompleted]
    );

    const handleDragStart = (index: number) => setDragIndex(index);
    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (dragIndex !== null && dragIndex !== index) {
            reorderTasks(dragIndex, index);
            setDragIndex(index);
        }
    };

    const incompleteTasks = tasks.filter((t) => !t.completed);
    const completedTasks = tasks.filter((t) => t.completed);

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                📋 Tasks
                <span className="text-xs text-white/40 font-normal">
                    {incompleteTasks.length} remaining
                </span>
            </h3>

            {/* Add Task Input */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    placeholder="Add a task..."
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm outline-none focus:border-white/30 transition-colors backdrop-blur-md"
                />
                <button
                    onClick={handleAdd}
                    className="p-2 rounded-lg bg-indigo-500/80 hover:bg-indigo-500 text-white transition-all hover:scale-105 active:scale-95"
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin pr-1">
                {incompleteTasks.map((task, index) => (
                    <div
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={() => setDragIndex(null)}
                        className={`group flex items-center px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all cursor-grab active:cursor-grabbing ${task.isFocusPriority ? "ring-1 ring-yellow-400/50 bg-yellow-400/5" : ""
                            }`}
                    >
                        <GripVertical size={14} className="text-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mr-1" />

                        {/* Checkbox */}
                        <button
                            onClick={() => handleToggle(task.id, task.completed)}
                            className="w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all hover:scale-110 flex items-center justify-center mr-3"
                            style={{ borderColor: task.color }}
                        >
                            <span className="w-2.5 h-2.5 rounded-full opacity-0 hover:opacity-50 transition-opacity" style={{ backgroundColor: task.color }} />
                        </button>

                        <span className="text-xs flex-shrink-0 mr-2">{task.emoji}</span>
                        <span className="flex-1 text-sm text-white/80 truncate mr-2">{task.text}</span>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setFocusPriority(task.id)}
                                className={`p-1.5 rounded transition-all ${task.isFocusPriority
                                        ? "text-yellow-400"
                                        : "text-white/30 hover:text-yellow-400 hover:bg-white/10"
                                    }`}
                                title="Set as focus priority"
                            >
                                <Star size={14} fill={task.isFocusPriority ? "currentColor" : "none"} />
                            </button>
                            <button
                                onClick={() => deleteTask(task.id)}
                                className="p-1.5 rounded text-white/30 hover:text-red-400 hover:bg-white/10 transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5">
                        <p className="text-xs text-white/30 mb-2">
                            Completed ({completedTasks.length})
                        </p>
                        {completedTasks.map((task) => (
                            <div
                                key={task.id}
                                className="group flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
                            >
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className="w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                                    style={{ borderColor: task.color, backgroundColor: task.color }}
                                >
                                    <span className="text-white text-xs">✓</span>
                                </button>
                                <span className="text-xs">{task.emoji}</span>
                                <span className="flex-1 text-sm text-white/30 line-through truncate">{task.text}</span>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="p-1 text-white/10 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {tasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-white/20">
                        <p className="text-3xl mb-2">✨</p>
                        <p className="text-sm">No tasks yet. Add one above!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
