import { ShipData } from "./shipData";

export class BattleRequest {
  playerFleet: ShipData[] = [];
  enemyFleet: ShipData[] = [];
  gameId: string;
  endTime: DOMHighResTimeStamp;
}
