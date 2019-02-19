import * as Rx from "rxjs";
import * as falcor from 'falcor';


const graph = {
    todos: {
        0: { $type: 'ref', value: ['todosById', 'id_0'] },
        1: { $type: 'ref', value: ['todosById', 'id_1'] },
        length: 2,
    },
    todosById: {
        id_0: {
            name: 'get milk',
            label: { $type: 'ref', value: ['labelsById', 'lbl_0'] },
            completed: false
        },
        id_1: {
            name: 'do the laundry',
            label: { $type: 'ref', value: ['labelsById', 'lbl_1'] },
            completed: false
        }
    },
    labelsById: {
        lbl_0: { name: 'groceries' },
        lbl_1: { name: 'home' }
    }
};

const TODOS_PATH = ['todos', {from: 0, to: 1}, ['completed', 'label', 'name']];
const LABEL_PATH = ['labelsById', 'lbl_0', 'name'];

class FakeDatasource {

    get(paths) {
        let result = {jsonGraph: {}, paths};
        if (JSON.stringify(paths) === JSON.stringify([TODOS_PATH])) {
            result = {
                jsonGraph: graph,
                paths
            };
        } else if (JSON.stringify(paths) === JSON.stringify([LABEL_PATH])) {
            // This path should not be called as it should be in cache already
            console.error('Label name should be in cache!', paths);
            result = {
                jsonGraph: {
                    labelsById: graph.labelsById
                },
                paths
            }
        } else {
            console.error('unknown path', paths);
        }
        return Rx.Observable.of(result);
    }

}

const model = new falcor.Model({ source: new FakeDatasource() });

window.model = model;

model.get(TODOS_PATH).then(response => {
    console.log('TODOS', response);

    // This should hit cache but it's not
    model.get(LABEL_PATH).then(label => {
        console.log('LABEL', label);
    });
});