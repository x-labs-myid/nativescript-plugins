import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedRootbeer } from '@demo/shared';
import { Rootbeer } from '@x-labs-myid/rootbeer';

export function navigatingTo(args: EventData) {
  const page = <Page>args.object;
  page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedRootbeer {
  constructor() {
    super();
    console.log('Rootbeer demo initialized');
  }
}
