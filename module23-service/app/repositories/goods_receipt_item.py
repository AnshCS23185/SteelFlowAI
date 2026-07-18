from sqlalchemy.orm import Session
from app.models.goods_receipt_item import GoodsReceiptItem
from app.repositories.base import BaseRepository

class GoodsReceiptItemRepository(BaseRepository[GoodsReceiptItem]):
    def __init__(self, db: Session):
        super().__init__(GoodsReceiptItem, db)
