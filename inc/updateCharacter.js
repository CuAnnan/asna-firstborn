import userHash from "./userHashFunction.js";
import MongoConnectionFactory from "./MongoConnectionFactory.js";

export default async function updateCharacter(interaction, character) {
    let playerHash = await userHash(interaction);
    let db = await MongoConnectionFactory.getInstance();
    try {
        await db.collection('sheets').findOneAndUpdate(
            {playerHash},
            {$set:{character:character.toJSON()}},
            {returnDocument:'after', upsert:true}
        );
    }
    catch (err) {
        console.error(err);
    }
}