import Store from "./store";

import packageJson from '../../../package.json';
import buildNumber from '../../buildnumber.json';


class StoreUpdater {
    constructor() {
        this.storeVersion = new Store("settings");
        let data = this.storeVersion.restoreAll();
        if(data.length === 1) {
            if(packageJson.version !== data.version || buildNumber.build !== data.build) {
                // TODO: Check if update method exists
                this.storeVersion.store({id: 0, version: packageJson.version, build: buildNumber.build});
            }
        } else {
            this.init();
        }
    }
    init() {
        this.storeVersion.store({id: -1, version: packageJson.version, build: buildNumber.build});
    }
    
}

export default StoreUpdater;