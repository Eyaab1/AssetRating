import { AssetType } from "../enums/AssetType";
import { LicenseType } from "../enums/LicenseType";
import { ProjectType } from "../enums/ProjectType";
import { StatusType } from "../enums/StatusType";
import { Rating } from "./rating";
export type AssetType = 'Utility' | 'Widget' | 'Sheet' | 'Theme' | 'Template';
export type LicenseType = 'Free' | 'Paid';
export type StatusType = 'published' | 'unpublished' | 'deleted';
export type ProjectType='Frontend' | 'Backend' | 'Fullstack' | 'Desktop' | 'Web' | 'Framework' | 'Plugin' ;
export type types = 'Widget' | 'Utility' | 'Sheet' | 'Theme' | 'Template';
export class Asset {
        constructor(
          public id: string,
          public name: string,
          public type: types,         
          public label: string,
          public publisher: string,
          public publisherMail: string,
          public publishDate: Date,
          public license: LicenseType,
          public status: StatusType,
          public image: string,
          public description: string,
          public documentation: string,
          public projectType: ProjectType,
          public ratings?:Rating[],
          public comments?:Comment[],
        ) {
          // if (ratings) {
          //   this.ratings = ratings.map(r => new Rating(r));
          // }
          
          // if (comments) {
          //   this.comments = comments.map(c => new Comment(c));
          // }
        }
      
        
      
}
