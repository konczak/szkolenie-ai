import {QdrantClient} from '@qdrant/js-client-rest';


const qdrant = new QdrantClient({url: process.env.QDRANT_URL});

export async function getQdrantCollections() {
  return await qdrant.getCollections();
}

export async function isCollectionIndexed(collectionName) {
  const collections = await getQdrantCollections();

  const indexed = collections.collections.find((collection) => collection.name === collectionName);
  return !!indexed;
}

export async function createCollection(collectionName) {
  await qdrant.createCollection(collectionName, {vectors: {size: 1536, distance: 'Cosine', on_disk: true}});
}

export async function getCollectionInfo(collectionName) {
  return await qdrant.getCollection(collectionName);
}

export async function insertInto(collectionName, points) {
  console.log('sample to insert', points[0]);
  await qdrant.upsert(collectionName, {
    wait: true,
    batch: {
      ids: points.map((point) => (point.id)),
      vectors: points.map((point) => (point.vector)),
      payloads: points.map((point) => (point.payload)),
    },
  });
}

export async function findOne(collectionName, queryEmbedding, customFilter) {
  let filter;
  if (customFilter) {
    filter = customFilter;
  } else {
    filter = {
      must: [
        {
          key: 'collection',
          match: {
            value: collectionName
          }
        }
      ]
    };
  }

  console.log('findOne - going to use filter', filter);

  return await qdrant.search(collectionName, {
    vector: queryEmbedding,
    limit: 1,
    filter,
  });
}
