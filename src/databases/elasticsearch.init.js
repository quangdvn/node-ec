'use strict';
const { Client: Client7 } = require('es7');

let client = {};

const instanceEventListeners = async (elasticClient) => {
  try {
    await elasticClient.ping();
    console.log('Successfully connected to Elastic Search v7');
  } catch (error) {
    console.error('Error connecting to ElasticSearch: ', error);
  }
};

const initElasticSearch = async ({
  ELASTICSEARCH_IS_ENABLED,
  ELASTICSEARCH_HOST,
}) => {
  if (ELASTICSEARCH_IS_ENABLED) {
    const elasticClient = new Client7({
      node: ELASTICSEARCH_HOST,
    });
    client.instance = elasticClient;
    instanceEventListeners(elasticClient);
  }
};

const getElasticSearch = () => client.instance;

module.exports = {
  initElasticSearch,
  getElasticSearch,
};
