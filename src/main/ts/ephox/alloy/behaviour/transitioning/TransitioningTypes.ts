import * as Behaviour from '../../api/behaviour/Behaviour';
import { AlloyComponent } from 'ephox/alloy/api/component/ComponentApi';
import { Option } from '@ephox/katamari';
import { TransitionRoute } from 'ephox/alloy/behaviour/transitioning/TransitionApis';


export interface TransitioningBehaviour extends Behaviour.AlloyBehaviour {
  config: (config: TransitioningConfigSpec) => Behaviour.NamedConfiguredBehaviour;
  findRoute?: <T>(comp: AlloyComponent, route: TransitionRoute) => Option<T>;
  disableTransition?: (comp: AlloyComponent) => void;
  getCurrentRoute?: any;
  jumpTo?: (comp: AlloyComponent, destination: string) => void;
  progressTo?: (comp: AlloyComponent, destination: string) => void;
  getState?: any;
  createRoutes?: (route: TransitionRoute) => {};
  createBistate?: (first: string, second: string, transitions: TransitionProperties) => { key: string, value: any};
  createTristate?: (first: string, second: string, third: string, transitions: TransitionProperties) => { key: string, value: any};
}

export interface TransitioningConfig {
  destinationAttr: () => string;
  stateAttr: () => string;
  initialState: () => string;
  routes: () => Record<string, any>;
  onTransition: () => (comp: AlloyComponent, route: TransitionRoute) => void;
  onFinish: () => (comp: AlloyComponent, destination: string) => void;
}

export interface TransitioningConfigSpec {
  destinationAttr?: string;
  stateAttr?: string;
  initialState: string;
  routes: Record<string, any>;
  onTransition?: (comp: AlloyComponent, route: TransitionRoute) => void;
  onFinish?: (comp: AlloyComponent, destination: string) => void;
}
export interface TransitionProperties {
  transition: {
    property: string,
    transitionClass: string
  };
}

export type TransitioningInitialState = 'before' | 'current' | 'after';
