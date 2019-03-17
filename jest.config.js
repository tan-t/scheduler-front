module.exports = {
  moduleNameMapper: {
    '@domain\/(.*)$': '<rootDir>/src/main/domain/$1',
    '@service\/(.*)$': '<rootDir>/src/main/service/$1'
  },
	globals: {
		'ts-jest': {
			tsConfigFile: './tsconfig.json'
		}
	},
	moduleFileExtensions: [
		'ts',
		'js'
	],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	testMatch: [
		'**/test/**/*.test.(ts|js)'
	],
	testEnvironment: 'node'
};
