const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { makeExecutableSchema } = require('graphql-tools');
const { User } = require('./models');
const { genResolvers, genProjection } = require('../../');

const config = {
  User: {
    proj: {
      alters: {
        query: null,
        select: 'nested',
        recursive: true,
      },
    },
  },
  ExtraInfo: {
    prefix: 'nested.',
    proj: {
      field3: 'mongoC',
    },
  },
};
const project = genProjection(config);
const resolvers = genResolvers(config);

module.exports = makeExecutableSchema({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
  resolvers: _.merge(resolvers, {
    Query: {
      async user(parent, args, context, info) {
        const proj = project(info);
        const result = await User.findById(args.id, proj);
        return result.toObject();
      },
    },
  }),
});