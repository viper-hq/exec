import exec from "../index";

test("async", done => {
  const bash = exec();

  const testStr = "hello";

  const p = bash.async`cat`;

  p.stdin.end(testStr);

  let res = "";
  p.stdout.on("data", s => (res += s));
  p.stdout.on("end", () => {
    expect(res).toBe(testStr);
    done();
  });
});
