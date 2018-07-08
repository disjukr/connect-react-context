# connect-react-context
like react-redux, connect react context to props. support typescript.

## usage
```tsx
import * as React from 'react';
import { connectContext } from 'connect-react-context';
import { joinContext, ContextValues } from 'join-react-context';

const helloContext = React.createContext('hello');
const worldContext = React.createContext('world');
type Contexts = [ typeof helloContext, typeof worldContext ];
const { Provider, Consumer } = joinContext<Contexts>([ helloContext, worldContext ]);

const App = () => (
    <Provider value={[ 'hello', 'world' ]}>
        <ConnectedComponent c='!'/>
    </Provider>
);

interface ComponentProps {
    a: string;
    b: string;
    c: string;
}
const Component: React.SFC<ComponentProps> = ({ a, b, c }) => (
    <div>{ a }, { b }{ c }</div>
);
const ConnectedComponent = connectContext<ContextValues<Contexts>, ComponentProps, 'a' | 'b'>(
    Consumer,
    ([ hello, world ], props) => ({ a: hello, b: world, ...props }),
)(Component);
```
