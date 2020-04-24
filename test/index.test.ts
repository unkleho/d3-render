import render from '../src';

describe('Render', () => {
  it('should return empty selection', () => {
    expect(render('.test', [])).toEqual({ _groups: [], _parents: [] });
  });
});
