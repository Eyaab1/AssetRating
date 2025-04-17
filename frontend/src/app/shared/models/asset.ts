import { AssetType } from "../enums/AssetType";
import { LicenseType } from "../enums/LicenseType";
import { ProjectType } from "../enums/ProjectType";
import { StatusType } from "../enums/StatusType";
import { Rating } from "./rating";

export class  Asset {
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
