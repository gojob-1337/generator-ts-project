const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  install() {
    this.yarnInstall(
      [
        '@gojob/tslint-config',
        '@types/node',
        '@types/jest',
        'nodemon',
        'prettier',
        'tslint',
        'tslint-config-prettier',
        'tslint-plugin-prettier',
        'ts-node',
        'typescript',
        'jest',
        'ts-jest',
      ],
      {
        dev: true,
      },
    );
  }

  configuring() {
    // rename gitignore (else removed by npm)
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore'),
    );

    this._copy(
      '.prettierrc',
      'CHANGELOG.md',
      'index.js',
      'jest.json',
      'nodemon.json',
      'README.md',
      'tsconfig.json',
      'tslint.json',
      'src/index.ts',
      'src/hw.ts',
      'src/hw.test.ts',
    );
  }


  /**
   * Complete package.json
   */
  package() {
    const pkgPath = this.destinationPath('package.json');
    const pkg = this.fs.readJSON(pkgPath) || {};

    const scripts = {
      test: "jest --silent=false --config=jest.json --testRegex='/src/.*\\.test\\.ts$'",
      lint: 'tslint -c ./tslint.json -p ./tsconfig.json -t verbose',
      build: 'tsc -p ./tsconfig.json',
      watch: 'nodemon',
      'start:dev': 'node index.js',
      start: 'node dist/index.js',
    };

    pkg.main = pkg.main || 'dist/index.js';
    pkg.types = pkg.types || 'dist/index.d.ts';

    pkg['pre-commit'] = pkg['pre-commit'] || [];
    if (pkg['pre-commit'].indexOf('lint') < 0) {
      pkg['pre-commit'].push('lint');
    }

    pkg.scripts = { ...pkg.scripts, ...scripts };

    this.fs.writeJSON(pkgPath, pkg, null, 4);
  }

  /**
   * Copy a files from templates to destination
   * @param {string[]} files
   * @private
   */
  _copy(...files) {
    files.forEach((file) => {
      this.fs.copy(
        this.templatePath(file),
        this.destinationPath(file),
      );
    });
  }
};
