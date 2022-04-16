const jsonld = require("jsonld");
const { CID } = require("multiformats/cid");
const json = require("multiformats/codecs/json");
const { sha256 } = require("multiformats/hashes/sha2");
const canonicalize = require("canonicalize");
const forbiddenMapper = {
  "@vocab": async (document, context, documentLoader) => {
    let newContext = JSON.parse(JSON.stringify(context));
    const d = await jsonld.flatten(document, context, { documentLoader });
    for (const g of d["@graph"]) {
      for (const n of Object.keys(g)) {
        if (n.startsWith("@")) {
          continue;
        }
        newContext["@context"][n] = newContext["@context"]["@vocab"] + n;
      }
    }
    return newContext;
  },
};

const fixDeniedKey = async (key, document, context, documentLoader) => {
  let obj = JSON.parse(JSON.stringify(context));
  obj = {
    ...obj,
    ...(await forbiddenMapper[key](document, context, documentLoader)),
  };
  delete obj["@context"][key];
  return obj;
};

const getContext = async (iri, { doc, documentLoader, contexts, deny }) => {
  let { document: context } = await documentLoader(iri);
  for (const key of Object.keys(context["@context"])) {
    if (deny && deny.includes(key)) {
      context = await fixDeniedKey(key, doc, context, documentLoader);
    }
  }
  return canonicalize(context);
};

const freezeObjectContext = async (doc, { documentLoader, contexts, deny }) => {
  const contextUrl = doc["@context"];
  const context = await getContext(contextUrl, {
    doc,
    documentLoader,
    contexts,
    deny,
  });
  const bytes = json.encode(context);
  const hash = await sha256.digest(bytes);
  const cid = CID.create(1, json.code, hash);
  const contextUrl2 = `ipfs://` + cid.toString();
  // this would be a publish to a network...
  contexts[contextUrl2] = context;
  const doc2 = { ...doc };
  doc2["@context"] = contextUrl2;
  return doc2;
};
module.exports = freezeObjectContext;
