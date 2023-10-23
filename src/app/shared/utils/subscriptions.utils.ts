import { Subscription } from "rxjs";

export const storeSubscriptions = (storeSubscriptions: Array<Subscription>, subscription: Subscription) => {
    storeSubscriptions.push(subscription);
}

export const clearSubscriptions = (lsSubscriptions: Array<Subscription>) => {
    lsSubscriptions.forEach((subs: Subscription) => subs?.unsubscribe());
}