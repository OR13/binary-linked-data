const { encode } = require("@digitalbazaar/cborld");

const freezeObjectContext = require("./src/freezeObjectContext");

const doc = {
  "@context": "https://vocab.example/v1",
  one: 1,
  two: "two",
  three: ["three"],
  four: { five: true },
};

const contexts = {
  "https://vocab.example/v1": {
    "@context": {
      "@vocab": "https://vocab.example/",
    },
  },
};

const documentLoader = (iri) => {
  if (contexts[iri]) {
    return {
      document: contexts[iri],
    };
  }
  throw new Error("unsupported iri");
};

it("resolve JSON-LD", async () => {
  const doc2 = await freezeObjectContext(doc, {
    documentLoader,
    contexts,
    deny: ["@vocab"],
  });
  expect(doc2["@context"]).toBe(
    "ipfs://bagaaiera7gesw252zbdnlbofc4wow2mnfsg4lcyoywznuxixpxe3sjayfw2a"
  );
  const norm = await encode({ jsonldDocument: doc2, documentLoader });
  expect(Buffer.from(norm).toString("hex")).toBe(
    "d90501a500a26700000000000000784400000000000000000000000000000000070000000002050200000000000000000004000000020000000000040000000000000000000000000000000300000000000002006d00000000000000000000000000a01866a11864f5186801186b81650000000000186c63000000"
  );
});
