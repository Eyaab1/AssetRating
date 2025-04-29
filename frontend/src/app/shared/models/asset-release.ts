import { Asset } from "./asset";

export class AssetRelease {
    constructor(
        public id: number,
        public releaseVersion: string,
        public publishedDate: Date,
        public asset: Asset,
        public releasedAsset: Asset
      ) {}
}
