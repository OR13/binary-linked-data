const jsonld = require("jsonld");

const documentLoader = (iri) => {
  if (iri === "https://vocab.example/v1") {
    return {
      document: {
        "@context": {
          "@vocab": "https://vocab.example/",
        },
      },
    };
  }
  throw new Error("unsupported iri");
};

it("resolve JSON-LD", async () => {
  const doc = {
    "@context": "https://vocab.example/v1",
    one: 1,
    two: "two",
    three: ["three"],
    four: { five: true },
  };
  const norm = await jsonld.canonize(doc, {
    documentLoader,
  });
  expect(norm).toBe(`_:c14n0 <https://vocab.example/four> _:c14n1 .
_:c14n0 <https://vocab.example/one> "1"^^<http://www.w3.org/2001/XMLSchema#integer> .
_:c14n0 <https://vocab.example/three> "three" .
_:c14n0 <https://vocab.example/two> "two" .
_:c14n1 <https://vocab.example/five> "true"^^<http://www.w3.org/2001/XMLSchema#boolean> .
`);
});
