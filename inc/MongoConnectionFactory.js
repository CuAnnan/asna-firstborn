import {MongoClient} from 'mongodb';

class MongoConnectionFactory
{
    static #instantiated;

    static async init(conf)
    {
        if(!this.#instantiated)
        {
            MongoConnectionFactory.Instance = null;
            console.log("Running initial connection");
            let mongoUrl = `mongodb://${conf.mongo.user}:${encodeURIComponent(conf.mongo.password)}@${conf.mongo.host}/${conf.mongo.db}?directConnection=true&authSource=admin`;
            MongoConnectionFactory.MongoClient = new MongoClient(mongoUrl);
            console.log(mongoUrl);
            console.log("Client created");
            await MongoConnectionFactory.MongoClient.connect();
            console.log("Connected to mongo");
            MongoConnectionFactory.Instance = MongoConnectionFactory.MongoClient.db(conf.db);
            this.#instantiated = true;
        }
        return MongoConnectionFactory.Instance;
    }

    static getClient()
    {
        let instance = MongoConnectionFactory.getInstance();
        return instance.MongoClient;
    }

    static getInstance()
    {
        if(!MongoConnectionFactory.Instance)
        {
            throw new Error('No instance of the connection created');
        }
        return MongoConnectionFactory.Instance;
    }

    static async close()
    {
        await MongoConnectionFactory.MongoClient.close();
        delete MongoConnectionFactory.MongoClient;
        delete MongoConnectionFactory.Instance;
    }
}



export default MongoConnectionFactory;