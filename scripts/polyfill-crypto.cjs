// Ensure globalThis.crypto exists in Node environments (GitHub Actions)
if (typeof globalThis.crypto === 'undefined') {
  try {
    // Prefer webcrypto if available
    const nodeCrypto = require('crypto');
    if (nodeCrypto.webcrypto) {
      globalThis.crypto = nodeCrypto.webcrypto;
    } else {
      // Fallback: provide minimal getRandomValues using randomBytes
      globalThis.crypto = {
        getRandomValues: function (typedArray) {
          const buf = nodeCrypto.randomBytes(typedArray.length);
          typedArray.set(buf);
          return typedArray;
        },
      };
    }
  } catch (e) {
    // ignore if crypto can't be polyfilled
  }
}
