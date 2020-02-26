import exec from "../index";

test("pipe", () => {
  const bash = exec();

  const testStr = "hello";

  bash.pipe(testStr)`
    rm -rf .tmp/pipe.txt
    mkdir -p .tmp
    cat > .tmp/pipe.txt
  `;

  expect(bash.get`cat .tmp/pipe.txt`).toBe(testStr);
});
