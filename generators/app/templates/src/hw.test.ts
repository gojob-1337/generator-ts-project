import { HW } from './hw';

it('returns the greeting', () => {
  const foo = 'bar';
  const hw = new HW(foo);
  expect(hw.get()).toBe(foo);
})

