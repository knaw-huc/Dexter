export class Mapped<RESULT = undefined> {
  private mapped: RESULT;
  constructor(mapped?: RESULT) {
    this.mapped = mapped;
  }
  public success(run: (mapped: RESULT) => void) {
    if (this.mapped !== undefined) {
      run(this.mapped);
    }
  }
}
export const notMapped = new Mapped();
