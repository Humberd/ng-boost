export class LocalStorageMock implements Storage {
  [name: string]: any;

  private state = new Map<string, any>();

  get length(): number {
    return this.state.size;
  }

  clear(): void {
    this.state.clear();
  }

  getItem(key: string): string | null {
    return this.state.get(key) || null;
  }

  key(index: number): string | null {
    throw Error('Not implemented yet!');
  }

  removeItem(key: string): void {
    this.state.delete(key);
  }

  setItem(key: string, value: string): void {
    this.state.set(key, value);
  }
}
