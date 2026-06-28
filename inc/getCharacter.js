import ObjectCache from "./ObjectCache.js";
import userHash from "./userHashFunction.js";
import Character from "../Model/Character/Character.js";

export default async function getCharacter(interaction) {
    let oc = ObjectCache.getInstance();
    let playerHash = await userHash(interaction);
    let character = oc.get(playerHash);
    if(!character)
    {
        character = new Character();
        oc.set(playerHash, character);
    }
    return character;
}