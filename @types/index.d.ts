declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';

/**
 * ln-service does not have proper types. This is slightly
 * problematic, as this leads to types being `any` **a ton**
 * of places.
 *
 * Here's an issue tracking this: https://github.com/alexbosworth/ln-service/issues/112
 *
 * It seems like the library is generated from Proto files.
 * Could it be an idea to try and generate TypeScript declarations
 * from those files?
 */
declare module 'ln-service';
