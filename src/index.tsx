import * as React from 'react';

type ConnectedComponentProps<
    TOwnProps,
    TConnectedPropNames extends keyof TOwnProps,
> = Readonly<Partial<TOwnProps> & Pick<TOwnProps, Exclude<keyof TOwnProps, TConnectedPropNames>>>;

export interface ConnectOption {
    pure: boolean;
    withRef: boolean;
}

export function connectContext<
    TContext,
    TOwnProps,
    TConnectedPropNames extends keyof TOwnProps,
>(
    Consumer: React.Consumer<TContext>,
    connectContextToProps: (value: TContext, props: ConnectedComponentProps<TOwnProps, TConnectedPropNames>) => TOwnProps,
    options?: Readonly<Partial<ConnectOption>>,
): (Component: React.ComponentType<TOwnProps>) => React.ComponentType<ConnectedComponentProps<TOwnProps, TConnectedPropNames>> {
    type Props = ConnectedComponentProps<TOwnProps, TConnectedPropNames>;
    const {
        pure = true,
        withRef = false,
    } = options || {};
    if (pure || withRef) {
        const ReactComponent = pure ? React.PureComponent : React.Component;
        if (withRef) {
            return (Component: any) => class extends ReactComponent<Props> {
                private _ref: React.RefObject<any> = React.createRef();
                getWrappedInstance() { return this._ref.current; }
                render() {
                    const { props } = this;
                    return <Consumer>{
                        value => <Component ref={this._ref} {...connectContextToProps(value, props)}/>
                    }</Consumer>;
                }
            };
        }
        return Component => class extends ReactComponent<Props> {
            render() {
                const { props } = this;
                return <Consumer>{
                    value => <Component {...connectContextToProps(value, props)}/>
                }</Consumer>;
            }
        };
    } else {
        return Component => (props: Props) => <Consumer>{
            value => <Component {...connectContextToProps(value, props)}/>
        }</Consumer>;
    }
}
