import { AssetType } from "../enums/AssetType";
import { LicenseType } from "../enums/LicenseType";
import { ProjectType } from "../enums/ProjectType";
import { StatusType } from "../enums/StatusType";
import { Rating } from "./rating";
import { Tag } from './tag';
import { Category } from './category';
import { AssetRelease } from "./asset-release";
export class Asset {
        constructor(
          public id: string,
          public name: string,
          public type: AssetType,         
          public label: string,
          public publisher: string,
          public publisherMail: string,
          public publishDate: Date,
          public license: LicenseType,
          public status: StatusType,
          public image: string,
          public description: string,
          public downloadCount: number,
          public documentation: string,
          public projectType: ProjectType,
          public tags: Tag[],           
          public categories: Category[], 
          public releases?: AssetRelease[],
          public parentAsset: Asset | null = null,
          public ratings?:Rating[],
          public comments?:Comment[],
          public averageRating?: number,
          public reviewsCount?: number,
        ) {
         
        }
      
        
      
}
