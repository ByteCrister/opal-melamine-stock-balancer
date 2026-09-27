"use client";

import { BaseStockMovementList } from "@/components/stock-movements/BaseStockMovementList";
import { STOCK_MOVEMENT_TYPE } from "@/const/stock.const";

export function StockOutList() {
  return <BaseStockMovementList type={STOCK_MOVEMENT_TYPE.STOCK_OUT} />;
}
