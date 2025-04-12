import { Asset, LicenseType, ProjectType, StatusType } from "./asset";
import { Rating } from "./rating";

export class Sheet extends Asset {
    constructor(
       id: string,
         name: string,
         label: string,
         publisher: string,
         publisherMail: string,
         publishDate: Date,
         license: LicenseType,
         status: StatusType,
         image: string,
         description: string,
         documentation: string,
         projectType: ProjectType,
         ratings:Rating[]=[],
         comments:Comment[]=[],
      public icon: string 
    ) {
      super(id, name,label, publisher, publisherMail, publishDate, license, status,image, description,documentation,'Sheet',projectType, ratings, comments);
    }
  }
  