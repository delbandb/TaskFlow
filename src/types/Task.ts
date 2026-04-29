export interface Task {

    id: number
    titulo: string
    descripcion: string
    estado: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADO'
    prioridad: 'BAJA' | 'MEDIA' | 'ALTA'
    creadoEn: string
    venceEn?: string
}
export type CreateTaskDTO = Omit<Task, 'id' | 'creadoEn'>
