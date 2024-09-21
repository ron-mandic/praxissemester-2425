from enum import Enum

from fastapi import FastAPI, HTTPException, Path, Query, Depends, status as Status
from pydantic import BaseModel, Field
# from jose import jwt
# from fastapi.security import 0Auth2PasswordBearer, OAuth2PasswordRequestForm
# from typing import Optional

# You can give your API a title and add additional metadata such as a description and version
# The description als supports markdown formatting 
app = FastAPI(
    title="Inventory API",
    description="A simple API to manage an inventory of items",
    version="0.1.0"
)

# Docstrings of classes will be reflected in the OpenAPI documentation in the section "Schemas"
class Category(str, Enum):
    """Enum class for item categories"""

    TOOLS = "tools"
    CONSUMABLES = "consumables"

# Inheriting from Pydantic's BaseModel allows us to use Pydantic types, built-in validation
# Even if we were to use a regular @dataclass validation would still be handled by FastAPI
# You can add metadata to attributes using the Field class
# This information will also be shown in the auto-generated OpenAPI documentation
class Item(BaseModel):
    """Model class for items in the inventory"""

    name: str = Field(description="The name of the item")
    price: float = Field(description="The price of the item")
    count: int = Field(description="The number of items in stock")
    id: int = Field(description="The unique identifier of the item")
    category: Category = Field(description="The category of the item")

Selection = dict[str, str | int | float | Category | None]

items = {
    0: Item(name="Screwdriver", price=10.0, count=50, id=0, category=Category.TOOLS),
    1: Item(name="Wrench", price=15.0, count=100, id=1, category=Category.TOOLS),
    2: Item(name="Screws", price=0.1, count=1000, id=2, category=Category.CONSUMABLES)
}

# FastAPI handles JSON serialization and deserialization for us
# We can simply use built-in python and Pydanitc types, in this case dict[int, Item]
# e.g. /
@app.get("/")
def index() -> dict[str, dict[int, Item]]:
    return {"items": items}

# FastAPI also handles the type validation for us
# e.g. /items/0
@app.get("/items/{item_id}")
def query_item_by_id(item_id: int) -> Item:
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    return items[item_id]

# e.g. /items/?name=Screwdriver&price=10.0&count=50&category=tools
@app.get("/items/")
def query_item_by_parameter(
    name: str | None = None,
    price: float | None = None,
    count: int | None = None,
    category: Category | None = None 
) -> dict[str, Selection]:
    def check_item(item: Item) -> bool:
        return all(
            (
                name is None or item.name == name,
                price is None or item.price == price,
                count is None or item.count == count,
                category is None or item.category == category
            )
        )
    
    selection = [item for item in items.values() if check_item(item)]
    return {
        "query": {"name": name, "price": price, "count": count, "category": category},
        "selection": selection
    }

# FastAPI autoomatically transforms the JSON data into Pydantic objects
# e.g. / with json({"name": "Hammer", "price": 20.0, "count": 25, "id": 3, "category": "tools"})
# also: You can also define a response_model such as RsponseItem (it needs to be a subset of Item)
@app.post("/") # @app.post("/", response_model=ResponseItem)
def add_item(item: Item) -> dict[str, Item]:
    if item.id in items:
        raise HTTPException(status_code=400, detail="Item already exists with id: {item.id}")

    items[item.id] = item
    return {"added": item}

# e.g. /items/0?count=100
@app.put(
    "/items/{item_id}",
    resposes = {
        404: {"description": "Item not found"},
        400: {"description": "No update information provided for item"}
    }
)
def update(
    item_id: int = Path(ge=0),
    name: str | None = Query(default=None, min_length=1, max_length=8),
    price: float | None = Query(default=None, gt=0.0),
    count: int | None = Query(default=None, ge=0),
) -> dict[str, Item]:
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    
    if (all(info is None for info in (name, price, count))):
        raise HTTPException(status_code=400, detail="No update information provided for item")
    
    item = items[item_id]
    if name is not None:
        item.name = name
    if price is not None:
        item.price = price
    if count is not None:
        item.count = count

    return {"updated": item}

# e.g. /items/0
@app.delete("/items/{item_id}")
def delete(item_id: int) -> dict[str, Item]:
    if item_id not in items:
        raise HTTPException(status_code=404, detail="Item not found")
    
    item = items.pop(item_id)
    return {"deleted": item}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="127.0.0.1", port=8000)