from fastapi import APIRouter

router = APIRouter()

@router.get("/GroupsInfo")
async def GroupsInfo():
    return {"data" :[
    { "GroupName": "Group 1", "GroupUsers": ["User A", "User B"], "YourBalance": 150 },
    { "GroupName": "Group 2", "GroupUsers": ["User C", "User D"], "YourBalance": 300 },
  ]}
