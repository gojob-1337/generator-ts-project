export class HW {
  constructor(private greeting: string) {}
  log() {
    process.stdout.write(this.greeting + '\n');
  }
  get() {
    return this.greeting;
  }
}