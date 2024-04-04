export class Stack<T> {

    private storage: T[] = [];

    constructor(private capacity = Infinity) {}
    
    push(item: T): void {
        if (this.size() === this.capacity) {
            throw Error("Max stack capacity has reached");
        }
        this.storage.push(item);
    }

    pop(): T | undefined {
        return this.storage.pop();
    }

    peek(): T | undefined {
        return this.storage[this.size() - 1];
    }

    size(): number {
        return this.storage.length;
    }

    isEmpty(): boolean {
        return this.size() === 0;
    }

    isFull(): boolean {
        return this.size() === this.capacity;
    }

    clear(): void {
        while (!this.isEmpty()) {
            this.pop();
        }
    }
    
    getStack(): T[] {
        return this.storage;
    }
}