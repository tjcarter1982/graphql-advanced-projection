const {
  unwindPath,
  normalize,
  matchSchema,
} = require('../src/schema');

describe('unwindPath', () => {
  it('should unwind', () => {
    expect(unwindPath({
      prev: {
        prev: undefined,
        key: 'k',
      },
      key: 'k2',
    })).toEqual(['k', 'k2']);
  });
});

describe('normalize', () => {
  it('should accept object', () => {
    expect(normalize({ obj: true })).toEqual([[{}, { obj: true }]]);
  });

  it('should accept missing', () => {
    // eslint-disable-next-line no-sparse-arrays
    expect(normalize([[, { k: 1 }]])).toEqual([
      [[[null]], { k: 1 }],
    ]);
  });

  it('should accept undefined', () => {
    expect(normalize([[undefined, { k: 1 }]])).toEqual([
      [[[null]], { k: 1 }],
    ]);
  });

  it('should accept null', () => {
    expect(normalize([[null, { k: 1 }]])).toEqual([
      [[], { k: 1 }],
    ]);
  });

  it('should accept string', () => {
    expect(normalize([['aa', { k: 1 }]])).toEqual([
      [[['aa', null]], { k: 1 }],
    ]);
  });

  it('should accept array', () => {
    expect(normalize([[['a', 'b'], { k: 1 }]])).toEqual([
      [[['a', 'b']], { k: 1 }],
    ]);
  });

  it('should accept regular', () => {
    expect(normalize([[[['c']], { k: 1 }]])).toEqual([
      [[['c']], { k: 1 }],
    ]);
  });
});

describe('matchSchema', () => {
  it('should match empty', () => {
    const func = (...args) => matchSchema([])(args);
    expect(func()).toEqual(true);
    expect(func('a')).toEqual(false);
    expect(func('a', 'b')).toEqual(false);
    expect(func('a', 0, 1)).toEqual(false);
    expect(func('a', 'b', 0, 1)).toEqual(false);
    expect(func('a', 'a')).toEqual(false);
    expect(func('a', 0, 'a', 1)).toEqual(false);
  });

  it('should match simple', () => {
    const func = (...args) => matchSchema(['a'])(args);
    expect(func()).toEqual(false);
    expect(func('a')).toEqual(true);
    expect(func('a', 'b')).toEqual(false);
    expect(func('a', 0, 1)).toEqual(true);
    expect(func('a', 'b', 0, 1)).toEqual(false);
    expect(func('a', 'a')).toEqual(false);
    expect(func('a', 0, 'a', 1)).toEqual(false);
  });

  it('should match null', () => {
    const func = (...args) => matchSchema([null])(args);
    expect(func()).toEqual(true);
    expect(func('a')).toEqual(true);
    expect(func('a', 'b')).toEqual(true);
    expect(func('a', 0, 1)).toEqual(true);
    expect(func('a', 'b', 0, 1)).toEqual(true);
    expect(func('a', 'a')).toEqual(true);
    expect(func('a', 0, 'a', 1)).toEqual(true);
  });

  it('should match null simple', () => {
    const func = (...args) => matchSchema([null, 'b'])(args);
    expect(func()).toEqual(false);
    expect(func('a')).toEqual(false);
    expect(func('a', 'b')).toEqual(true);
    expect(func('a', 0, 1)).toEqual(false);
    expect(func('a', 'b', 0, 1)).toEqual(true);
    expect(func('a', 'a')).toEqual(false);
    expect(func('a', 0, 'a', 1)).toEqual(false);
  });

  it('should match simple null', () => {
    const func = (...args) => matchSchema(['a', null])(args);
    expect(func()).toEqual(false);
    expect(func('a')).toEqual(true);
    expect(func('a', 'b')).toEqual(true);
    expect(func('a', 0, 1)).toEqual(true);
    expect(func('a', 'b', 0, 1)).toEqual(true);
    expect(func('a', 'a')).toEqual(true);
    expect(func('a', 0, 'a', 1)).toEqual(true);
  });

  it('should match simple dup', () => {
    const func = (...args) => matchSchema(['a', 'a'])(args);
    expect(func()).toEqual(false);
    expect(func('a')).toEqual(false);
    expect(func('a', 'b')).toEqual(false);
    expect(func('a', 0, 1)).toEqual(false);
    expect(func('a', 'b', 0, 1)).toEqual(false);
    expect(func('a', 'a')).toEqual(true);
    expect(func('a', 0, 'a', 1)).toEqual(true);
  });

  it('should match simple simple', () => {
    const func = (...args) => matchSchema(['a', 'b'])(args);
    expect(func()).toEqual(false);
    expect(func('a')).toEqual(false);
    expect(func('a', 'b')).toEqual(true);
    expect(func('a', 0, 1)).toEqual(false);
    expect(func('a', 'b', 0, 1)).toEqual(true);
    expect(func('a', 'a')).toEqual(false);
    expect(func('a', 0, 'a', 1)).toEqual(false);
  });

  it('should match null simple simple', () => {
    const func = (...args) => matchSchema([null, 'a', 'b'])(args);
    expect(func()).toEqual(false);
    expect(func('a')).toEqual(false);
    expect(func('a', 'b')).toEqual(true);
    expect(func('a', 0, 1)).toEqual(false);
    expect(func('a', 'b', 0, 1)).toEqual(true);
    expect(func('a', 'a')).toEqual(false);
    expect(func('a', 0, 'a', 1)).toEqual(false);
  });

  it('should match simple null simple', () => {
    const func = (...args) => matchSchema(['a', null, 'b'])(args);
    expect(func()).toEqual(false);
    expect(func('a')).toEqual(false);
    expect(func('a', 'b')).toEqual(true);
    expect(func('a', 0, 1)).toEqual(false);
    expect(func('a', 'b', 0, 1)).toEqual(true);
    expect(func('a', 'a')).toEqual(false);
    expect(func('a', 0, 'a', 1)).toEqual(false);
  });

  it('should match null null', () => {
    const func = (...args) => matchSchema([null, null])(args);
    expect(func()).toEqual(true);
    expect(func('a')).toEqual(true);
    expect(func('a', 'b')).toEqual(true);
    expect(func('a', 0, 1)).toEqual(true);
    expect(func('a', 'b', 0, 1)).toEqual(true);
    expect(func('a', 'a')).toEqual(true);
    expect(func('a', 0, 'a', 1)).toEqual(true);
  });

  it('should match wrong simple', () => {
    const func = (...args) => matchSchema(['b'])(args);
    expect(func()).toEqual(false);
    expect(func('a')).toEqual(false);
    expect(func('a', 'b')).toEqual(false);
    expect(func('a', 0, 1)).toEqual(false);
    expect(func('a', 'b', 0, 1)).toEqual(false);
    expect(func('a', 'a')).toEqual(false);
    expect(func('a', 0, 'a', 1)).toEqual(false);
  });
});