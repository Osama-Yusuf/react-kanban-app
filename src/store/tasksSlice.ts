import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('tasks');
        if (serializedState === null) {
            return {
                tasks: [],
                draggedTask: null
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return {
            tasks: [],
            draggedTask: null
        };
    }
};

const saveState = (state: { tasks: Task[], draggedTask: Task | null }) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('tasks', serializedState);
    } catch {
        // Ignore write errors.
    }
};

const initialState = loadState();

type UpdateTaskTable = {
    taskID: string,
    tableID: string,
}

export const tasksSlice = createSlice({
    name: 'categories',

    initialState,

    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
            saveState(state);
        },
        deleteTask: (state, action: PayloadAction<Task>) => {
            state.tasks.splice(state.tasks.findIndex((item: Task) => item.id === action.payload.id), 1);
            saveState(state);
        },
        updateTask: (state, action: PayloadAction<Task>) => {
            const index = state.tasks.findIndex((item: Task) => item.id === action.payload.id);
            state.tasks[index] = action.payload;
            saveState(state);
        },
        setDraggedTask: (state, action: PayloadAction<Task | null>) => {
            state.draggedTask = action.payload;
        },
        updateTaskTable: (state, action: PayloadAction<UpdateTaskTable>) => {
            let val = state.tasks.find((item: Task) => item.id === action.payload.taskID);
            if (val) {
                val.tableID = action.payload.tableID;
                saveState(state);
            }
        }
    }
})

export const { addTask, updateTask, setDraggedTask, updateTaskTable, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer;
