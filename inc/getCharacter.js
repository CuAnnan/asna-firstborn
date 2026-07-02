import ObjectCache from "./ObjectCache.js";
import userHash from "./userHashFunction.js";
import Character from "#Model/Character/Character.js";
import MongoConnectionFactory from "./MongoConnectionFactory.js";

export default async function getCharacter(interaction) {
    let oc = ObjectCache.getInstance();
    let playerHash = await userHash(interaction);
    let character = oc.get(playerHash);
    let db = await MongoConnectionFactory.getInstance();
    if(!character) {
        const collection = db.collection("sheets");
        let characterJSON= await collection.findOne({playerHash});
        if(characterJSON)
        {
            character = Character.fromJSON(characterJSON.character);
            oc.set(playerHash, character);
        }
    }
    if(!character) {
        character = new Character();
        oc.set(playerHash, character);
    }
    return character;
}