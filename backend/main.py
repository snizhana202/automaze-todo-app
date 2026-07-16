from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

import models, schemas, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Automaze TODO API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(
    search: Optional[str] = None,
    status: Optional[str] = Query(None, description="all / done / undone"),
    sort_by_priority: Optional[str] = Query(None, description="asc / desc"),
    db: Session = Depends(database.get_db)
):
    query = db.query(models.Task)

    if search:
        query = query.filter(models.Task.title.ilike(f"%{search}%"))

    if status == "done":
        query = query.filter(models.Task.is_completed == True)
    elif status == "undone":
        query = query.filter(models.Task.is_completed == False)

    if sort_by_priority == "asc":
        query = query.order_by(models.Task.priority.asc())
    elif sort_by_priority == "desc":
        query = query.order_by(models.Task.priority.desc())
    else:
        query = query.order_by(models.Task.id.desc())

    return query.all()

@app.post("/tasks", response_model=schemas.TaskResponse, status_code=201)
def create_task(task: schemas.TaskCreate, db: Session = Depends(database.get_db)):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.put("/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task_data: schemas.TaskUpdate, db: Session = Depends(database.get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
        
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(database.get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}