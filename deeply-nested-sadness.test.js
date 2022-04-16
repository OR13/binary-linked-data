const { encode } = require("@digitalbazaar/cborld");

const freezeObjectContext = require("./src/freezeObjectContext");

const doc = {
  "@context": "https://vocab.example/v1",
  one: 1,
  two: "two",
  three: ["three"],
  four: { five: true },
  six: {
    "@id": "urn:uuid:123",
    seven: {
      eight: {
        nine: ["urn:uuid:456"],
      },
    },
  },
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

it("should handle deeply nested sadness well", async () => {
  const doc2 = await freezeObjectContext(doc, {
    documentLoader,
    contexts,
    deny: ["@vocab"],
  });
  expect(doc2["@context"]).toBe(
    "ipfs://bagaaieramfyjmlicpbuo4cegrjnzjyjunxhkcu6ig2uncsxmkss7ufodk6hq"
  );
  const norm = await encode({ jsonldDocument: doc2, documentLoader });
  expect(Buffer.from(norm).toString("hex")).toBe(
    "d90501a600a26700000000000000784400000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000060000020000000000000000000700000000000600006d00000000000000000000000000a01868a11866f5186c011870a204a16500000000006c000000000000000000010203186ea11864a1186b816c000000000000000000040506187381650000000000187463000000"
  );
});
