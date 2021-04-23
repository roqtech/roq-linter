module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'No spaces in object definitions',
      category: 'Stylistic Issues',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/dHjP-no-spaces-in-object-definition',
    },
    schema: [], // no options
  },
  create(context) {
    function report(node) {
      context.report({
        node,
        message: 'Avoid spaces in object definition',
        data: {
          identifier: node,
        },
      });
    }
    function checkForObject(node) {
      if (node.properties.length === 0) {
        return;
      }

      let prev = node.properties[0];
      for (let i = 1; i < node.properties.length; i += 1) {
        const curr = node.properties[i];

        if (curr.loc.start.line - prev.loc.end.line > 1) {
          report(curr);
        }

        prev = curr;
      }
    }

    return {
      ObjectPattern: checkForObject,

      ObjectExpression: checkForObject,
    };
  },
};
