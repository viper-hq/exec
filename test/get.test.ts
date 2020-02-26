import exec from "../index";

test("get", () => {
  const bash = exec();

  const testStr = "hello";

  const res = bash.get`
    echo -n "${testStr}"
  `;

  expect(res).toBe(testStr);
});

test("get + stdin", () => {
  const testStr = "hello";

  const bash = exec("/bin/bash", s => s, {
    input: testStr
  });

  const res = bash.get`cat`;

  expect(res).toBe(testStr);
});

test("get + stdin", () => {
  const testStr = "hello";

  const bash = exec();

  const res = bash.get(testStr)`cat`;

  expect(res).toBe(testStr);
});

test("get + escape", () => {
  const escape = str => str.replace(/l/g, "b");
  const bash = exec("/bin/bash", escape);

  const testStr = "hello";

  const res = bash.get`
    echo -n "${testStr}"
  `;

  expect(res).toBe(testStr.replace(/l/g, "b"));
});

test("get + error", () => {
  const testStr = "hello";
  const toThrow = () => {
    const bash = exec();
    bash.get`
      >&2 echo "${testStr}"; exit 1
    `;
  };
  expect(toThrow).toThrow(testStr);
});
