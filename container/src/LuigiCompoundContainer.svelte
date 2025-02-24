<svelte:options
  customElement={{
    tag: null,
    props: {
      viewurl: { type: 'String', reflect: false, attribute: 'viewurl' },
      deferInit: { type: 'Boolean', attribute: 'defer-init' },
      context: { type: 'String', reflect: false, attribute: 'context' },
      compoundConfig: {
        type: 'Object',
        reflect: false,
        attribute: 'compound-config',
      },
      nodeParams: { type: 'Object', reflect: false, attribute: 'node-params' },
      userSettings: {
        type: 'Object',
        reflect: false,
        attribute: 'user-settings',
      },
      anchor: { type: 'String', reflect: false, attribute: 'anchor' },
      searchParams: {
        type: 'Object',
        reflect: false,
        attribute: 'search-params',
      },
      pathParams: { type: 'Object', reflect: false, attribute: 'path-params' },
      clientPermissions: {
        type: 'Object',
        reflect: false,
        attribute: 'client-permissions',
      },
    },
    extend: (customElementConstructor) => {
      let notInitFn = (name) => {
        return () =>
          console.warn(
            name +
              " can't be called on luigi-container before its micro frontend is attached to the DOM.",
          );
      };
      return class extends customElementConstructor {
        updateContext = notInitFn('updateContext');
        attributeChangedCallback(name, oldValue, newValue) {
          if (this.containerInitialized && name === 'context') {
            this.updateContext(JSON.parse(newValue));
          }
        }
      };
    },
  }}
/>

<script lang="ts">
  import { onMount } from 'svelte';
  import { ContainerService } from './services/container.service';
  import { WebComponentService } from './services/webcomponents.service';
  import { Events } from './constants/communication';
  import { GenericHelperFunctions } from './utilities/helpers';

  export let viewurl: string;
  export let webcomponent: any;
  export let context: string;
  export let deferInit: boolean;
  export let compoundConfig: any;
  export let nodeParams: any;
  export let searchParams: any;
  export let pathParams: any;
  export let clientPermissions: any;
  export let userSettings: any;
  export let anchor: string;

  let containerInitialized = false;
  let mainComponent: HTMLElement;
  let eventBusElement: HTMLElement;

  const containerService = new ContainerService();
  const webcomponentService = new WebComponentService();

  // Only needed for get rid of "unused export property" svelte compiler warnings
  export const unwarn = () => {
    return (
      nodeParams &&
      searchParams &&
      pathParams &&
      clientPermissions &&
      userSettings &&
      anchor
    );
  };

  const initialize = (thisComponent: any) => {
    if (!compoundConfig || containerInitialized) {
      return;
    }
    thisComponent.updateContext = (contextObj: any, internal?: any) => {
      mainComponent._luigi_mfe_webcomponent.context = contextObj;
    };
    const ctx = GenericHelperFunctions.resolveContext(context);
    deferInit = false;

    const node = {
      compound: compoundConfig,
      viewUrl: viewurl,
      webcomponent:
        GenericHelperFunctions.checkWebcomponentValue(webcomponent) || true,
    }; // TODO: fill with sth
    webcomponentService
      .renderWebComponentCompound(node, mainComponent, ctx)
      .then((compCnt) => {
        eventBusElement = compCnt as HTMLElement;
        if (thisComponent.hasAttribute('skip-init-check') || !node.viewUrl) {
          thisComponent.initialized = true;
          setTimeout(() => {
            webcomponentService.dispatchLuigiEvent(Events.INITIALIZED, {});
          });
        } else if (
          (eventBusElement as any).LuigiClient &&
          !(eventBusElement as any).deferLuigiClientWCInit
        ) {
          thisComponent.initialized = true;
          webcomponentService.dispatchLuigiEvent(Events.INITIALIZED, {});
        }
      });
    containerInitialized = true;
    thisComponent.containerInitialized = true;
  };

  onMount(async () => {
    const thisComponent: any = (mainComponent.getRootNode() as ShadowRoot).host;

    thisComponent.init = () => {
      initialize(thisComponent);
    };
    if (!deferInit) {
      initialize(thisComponent);
    }

    containerService.registerContainer(thisComponent);
    webcomponentService.thisComponent = thisComponent;
  });
</script>

<main bind:this={mainComponent} />

<style>
  main {
    width: 100%;
    height: 100%;
    border: none;
  }
</style>
