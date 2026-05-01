import axios from 'axios'
import type { Task } from '../types/Task'
import type { CreateTaskDTO } from '../types/Task'

const API_URL = 'http://localhost:8080/api'

//Creamos una instancia de axios con la URL base del backend, para no tener ue escribir la URL en cada petición
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

//Obtener todas las tareas
export const getTasks = async (): Promise<Task[]> => {
    const response = await api.get('/tasks')
    return response.data
}

//Obtener una tarea por id
export const getTaskById = async (id: number): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`)
    return response.data   
}

//Crear una nueva tarea
export const createTask = async (task: CreateTaskDTO): Promise<Task> => {
    const response = await api.post('/tasks', task)
    return response.data
}

//Actualizar una tarea
export const updateTask = async (id: number, task: CreateTaskDTO): Promise<Task> => {
    const response = await api.put(`/tasks/${id}`, task)
    return response.data
}

//Cambiar el estado de la tarea
export const changeTaskStatus = async (id: number, estado: Task['estado']): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}/status`, null, {
     params: {
         estado
     }   
    })
    return response.data
}

//Eliminar una tarea
export const deleteTask = async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`)
}

