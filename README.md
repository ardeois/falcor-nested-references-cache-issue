# Falcor nested references cache issue

Example page demonstrating an issue with nested references cache in Falcor.

Stack Overflow question: https://stackoverflow.com/questions/54770785/falcor-deep-nested-references-not-cached

## Scenario

Consider the following json graph response from Falcor server

```json
{
  "todos": {
    "0": { "$type": "ref", "value": ["todosById", "id_0"] },
    "1": { "$type": "ref", "value": ["todosById", "id_1"] },
    "length": 2
  },
  "todosById": {
    "id_0": {
      "name": "get milk",
      "label": { "$type": "ref", "value": ["labelsById", "lbl_0"] },
      "completed": false
    },
    "id_1": {
      "name": "do the laundry",
      "label": { "$type": "ref", "value": ["labelsById", "lbl_1"] },
      "completed": false
    }
  },
  "labelsById": {
    "lbl_0": { "name": "groceries" },
    "lbl_1": { "name": "home" }
  }
}

```

When we call `model.get` with the following path, all the jsonGraph result should be in cache:

```javascript
model.get(['todos', {from: 0, to: 1}, ['completed', 'label', 'name']])

// -> 
result = {
  "json": {
    "todos": {
      "0": {
        "completed": false,
        "label": undefined,
        "name": "get milk"
      },
      "1": {
        "completed": false,
        "label": undefined,
        "name": "do the laundry"
      }
    }
  }
}
```

However, manually accessing the cache, we can see `labelsById` is not in cache
Note: It looks like it's not in cache because it's a second level reference?

Assuming the first request path was called, we we call the following path, we should hit cache:

```javascript
model.get(['todos', 0, 'label', 'name'])

// this is not hitting cache !

```


### Running the app

```bash
npm i
npm start
```

Open chrome devtools to see the logs.

You can see an error log `Label name should be in cache!` proving the label request didn't hit the cache.

