class HW {
  constructor(public greeting: string) {}
  log() {
    process.stdout.write(this.greeting + '\n');
  }
}

const hw = new HW('Hello World');

hw.log();
