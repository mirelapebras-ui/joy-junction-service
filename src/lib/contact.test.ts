import { describe, it } from "node:test";
import { strict as assert } from "node:assert";
import { contactMailto } from "./contact";

describe("contact destination", () => {
  it("prepares the message for the address supplied by Mirela", () => {
    const link = contactMailto({ nome: "Ana", email: "ana@example.com", assunto: "Pacotes & sessões", mensagem: "Gostaria de informações." });
    assert.equal(link.split("?")[0], "mailto:mirelapebras@gmail.com");
    const search = new URLSearchParams(link.split("?")[1]);
    assert.equal(search.get("subject"), "Pacotes & sessões");
    assert.equal(search.get("body"), "Nome: Ana\nE-mail para resposta: ana@example.com\n\nGostaria de informações.");
  });
});