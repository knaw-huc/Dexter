export class MapResult<RESULT = undefined> {
  private mapped: RESULT;
  constructor(mapped?: RESULT) {
    this.mapped = mapped;
  }
  public onSuccess(run: (mapped: RESULT) => void) {
    if (this.mapped !== undefined) {
      run(this.mapped);
    }
  }
}
export const notMapped = new MapResult();
