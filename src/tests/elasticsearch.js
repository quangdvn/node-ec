const {
  initElasticSearch,
  getElasticSearch,
} = require('../databases/elasticsearch.init');

initElasticSearch({
  ELASTICSEARCH_IS_ENABLED: process.env.ELASTICSEARCH_IS_ENABLED,
  ELASTICSEARCH_HOST: process.env.ELASTICSEARCH_HOST,
});

const esClient = getElasticSearch();

const searchDocument = async (index, docType, payload) => {
  const result = await esClient.search({
    index,
    type: docType,
    body: {
      size: 20,
    },
  });
  console.log('Search: ', result?.body?.hits?.hits);
};

const addDocument = async (index, _id, docType, payload) => {
  try {
    const result = await esClient.index({
      index,
      type: docType,
      id: _id,
      body: payload,
    });
    console.log('Add: ', result);
  } catch (error) {
    console.log('Error: ', error);
  }
};

module.exports = {
  searchDocument,
  addDocument,
};
