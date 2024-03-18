import { WithId } from '../../model/DexterModel';

export function update(toUpdate: WithId, updateIn: WithId[]): void {
  const index = updateIn.findIndex(item => item.id === toUpdate.id);
  updateIn[index] = toUpdate;
}
