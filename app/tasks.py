from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from models import Task
from auth import get_current_user
from database import get_db
from pydantic import BaseModel

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)

# Esquemas de datos para validar las solicitudes y respuestas
class TaskRequest(BaseModel):
    title: str
    description: str
    scheduled_date: datetime

class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    scheduled_date: datetime
    user_id: int

    class Config:
        orm_mode = True


# Crear una nueva tarea
@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskRequest, 
                      db: Session = Depends(get_db),
                      user: dict = Depends(get_current_user)):
    new_task = Task(
        title=task.title,
        description=task.description,
        scheduled_date=task.scheduled_date,
        user_id=user["id"]
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


# Listar todas las tareas del usuario autenticado
@router.get("/", response_model=List[TaskResponse])
async def list_tasks(db: Session = Depends(get_db), 
                     user: dict = Depends(get_current_user)):
    tasks = db.query(Task).filter(Task.user_id == user["id"]).all()
    return tasks


# Eliminar una tarea específica
@router.delete("/{task_id}")
async def delete_task(task_id: int, 
                      db: Session = Depends(get_db), 
                      user: dict = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user["id"]).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}
