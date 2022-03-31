/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface Bootable {
  boot(): Promise<any>;
}
