import rule, { messages, ruleName } from "..";

// testRule(rule, {
//   ruleName,
//   config: [
//     "always",
//     {
//       ignore: ["/transparent|inherit/"],
//       include: ["/color/", "/shadow/", "border"]
//     }
//   ],
//   syntax: "scss",
//   accept: [
//     { code: ".foo { color: $ui-01; }" },
//     { code: ".foo { box-shadow: 0 0 5px $ui-01, 0 0 10px $ui-02; }" }
//   ],

//   reject: [
//     {
//       code: ".foo { background-color: #f4f4f4; }",
//       message: messages.expected
//     },
//     {
//       code: ".foo { color: #fcfcfc; }",
//       message: messages.expected
//     }
//   ]
// });

testRule(rule, {
  ruleName,
  config: ["always", { ignoreValues: ["map-get", "/^my-/i", "/funct$/"] }],
  syntax: "scss",
  accept: [{ code: ".foo { color: $ui-01; }" }],

  reject: [
    {
      code: ".foo { color: #fcfcfc; }",
      message: messages.expected,
    },
  ],
});
