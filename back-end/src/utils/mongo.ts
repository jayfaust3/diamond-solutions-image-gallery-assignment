import { Document, MongoClient, ServerApiVersion } from 'mongodb';

export const getMongoDbCollectionClient = async <TCollectionType extends Document = Document>(collectionName: string) => {
    const {
        MONGODB_CLUSTER_URI: clusterUri,
        MONGODB_DB_NAME: dbName
    } = process.env;

    if (!clusterUri || !dbName) throw new Error('Missing MongoDb configuration');

    const client = new MongoClient(clusterUri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
    });

    await client.connect();

    const db = client.db(dbName);

    return db.collection<TCollectionType>(collectionName);
};
