const storage = new Map();

const mockAsyncStorage = {
  getItem: jest.fn(async (key) => storage.get(key) ?? null),
  setItem: jest.fn(async (key, value) => {
    storage.set(key, String(value));
  }),
  removeItem: jest.fn(async (key) => {
    storage.delete(key);
  }),
  clear: jest.fn(async () => {
    storage.clear();
  }),
  getAllKeys: jest.fn(async () => Array.from(storage.keys())),
};

module.exports = mockAsyncStorage;
module.exports.default = mockAsyncStorage;
