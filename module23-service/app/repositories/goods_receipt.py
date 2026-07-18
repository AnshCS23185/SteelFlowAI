from sqlalchemy.orm import Session
from app.models.goods_receipt import GoodsReceipt
from app.repositories.base import BaseRepository

class GoodsReceiptRepository(BaseRepository[GoodsReceipt]):
    def __init__(self, db: Session):
        super().__init__(GoodsReceipt, db)
        
    def get_by_grn(self, grn_number: str) -> GoodsReceipt:
        return self.db.query(GoodsReceipt).filter(GoodsReceipt.grn_number == grn_number).first()
