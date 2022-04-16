const { encode } = require("@digitalbazaar/cborld");

const documentLoader = (iri) => {
  if (iri === "https://vocab.example/v1") {
    return {
      document: {
        "@context": {
          one: "https://vocab.example/one",
          two: "https://vocab.example/two",
          three: "https://vocab.example/three",
          four: "https://vocab.example/four",
          five: "https://vocab.example/five",
        },
      },
    };
  }
  throw new Error("unsupported iri");
};

it("compress JSON-LD to CBOR-LD", async () => {
  const doc = {
    "@context": "https://vocab.example/v1",
    one: 1,
    two: "two",
    three: ["three"],
    four: { five: true },
  };
  const norm = await encode({ jsonldDocument: doc, documentLoader });
  expect(Buffer.from(norm).toString("hex")).toBe(
    "d90501a500a2670000000000000078180000000000000000000000000000000000000000000000016d00000000000000000000000000a01866a11864f5186801186b81650000000000186c63000000"
  );
});
