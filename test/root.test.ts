import exec from "../index";

test("root", () => {
  const bash = exec();

  const testStr = "hello";

  bash`
    rm -rf .tmp/root.txt
    mkdir -p .tmp
    echo -n "${testStr}" > .tmp/root.txt
  `;

  expect(bash.get`cat .tmp/root.txt`).toBe(testStr);
});
