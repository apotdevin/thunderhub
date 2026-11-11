import { stripTrailingSlashes, withTrailingSlash } from './path';

describe('stripTrailingSlashes', () => {
  it('removes a single trailing slash', () => {
    expect(stripTrailingSlashes('/thub/')).toBe('/thub');
  });

  it('removes multiple trailing slashes', () => {
    expect(stripTrailingSlashes('/thub///')).toBe('/thub');
  });

  it('leaves a path without a trailing slash unchanged', () => {
    expect(stripTrailingSlashes('/thub')).toBe('/thub');
  });

  it('reduces the root path to an empty string', () => {
    expect(stripTrailingSlashes('/')).toBe('');
  });

  it('leaves an empty string unchanged', () => {
    expect(stripTrailingSlashes('')).toBe('');
  });

  it('only strips slashes at the end', () => {
    expect(stripTrailingSlashes('/thub/nested/')).toBe('/thub/nested');
  });
});

describe('withTrailingSlash', () => {
  it('appends a slash when missing', () => {
    expect(withTrailingSlash('/thub')).toBe('/thub/');
  });

  it('keeps exactly one trailing slash', () => {
    expect(withTrailingSlash('/thub/')).toBe('/thub/');
  });

  it('collapses multiple trailing slashes to one', () => {
    expect(withTrailingSlash('/thub///')).toBe('/thub/');
  });

  it('turns an empty string into the root path', () => {
    expect(withTrailingSlash('')).toBe('/');
  });

  it('keeps the root path as is', () => {
    expect(withTrailingSlash('/')).toBe('/');
  });
});
