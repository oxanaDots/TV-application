export const preset = 'jest-expo';
export const transform = {
    '^.+\\.[tj]sx?$': 'babel-jest',
};
export const moduleFileExtensions = ['js', 'jsx', 'ts', 'tsx', 'json'];
export const setupFilesAfterEnv =  ["<rootDir>/jest/setup.js"]
 