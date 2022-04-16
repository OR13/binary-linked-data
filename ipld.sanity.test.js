const { CID } = require("multiformats/cid");
const json = require("multiformats/codecs/json");
const { sha256 } = require("multiformats/hashes/sha2");

const doc = { hello: "world" };

const documentLoader = (iri) => {
  if (iri === "bagaaierasords4njcts6vs7qvdjfcvgnume4hqohf65zsfguprqphs3icwea") {
    return { document: doc };
  }
};

it("resolve multiformat", async () => {
  const bytes = json.encode(doc);
  const hash = await sha256.digest(bytes);
  const cid = CID.create(1, json.code, hash);
  const { document } = await documentLoader(cid.toString());
  expect(document).toEqual(doc);
});
