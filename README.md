# Simplified exec in NodeJs

[![npm](https://img.shields.io/npm/v/@viperhq/exec.svg)](https://www.npmjs.com/package/@viperhq/exec)

## User input should be escaped!

### Running bash

```JavaScript
const bash = exec('/bin/bash', escapeBash);
const dirname = '/dev';

bash`
  ls -la ${dirname} > .tmp/dir.txt
  aws s3 cp .tmp/dir.txt s3://out/dir.txt
  rm .tmp/dir.txt
`
```

### Getting things out of bash

```JavaScript
const bash = exec();

const dir = bash.get`
  ls -la
`;

console.log(dir);
```

### Standard input

```JavaScript
const bash = exec();

const longString = 'longstring';

const processed = bash.get(longString)`
  cat | ./process
`;

console.log(processed);
```

### Or

```JavaScript
const bash = exec();

const longString = 'longstring';

bash.pipe(longString)`
  cat | ./process > .tmp/out.bin
  aws s3 cp .tmp/dir.txt s3://out/out.bin
  rm .tmp/out.bin
`;
```

### Async

```JavaScript
const bash = exec();

const longString = 'longstring';

const proc = bash.async`
  cat | ./process
`;

proc.stdin.end(longString);

let result = '';
process.stdout.on('data', chunk => (result += chunk));
process.stdout.end(() => console.log(result));
```

