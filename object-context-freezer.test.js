const jsonld = require("jsonld");
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
  const doc2 = await freezeObjectContext(doc, { documentLoader, contexts });
  expect(doc2["@context"]).toBe(
    "ipfs://bagaaierahuum3tcg4533j2e7n7asfk5rqktnxg4p5nv64xbmrdwnk5vlvala"
  );
  const norm = await jsonld.canonize(doc2, {
    documentLoader,
  });
  expect(norm).toBe(`_:c14n0 <https://vocab.example/four> _:c14n1 .
_:c14n0 <https://vocab.example/one> "1"^^<http://www.w3.org/2001/XMLSchema#integer> .
_:c14n0 <https://vocab.example/three> "three" .
_:c14n0 <https://vocab.example/two> "two" .
_:c14n1 <https://vocab.example/five> "true"^^<http://www.w3.org/2001/XMLSchema#boolean> .
`);
});
