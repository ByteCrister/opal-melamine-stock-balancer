"use client";

import { BaseStockMovementList } from "@/components/stock-movements/BaseStockMovementList";
import { STOCK_MOVEMENT_TYPE } from "@/const/stock.const";

export function StockInList() {
  return <BaseStockMovementList type={STOCK_MOVEMENT_TYPE.STOCK_IN} />;
}
